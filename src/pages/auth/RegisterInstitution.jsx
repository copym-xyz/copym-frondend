import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { showToast } from '@/utils/toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ArrowLeft } from 'lucide-react';
import DocumentUpload from '../documents/DocumentUpload';

const institutionSchema = z.object({
  name: z.string().min(1, 'Institution name is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  email: z.string().email('Invalid email address'),
  contactInfo: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    address: z.string().min(1, 'Address is required')
  })
});

const GlowingBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-lg blur-3xl opacity-20 animate-pulse"></div>
    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-400 rounded-lg blur-3xl opacity-10 animate-pulse delay-700"></div>
  </div>
);

export const RegisterInstitution = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(institutionSchema)
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/institutions/register', data);
      return response.data;
    },
    onSuccess: () => {
      showToast.success("Institution Registration Pending");
      navigate('/registration-pending');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || "Registration failed");
    }
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <GlowingBackground />
      
      <div className="relative z-10 w-full max-w-2xl">
        <Button 
          variant="ghost" 
          className="absolute left-0 -top-16 text-white hover:text-purple-400"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="w-full bg-slate-900/80 backdrop-blur-lg border-slate-800 p-8">
          <div className="text-center mb-8">
            <div className="mb-6 p-3 bg-purple-500/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Building2 className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Register Institution</h1>
            <p className="text-slate-400">Complete the form below to register your organization</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input 
                {...register('name')} 
                placeholder="Institution Name"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <Input 
                {...register('registrationNumber')} 
                placeholder="Registration Number"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
              {errors.registrationNumber && <p className="mt-1 text-sm text-red-400">{errors.registrationNumber.message}</p>}
            </div>

            <div>
              <Input 
                {...register('email')} 
                type="email" 
                placeholder="Email"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <Input 
                {...register('contactInfo.phone')} 
                placeholder="Phone"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
              {errors.contactInfo?.phone && <p className="mt-1 text-sm text-red-400">{errors.contactInfo.phone.message}</p>}
            </div>

            <div>
              <Textarea 
                {...register('contactInfo.address')} 
                placeholder="Address"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 min-h-24"
              />
              {errors.contactInfo?.address && <p className="mt-1 text-sm text-red-400">{errors.contactInfo.address.message}</p>}
            </div>

            <DocumentUpload />

            <Button 
              type="submit" 
              disabled={registerMutation.isLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white"
            >
              {registerMutation.isLoading ? 'Submitting...' : 'Submit Registration'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterInstitution;