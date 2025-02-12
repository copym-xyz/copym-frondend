import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { showToast } from '@/utils/toast';
import { api } from '@/services/api';
import { Progress } from '@/components/ui/progress';
import { Upload, File } from 'lucide-react';

const assetSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['gold', 'silver', 'platinum']),
  weight: z.number()
    .positive('Weight must be positive')
    .min(0, 'Weight cannot be negative'),
  purity: z.number()
    .min(0, 'Purity cannot be below 0%')
    .max(100, 'Purity cannot exceed 100%'),
  serialNumber: z.string()
    .min(5, 'Serial number must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

const AssetRegistrationForm = () => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = React.useState({});
  const [documents, setDocuments] = React.useState({});

  const form = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: '',
      type: 'gold',
      weight: 0,
      purity: 0,
      serialNumber: '',
      description: ''
    }
  });

  const registerAsset = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      
      // Add basic asset data
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      // Add documents if any
      Object.keys(documents).forEach(docType => {
        formData.append(`documents[${docType}]`, documents[docType]);
      });

      const response = await api.post('/assets/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: () => {
      showToast.success('Asset registered successfully');
      navigate('/institution-dashboard');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to register asset');
    }
  });

  const handleFileUpload = (type, file) => {
    setDocuments(prev => ({
      ...prev,
      [type]: file
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Register New Asset</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(data => registerAsset.mutate(data))} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (grams)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purity (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Required Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Documents</h3>
            
            {['ownership', 'certification', 'quality'].map((docType) => (
              <div key={docType} className="border rounded p-4">
                <label className="block mb-2 capitalize">{docType} Document</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(docType, e.target.files[0])}
                  />
                  {uploadProgress[docType] && (
                    <Progress value={uploadProgress[docType]} className="w-24" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/institution-dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={registerAsset.isLoading}
            >
              {registerAsset.isLoading ? 'Registering...' : 'Register Asset'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default AssetRegistrationForm;