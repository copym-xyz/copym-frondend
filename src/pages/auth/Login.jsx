// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail, Shield } from 'lucide-react';
import { api } from '@/services/api';
import { setCredentials } from '@/store/slices/authSlice';
import { showToast } from '@/utils/toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [tempToken, setTempToken] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      console.log("Attempting login with:", { email: credentials.email });
      try {
        const response = await api.post('/auth/login', credentials);
        console.log('Login response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Login error', error.response || error);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data.requiresTwoFactor) {
        setShowTwoFactor(true);
        setTempToken(data.tempToken);
        showToast.info('Two-Factor Authentication Required', 'Please enter your 2FA code to continue');
      } else {
        handleLoginSuccess(data);
      }
    },
    onError: (error) => {
      showToast.error('Login Failed', error.message || 'Invalid credentials');
    }
  });

  const verifyTwoFactorMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/auth/2fa/verify', {
        token: tempToken,
        code: data.code
      });
      return response.data;
    },
    onSuccess: (data) => {
      handleLoginSuccess(data);
    },
    onError: (error) => {
      showToast.error('Verification Failed', error.message || 'Invalid 2FA code');
    }
  });

  const handleLoginSuccess = (data) => {
    dispatch(setCredentials(data));
    switch (data.user.role) {
      case 'super_admin':
      case 'institution_admin':
      case 'institution_user':
        navigate('/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showTwoFactor) {
      await verifyTwoFactorMutation.mutateAsync({ code: twoFactorCode });
    } else {
      await loginMutation.mutate({ email, password });
    }
  };

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    },
    onSuccess: () => {
      showToast.success('Password Reset Email Sent', 'Please check your email for further instructions');
    },
    onError: (error) => {
      showToast.error('Error', error.message || 'Failed to send reset email');
    }
  });

  const handleForgotPassword = async () => {
    if (!email) {
      showToast.error('Email Required', 'Please enter your email address');
      return;
    }
    await forgotPasswordMutation.mutateAsync(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="flex items-center justify-center mt-2 text-sm text-gray-500">
            Create account?{' '}
            <Button variant="link" onClick={() => navigate('/register')}>
              Register
            </Button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!showTwoFactor ? (
            <>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="pl-10" />
                </div>
                <div className="relative mt-4">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="pl-10" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button type="button" variant="link" onClick={handleForgotPassword} className="font-medium text-primary hover:text-primary/90">
                  Forgot your password?
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-md shadow-sm">
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input type="text" required value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} placeholder="Enter 2FA Code" className="pl-10" />
              </div>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loginMutation.isLoading || verifyTwoFactorMutation.isLoading}>
            {loginMutation.isLoading || verifyTwoFactorMutation.isLoading ? 'Processing...' : showTwoFactor ? 'Verify Code' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;