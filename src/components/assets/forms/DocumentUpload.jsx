// src/components/assets/forms/DocumentUpload.jsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, FileText, Check } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';

const REQUIRED_DOCUMENTS = {
  ownership: {
    title: 'Ownership Document',
    accepted: ['.pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: true
  },
  certification: {
    title: 'Certification',
    accepted: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxSize: 5 * 1024 * 1024,
    required: true
  },
  quality_report: {
    title: 'Quality Report',
    accepted: ['.pdf'],
    maxSize: 5 * 1024 * 1024,
    required: true
  }
};

const DocumentUpload = ({ assetId, documents, onComplete }) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState(documents || {});

  const uploadDocument = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post(`/assets/${assetId}/documents`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(prev => ({
            ...prev,
            [formData.get('type')]: progress
          }));
        }
      });
      return response.data;
    }
  });

  const onDrop = useCallback(async (acceptedFiles, docType) => {
    const file = acceptedFiles[0];
    const config = REQUIRED_DOCUMENTS[docType];

    if (!config) {
      toast({
        title: 'Error',
        description: 'Invalid document type',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > config.maxSize) {
      toast({
        title: 'Error',
        description: `File size must be less than ${config.maxSize / (1024 * 1024)}MB`,
        variant: 'destructive'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', docType);

    try {
      const result = await uploadDocument.mutateAsync(formData);
      setUploadedFiles(prev => ({
        ...prev,
        [docType]: {
          fileName: file.name,
          url: result.url,
          uploadedAt: new Date().toISOString()
        }
      }));

      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload document',
        variant: 'destructive'
      });
    }
  }, [assetId, toast, uploadDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onDrop(files, currentDocType),
    accept: REQUIRED_DOCUMENTS[currentDocType]?.accepted.join(','),
    maxSize: REQUIRED_DOCUMENTS[currentDocType]?.maxSize,
    multiple: false
  });

  const handleRemoveFile = async (docType) => {
    try {
      await api.delete(`/assets/${assetId}/documents/${docType}`);
      setUploadedFiles(prev => {
        const updated = { ...prev };
        delete updated[docType];
        return updated;
      });
      setUploadProgress(prev => {
        const updated = { ...prev };
        delete updated[docType];
        return updated;
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove document',
        variant: 'destructive'
      });
    }
  };

  const isComplete = Object.keys(REQUIRED_DOCUMENTS)
    .filter(key => REQUIRED_DOCUMENTS[key].required)
    .every(key => uploadedFiles[key]);

  const renderDocumentItem = (docType, config) => {
    const file = uploadedFiles[docType];
    const progress = uploadProgress[docType];

    return (
      <Card key={docType} className="p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="h-6 w-6 text-gray-500" />
            <div>
              <h4 className="font-medium">{config.title}</h4>
              {file && (
                <p className="text-sm text-gray-500">
                  {file.fileName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {file ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(docType)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            )}
          </div>
        </div>

        {progress !== undefined && progress < 100 && (
          <Progress value={progress} className="mt-2" />
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {Object.entries(REQUIRED_DOCUMENTS).map(([type, config]) =>
          renderDocumentItem(type, config)
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => onComplete(uploadedFiles)}
          disabled={!isComplete}
        >
          Previous
        </Button>
        <Button
          onClick={() => onComplete(uploadedFiles)}
          disabled={!isComplete}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;