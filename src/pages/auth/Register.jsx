import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/ui/icons';
import { showToast } from '@/utils/toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.string().min(1, 'Role is required'),
  institutionId: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
const GlowingBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-lg blur-3xl opacity-20 animate-pulse"></div>
    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-lg blur-3xl opacity-10 animate-pulse delay-700"></div>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur'
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      // Convert institutionId to number if present
      const formattedData = {
        ...userData,
        institutionId: userData.institutionId ? parseInt(userData.institutionId) : null
      };
      return await api.post('/auth/register', formattedData);
    },
    onSuccess: () => {
      showToast.success("Registration successful. You can now login with your credentials");
      navigate('/login');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  });

  const {isLoading} = registerMutation;

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    setValue('role', value);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <GlowingBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Your Account
          </h1>
          <p className="text-slate-400">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>

        <Card className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-slate-200">Email</Label>
              <Input
                type="email"
                className="mt-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label className="text-slate-200">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="mt-1 bg-slate-800/50 border-slate-700 text-white pr-10"
                  placeholder="Create password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="text-slate-200">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="mt-1 bg-slate-800/50 border-slate-700 text-white pr-10"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="text-slate-200">Role</Label>
              <Select value={selectedRole} onValueChange={value => setSelectedRole(value)}>
                <SelectTrigger className="mt-1 bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="institution_admin" className="text-white">Institution Admin</SelectItem>
                  <SelectItem value="institution_user" className="text-white">Institution User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedRole === 'institution_admin' || selectedRole === 'institution_user') && (
              <div>
                <Label className="text-slate-200">Institution ID</Label>
                <Input
                  type="text"
                  className="mt-1 bg-slate-800/50 border-slate-700 text-white"
                  placeholder="Enter institution ID"
                />
                <p className="mt-1 text-sm text-slate-400">
                  Enter the ID provided during institution registration
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emarald-700 text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;