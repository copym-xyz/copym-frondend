// src/pages/assets/AssetValidation.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  FileCheck,
  FileX,
  Eye
} from 'lucide-react';
import { api } from '@/services/api';

const AssetValidation = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('pending');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assets, isLoading } = useQuery({
    queryKey: ['assets', filter, search],
    queryFn: async () => {
      const response = await api.get('/admin/assets/all', {
        params: {
          status: filter,
          search,
          limit: 10
        }
      });
      return response.data;
    }
  });

  const updateAssetStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.patch(`/admin/assets/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assets']);
      toast({
        title: 'Success',
        description: 'Asset status updated successfully',
        variant: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update asset status',
        variant: 'destructive'
      });
    }
  });

  const handleValidation = async (id, status) => {
    await updateAssetStatus.mutateAsync({ id, status });
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Asset Validation</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {assets?.data.map((asset) => (
            <Card key={asset.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{asset.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Serial Number: {asset.serialNumber}
                  </p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Weight</p>
                      <p className="font-medium">{asset.weight}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Purity</p>
                      <p className="font-medium">{asset.purity}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/assets/${asset.id}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {asset.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleValidation(asset.id, 'verified')}
                      >
                        <FileCheck className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleValidation(asset.id, 'rejected')}
                      >
                        <FileX className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {assets?.data.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No assets found matching your criteria</p>
        </Card>
      )}

      {assets?.hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => {
              // Implement pagination logic
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssetValidation;