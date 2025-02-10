import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '@/hooks/useAssets';
import { useToast } from '@/hooks/use-toast';
import BasicInfoForm from '@/components/assets/forms/BasicInfoForm';
import DocumentUpload from '../documents/DocumentUpload';
import ReviewSubmit from '@/components/assets/forms/ReviewSubmit';

const AssetRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { registerAsset, uploadDocuments, submitForVerification } = useAssets();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [assetData, setAssetData] = useState({
    basicInfo: null,
    documents: [],
    status: 'draft'
  });

  const handleBasicInfoSubmit = async (data) => {
    try {
      const response = await registerAsset.mutateAsync(data);
      setAssetData(prev => ({
        ...prev,
        basicInfo: data,
        assetId: response.asset.id
      }));
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: 'Registration Error',
        description: error.response?.data?.error || 'Failed to register asset',
        variant: 'destructive'
      });
    }
  };

  const handleDocumentUpload = async (documents) => {
    try {
      await uploadDocuments.mutateAsync({
        assetId: assetData.assetId,
        documents
      });
      setAssetData(prev => ({
        ...prev,
        documents
      }));
      setCurrentStep(2);
    } catch (error) {
      toast({
        title: 'Document Upload Error',
        description: error.response?.data?.error || 'Failed to upload documents',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await submitForVerification.mutateAsync(assetData.assetId);
      toast({
        title: 'Success',
        description: 'Asset submitted for verification',
        variant: 'success'
      });
      navigate('/assets');
    } catch (error) {
      toast({
        title: 'Submission Error',
        description: error.response?.data?.error || 'Failed to submit asset',
        variant: 'destructive'
      });
    }
  };

  // Render steps based on currentStep
  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return <BasicInfoForm onSubmit={handleBasicInfoSubmit} />;
      case 1:
        return <DocumentUpload onSubmit={handleDocumentUpload} />;
      case 2:
        return <ReviewSubmit 
          data={assetData} 
          onSubmit={handleSubmit} 
          onBack={() => setCurrentStep(1)} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      {renderStep()}
    </div>
  );
};

export default AssetRegistration;