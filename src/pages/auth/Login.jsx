import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail, Shield, ArrowLeft } from 'lucide-react';
import { api } from '@/services/api';
import { setCredentials } from '@/store/slices/authSlice';
import { showToast } from '@/utils/toast';

const GlowingBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-lg blur-3xl opacity-20 animate-pulse"></div>
    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400 rounded-lg blur-3xl opacity-10 animate-pulse delay-700"></div>
  </div>
);

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
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.requiresTwoFactor) {
        setShowTwoFactor(true);
        setTempToken(data.tempToken);
        showToast.info('Two-Factor Authentication Required');
      } else {
        handleLoginSuccess(data);
      }
    },
    onError: (error) => {
      showToast.error(error.message || 'Invalid credentials');
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
      showToast.error(error.message || 'Invalid 2FA code');
    }
  });

  const handleLoginSuccess = (data) => {
    dispatch(setCredentials({
      token: data.token,
      user: data.user
    }));
    navigate(data.user.role === 'super_admin' ? '/dashboard' : 
            data.user.role === 'institution_admin' ? '/institution-dashboard' : 
            '/user-dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showTwoFactor) {
      await verifyTwoFactorMutation.mutateAsync({ code: twoFactorCode });
    } else {
      await loginMutation.mutate({ email, password });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <GlowingBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <Button 
          variant="ghost" 
          className="absolute left-0 -top-16 text-white hover:text-blue-400"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="w-full bg-slate-900/80 backdrop-blur-lg border-slate-800 p-8">
          <div className="text-center mb-8">
            <div className="mb-6 p-3 bg-blue-500/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!showTwoFactor ? (
              <>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/forgot-password')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </Button>
                </div>
              </>
            ) : (
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="Enter 2FA Code"
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white"
              disabled={loginMutation.isLoading || verifyTwoFactorMutation.isLoading}
            >
              {loginMutation.isLoading || verifyTwoFactorMutation.isLoading ? 
                'Processing...' : 
                showTwoFactor ? 'Verify Code' : 'Sign in'}
            </Button>

            <p className="text-center text-slate-400 text-sm">
              Don't have an account?{' '}
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/register')}
                className="text-blue-400 hover:text-blue-300"
              >
                Create account
              </Button>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;