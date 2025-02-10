import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import debounce from 'lodash/debounce';

const assetSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['gold', 'silver', 'realestate', 'art', 'luxury']),
  value: z.number().positive('Value must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  serialNumber: z.string().optional(),
  location: z.string().optional(),
  condition: z.string().optional(),
  acquisitionDate: z.date().optional(),
  holdingPeriod: z.number().positive().optional(),
  ownershipLimits: z.number().min(0).max(100).optional()
});

const AssetRegistrationForm = () => {
  const { toast } = useToast();
  const [draftId, setDraftId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      type: 'gold',
      value: 0,
      holdingPeriod: 0,
      ownershipLimits: 100
    }
  });

  // Load draft if exists
  const { data: draft } = useQuery(
    ['assetDraft', draftId],
    () => api.get(`/assets/drafts/${draftId}`),
    { enabled: !!draftId }
  );

  // Auto-save mutation
  const saveDraft = useMutation({
    mutationFn: (data) => 
      api.post('/assets/drafts', {
        ...data,
        draftId: draftId || undefined
      }),
    onSuccess: (response) => {
      if (!draftId) {
        setDraftId(response.data.draftId);
      }
    }
  });

  // Debounced auto-save
  const debouncedSave = debounce((data) => {
    saveDraft.mutate(data);
  }, 1000);

  // Watch form changes for auto-save
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (Object.keys(data).length > 0) {
        debouncedSave(data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Load draft data
  useEffect(() => {
    if (draft) {
      form.reset(draft);
    }
  }, [draft]);

  const steps = [
    {
      title: 'Basic Information',
      fields: ['name', 'type', 'value', 'description']
    },
    {
      title: 'Details',
      fields: ['serialNumber', 'location', 'condition', 'acquisitionDate']
    },
    {
      title: 'Ownership Rules',
      fields: ['holdingPeriod', 'ownershipLimits']
    }
  ];

  const currentStepFields = steps[currentStep].fields;

  const handleSubmit = async (data) => {
    try {
      await api.post('/assets', data);
      toast({
        title: 'Success',
        description: 'Asset registered successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index === currentStep ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <div className="rounded-full bg-primary/10 p-2">
                {index + 1}
              </div>
              <span className="ml-2">{step.title}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {currentStepFields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {field === 'type' ? (
                <Select
                  {...form.register(field)}
                  options={[
                    { value: 'gold', label: 'Gold' },
                    { value: 'silver', label: 'Silver' },
                    { value: 'realestate', label: 'Real Estate' },
                    { value: 'art', label: 'Art' },
                    { value: 'luxury', label: 'Luxury Goods' }
                  ]}
                />
              ) : (
                <Input {...form.register(field)} />
              )}
              {form.formState.errors[field] && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors[field].message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>

        <div className="text-sm text-gray-500 mt-4">
          Draft saved automatically
        </div>
      </form>
    </Card>
  );
};

export default AssetRegistrationForm;