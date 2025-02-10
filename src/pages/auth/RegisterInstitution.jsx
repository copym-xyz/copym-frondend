import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { showToast } from '@/utils/toast'; // Updated toast
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DocumentUpload from '../documents/DocumentUpload';
import { Button } from '@/components/ui/Button';

const institutionSchema = z.object({
  name: z.string().min(1, 'Institution name is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  email: z.string().email('Invalid email address'),
  contactInfo: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    address: z.string().min(1, 'Address is required')
  })
});

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

  console.log("Mutation Status:", registerMutation.status);
  console.log("isLoading:", registerMutation.isLoading);

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-6">
      <Input 
        {...register('name')} 
        placeholder="Institution Name" 
        error={errors.name?.message}
      />
      <Input 
        {...register('registrationNumber')} 
        placeholder="Registration Number"
        error={errors.registrationNumber?.message}
      />
      <Input 
        {...register('email')} 
        type="email" 
        placeholder="Email"
        error={errors.email?.message}
      />
      <Input 
        {...register('contactInfo.phone')} 
        placeholder="Phone"
        error={errors.contactInfo?.phone?.message}
      />
      <Textarea 
        {...register('contactInfo.address')} 
        placeholder="Address"
        error={errors.contactInfo?.address?.message}
      />
      
      <DocumentUpload />
      
      <Button 
        type="submit" 
        disabled={registerMutation.isLoading}
      >
        {registerMutation.isLoading ? 'Submitting...' : 'Submit Registration'}
      </Button>
    </form>
  );
};
