// src/components/assets/forms/ReviewSubmit.jsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Check } from 'lucide-react';

const ReviewSubmit = ({ data, onSubmit, onSaveDraft }) => {
  const { basicInfo, documents } = data;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Asset Name</p>
            <p className="font-medium">{basicInfo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Serial Number</p>
            <p className="font-medium">{basicInfo.serialNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Weight</p>
            <p className="font-medium">{basicInfo.weight} g</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Purity</p>
            <p className="font-medium">{basicInfo.purity}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
        <div className="space-y-4">
          {Object.entries(documents).map(([type, doc]) => (
            <div key={type} className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium capitalize">
                    {type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-500">{doc.fileName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-500">
                  Uploaded {formatDate(doc.uploadedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={onSaveDraft}
        >
          Save as Draft
        </Button>
        <div className="space-x-4">
          <Button 
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <Button 
            onClick={onSubmit}
          >
            Submit for Verification
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmit;