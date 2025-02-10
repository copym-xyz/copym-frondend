import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { File, Eye, Download, Trash2, Clock } from 'lucide-react';

const DocumentList = ({ assetId }) => {
  const queryClient = useQueryClient();

  const { data: documents } = useQuery({
    queryKey: ['asset-documents', assetId],
    queryFn: () => api.get(`/assets/${assetId}/documents`)
  });

  const deleteMutation = useMutation({
    mutationFn: (documentId) => 
      api.delete(`/assets/${assetId}/documents/${documentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['asset-documents', assetId]);
    }
  });

  const categoryIcons = {
    ownership: File,
    quality: File,
    certification: File
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    
    const daysToExpiry = Math.ceil(
      (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (daysToExpiry < 0) {
      return { status: 'expired', color: 'destructive' };
    } else if (daysToExpiry < 30) {
      return { status: `Expires in ${daysToExpiry} days`, color: 'warning' };
    }
    return { status: 'Valid', color: 'success' };
  };

  return (
    <div className="space-y-4">
      {documents?.map((doc) => {
        const expiryStatus = getExpiryStatus(doc.expiryDate);
        const Icon = categoryIcons[doc.category] || File;

        return (
          <Card key={doc.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Icon className="h-8 w-8 text-gray-400" />
                <div>
                  <h4 className="font-medium">{doc.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{doc.category}</span>
                    <span>•</span>
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    {doc.version && (
                      <>
                        <span>•</span>
                        <span>v{doc.version}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {expiryStatus && (
                  <Badge variant={expiryStatus.color}>
                    <Clock className="h-3 w-3 mr-1" />
                    {expiryStatus.status}
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(doc.previewUrl)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(doc.downloadUrl)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {doc.verificationStatus && (
              <div className="mt-2 pt-2 border-t">
                <Badge variant={doc.verificationStatus === 'verified' ? 'success' : 'warning'}>
                  {doc.verificationStatus}
                </Badge>
                {doc.verificationComments && (
                  <p className="mt-1 text-sm text-gray-500">
                    {doc.verificationComments}
                  </p>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default DocumentList;