import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';
import { useMutation } from '@tanstack/react-query';
import { Save, ArrowRight, ArrowLeft } from 'lucide-react';

const AUTOSAVE_DELAY = 3000;

const AssetRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [formData, setFormData] = useState({});

  // Form steps configuration
  const steps = [
    {
      title: 'Basic Information',
      fields: ['name', 'type', 'description'],
      validationRules: {
        name: { required: true, minLength: 3 },
        type: { required: true },
        description: { required: true, maxLength: 500 }
      }
    },
    {
      title: 'Specifications',
      fields: ['weight', 'purity', 'dimensions'],
      validationRules: {
        weight: { required: true, min: 0 },
        purity: { required: true, min: 0, max: 100 },
        dimensions: { required: true }
      }
    },
    {
      title: 'Ownership Details',
      fields: ['owners', 'distribution', 'restrictions'],
      validationRules: {
        owners: { required: true },
        distribution: { required: true },
        restrictions: { required: true }
      }
    },
    {
      title: 'Review & Submit',
      fields: [],
      validationRules: {}
    }
  ];

  // Form progress calculation
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Auto-save mutation
  const autoSaveMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/assets/draft', data);
      return response.data;
    },
    onSuccess: () => {
      setAutoSaveStatus('Draft saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    },
    onError: () => {
      setAutoSaveStatus('Error saving draft');
    }
  });

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        autoSaveMutation.mutate(formData);
      }
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [formData]);

  // Form submission mutation
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/assets', data);
      return response.data;
    }
  });

  const handleNext = async () => {
    const isValid = await form.trigger(steps[currentStep].fields);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (data) => {
    await submitMutation.mutateAsync(data);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInformationStep form={form} />;
      case 1:
        return <SpecificationsStep form={form} />;
      case 2:
        return <OwnershipStep form={form} />;
      case 3:
        return (
          <ReviewStep
            data={form.getValues()}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {steps[currentStep].title}
          </h2>
          <Progress value={progress} className="h-2" />
          
          {autoSaveStatus && (
            <Alert className="mt-2">
              <Save className="h-4 w-4 mr-2" />
              {autoSaveStatus}
            </Alert>
          )}
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {renderStep()}

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={submitMutation.isLoading}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

const BasicInformationStep = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asset Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter asset name" />
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
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
              <Textarea 
                {...field} 
                placeholder="Enter asset description"
                className="h-32"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const SpecificationsStep = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weight (grams)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="number" 
                step="0.01"
                onChange={e => field.onChange(parseFloat(e.target.value))}
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
                {...field} 
                type="number" 
                step="0.01"
                min="0"
                max="100"
                onChange={e => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dimensions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dimensions</FormLabel>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Input 
                  placeholder="Length"
                  {...field}
                  name="length"
                  onChange={e => field.onChange({
                    ...field.value,
                    length: parseFloat(e.target.value)
                  })}
                />
              </div>
              <div>
                <Input 
                  placeholder="Width"
                  {...field}
                  name="width"
                  onChange={e => field.onChange({
                    ...field.value,
                    width: parseFloat(e.target.value)
                  })}
                />
              </div>
              <div>
                <Input 
                  placeholder="Height"
                  {...field}
                  name="height"
                  onChange={e => field.onChange({
                    ...field.value,
                    height: parseFloat(e.target.value)
                  })}
                />
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const OwnershipStep = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="owners"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Initial Owners</FormLabel>
            <div className="space-y-2">
              {field.value?.map((owner, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Owner address"
                    value={owner.address}
                    onChange={e => {
                      const newOwners = [...field.value];
                      newOwners[index].address = e.target.value;
                      field.onChange(newOwners);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Share %"
                    value={owner.share}
                    onChange={e => {
                      const newOwners = [...field.value];
                      newOwners[index].share = parseFloat(e.target.value);
                      field.onChange(newOwners);
                    }}
                  />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const newOwners = field.value.filter((_, i) => i !== index);
                      field.onChange(newOwners);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  field.onChange([
                    ...(field.value || []),
                    { address: '', share: 0 }
                  ]);
                }}
              >
                Add Owner
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="distribution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Distribution Rights</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select distribution type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="proportional">Proportional</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="restrictions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transfer Restrictions</FormLabel>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lockup"
                  checked={field.value?.lockup}
                  onCheckedChange={(checked) => {
                    field.onChange({
                      ...field.value,
                      lockup: checked
                    });
                  }}
                />
                <label htmlFor="lockup">Initial lockup period</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="kyc"
                  checked={field.value?.kyc}
                  onCheckedChange={(checked) => {
                    field.onChange({
                      ...field.value,
                      kyc: checked
                    });
                  }}
                />
                <label htmlFor="kyc">KYC required</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whitelist"
                  checked={field.value?.whitelist}
                  onCheckedChange={(checked) => {
                    field.onChange({
                      ...field.value,
                      whitelist: checked
                    });
                  }}
                />
                <label htmlFor="whitelist">Whitelist only</label>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const ReviewStep = ({ data, onSubmit }) => {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Basic Information</h3>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Name</dt>
            <dd className="font-medium">{data.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Type</dt>
            <dd className="font-medium capitalize">{data.type}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-gray-500">Description</dt>
            <dd className="font-medium">{data.description}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Specifications</h3>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Weight</dt>
            <dd className="font-medium">{data.weight}g</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Purity</dt>
            <dd className="font-medium">{data.purity}%</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-gray-500">Dimensions</dt>
            <dd className="font-medium">
              {data.dimensions.length}x{data.dimensions.width}x{data.dimensions.height} mm
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Ownership</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Initial Owners</h4>
            <div className="space-y-2">
              {data.owners.map((owner, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{owner.address}</span>
                  <span>{owner.share}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Distribution Rights</h4>
            <p className="font-medium capitalize">{data.distribution}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Transfer Restrictions</h4>
            <ul className="list-disc list-inside">
              {data.restrictions.lockup && <li>Initial lockup period</li>}
              {data.restrictions.kyc && <li>KYC required</li>}
              {data.restrictions.whitelist && <li>Whitelist only</li>}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssetRegistrationForm;