import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Clock, Plus } from 'lucide-react';
import { api } from '@/services/api';

const UserDashboard = () => {
  const navigate = useNavigate();

  // Fix the queries to use object syntax for React Query v5
  const { 
    data: assets, 
    isLoading: assetsLoading, 
    isError: assetsError, 
    error: assetsErrorDetails 
  } = useQuery({
    queryKey: ['userAssets'],
    queryFn: async () => {
      try {
        const response = await api.get('/assets/user');
        console.log('User assets response:', response.data);
        return response.data;
      } catch (err) {
        console.error('User assets error:', err.response ? err.response.data : err);
        throw err;
      }
    },
    retry: 1,
    onError: (err) => {
      showToast.error(
        'Failed to load assets',
        err.response?.data?.error || 'Unable to fetch assets'
      );
    }
  });

  const { 
    data: recentDocuments, 
    isLoading: documentsLoading, 
    isError: documentsError 
  } = useQuery({
    queryKey: ['recentDocuments'],
    queryFn: async () => {
      try {
        const response = await api.get('/documents/recent');
        console.log('Recent documents response:', response.data);
        return response.data;
      } catch (err) {
        console.error('Recent documents error:', err.response ? err.response.data : err);
        throw err;
      }
    },
    retry: 1,
    onError: (err) => {
      showToast.error(
        'Failed to load documents',
        err.response?.data?.error || 'Unable to fetch recent documents'
      );
    }
  });

  if (assetsLoading || documentsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (assetsError || documentsError) {
    return (
      <div className="text-center text-red-500">
        <p>Failed to load dashboard. Please try again later.</p>
        <p>{assetsErrorDetails?.message}</p>
      </div>
    );
  }


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate('/assets/register')}>
          <Plus className="h-4 w-4 mr-2" />
          Register New Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Total Assets</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl mt-2">{assets?.total || 0}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Pending Validations</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl mt-2">{assets?.pending || 0}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Assets</h3>
        <div className="space-y-4">
          {assets?.recent?.map(asset => (
            <div key={asset.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{asset.name}</p>
                <p className="text-sm text-gray-500">
                  Status: {asset.status}
                </p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/assets/${asset.id}`)}
              >
                View Details
              </Button>
            </div>
          ))}
          {(!assets?.recent || assets.recent.length === 0) && (
            <p className="text-gray-500 text-center py-4">
              No recent assets found
            </p>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Documents</h3>
        <div className="space-y-4">
          {recentDocuments?.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => window.open(doc.url)}
              >
                Download
              </Button>
            </div>
          ))}
          {(!recentDocuments || recentDocuments.length === 0) && (
            <p className="text-gray-500 text-center py-4">
              No recent documents found
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserDashboard;