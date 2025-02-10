import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Upload, File, X, Eye, Download, AlertTriangle } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
};

const DocumentUpload = ({ assetId }) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [preview, setPreview] = useState(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files) => {
      const formData = new FormData();
      files.forEach(file => formData.append('documents', file));

      return api.post(`/assets/${assetId}/documents`, formData, {
        onUploadProgress: (event) => {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(prev => ({
            ...prev,
            [files[0].name]: progress
          }));
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['asset-documents', assetId]);
    }
  });

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => ({
        name: file.file.name,
        errors: file.errors.map(error => error.message)
      }));
      // Handle errors
      return;
    }

    uploadMutation.mutate(acceptedFiles);
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true
  });

  const PreviewModal = ({ file, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{file.name}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {file.type.startsWith('image/') ? (
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            className="max-w-full h-auto" 
          />
        ) : (
          <iframe
            src={URL.createObjectURL(file)}
            className="w-full h-[600px]"
            title={file.name}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-gray-600">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, JPG, PNG (max 10MB)
            </p>
          </div>
        </div>

        {uploadMutation.isError && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Upload Failed</AlertTitle>
            <AlertDescription>
              {uploadMutation.error.message}
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Upload Progress */}
      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <Card key={fileName} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <File className="h-5 w-5 text-gray-400" />
              <span className="font-medium">{fileName}</span>
            </div>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>
      ))}

      {/* Document Preview */}
      {preview && (
        <PreviewModal 
          file={preview} 
          onClose={() => setPreview(null)} 
        />
      )}
    </div>
  );
};

export default DocumentUpload;