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

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    setValue('role', value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Button variant="link" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          </p>
        </div>

        <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))} className="space-y-6">
          {/* Email Field */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="mt-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-[50%] transform -translate-y-[50%]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Icons.eyeOff /> : <Icons.eye />}
              </Button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword')}
                className="mt-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-[50%] transform -translate-y-[50%]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Icons.eyeOff /> : <Icons.eye />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="institution_admin">Institution Admin</SelectItem>
                <SelectItem value="institution_user">Institution User</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Institution ID Field - Only shown when role is selected */}
          {(selectedRole === 'institution_admin' || selectedRole === 'institution_user') && (
            <div>
              <Label htmlFor="institutionId">Institution ID</Label>
              <Input
                id="institutionId"
                type="text"
                {...register('institutionId')}
                placeholder="Enter your institution ID"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the ID provided during institution registration
              </p>
              {errors.institutionId && (
                <p className="mt-1 text-sm text-red-500">{errors.institutionId.message}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isLoading}
          >
            {registerMutation.isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Register;