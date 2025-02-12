import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Building2, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';

const InstitutionDashboard = () => {
  const navigate = useNavigate();

 
  const { data: institutionData, isLoading, error } = useQuery({
    queryKey: ['institutionDetails'],
    queryFn: async () => {
      try {
        const response = await api.get('/institutions/details');
        console.log('Institution data:', response.data); // Debug log
        return response.data;
      } catch (error) {
        console.error('Failed to fetch institution details:', error);
        throw error;
      }
    }
  });

  // Calculate asset statistics
  const assetStats = React.useMemo(() => {
    if (!institutionData?.assets) return {};
    return {
      total: institutionData.assets.length,
      draft: institutionData.assets.filter(a => a.status === 'draft').length,
      pending: institutionData.assets.filter(a => a.status === 'pending').length,
      verified: institutionData.assets.filter(a => a.status === 'verified').length,
      rejected: institutionData.assets.filter(a => a.status === 'rejected').length
    };
  }, [institutionData?.assets]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", icon: Clock },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      verified: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle }
    };
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return (
      <Badge className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Action Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Institution Dashboard</h1>
          <p className="text-gray-500">Welcome back, {institutionData?.admin?.name}</p>
        </div>
        <Button 
          onClick={() => navigate('/assets/register')}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Register New Asset
        </Button>
      </div>

      {/* Institution Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold">{institutionData?.name}</h2>
              <p className="text-gray-500">Institution ID: {institutionData?.id}</p>
              <p className="text-gray-500">Registration: {institutionData?.registrationNumber}</p>
            </div>
          </div>
        </Card>

        {/* <Card className="p-6">
          <div className="flex items-center gap-4">
            <User className="h-8 w-8 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold">Administrator Details</h2>
              <p className="text-gray-500">Name: {institutionData?.admin?.name}</p>
              <p className="text-gray-500">Email: {institutionData?.admin?.email}</p>
            </div>
          </div>
        </Card> */}
      </div>

      {/* Assets Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Asset Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <h4 className="text-sm font-medium">Total Assets</h4>
            <p className="text-2xl font-bold mt-2">{assetStats.total || 0}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="text-sm font-medium">Draft</h4>
            <p className="text-2xl font-bold mt-2">{assetStats.draft || 0}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-sm font-medium">Pending</h4>
            <p className="text-2xl font-bold mt-2">{assetStats.pending || 0}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium">Verified</h4>
            <p className="text-2xl font-bold mt-2">{assetStats.verified || 0}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="text-sm font-medium">Rejected</h4>
            <p className="text-2xl font-bold mt-2">{assetStats.rejected || 0}</p>
          </div>
        </div>
      </Card>

      {/* Recent Assets */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Assets</h3>
          <Button variant="outline" onClick={() => navigate('/assets')}>
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {institutionData?.assets?.slice(0, 5).map(asset => (
            <div 
              key={asset.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(asset.status)}
                    <span className="text-sm text-gray-500">
                      • Type: {asset.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      • Created: {new Date(asset.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate(`/assets/${asset.id}`)}
              >
                View Details
              </Button>
            </div>
          ))}
          {(!institutionData?.assets || institutionData.assets.length === 0) && (
            <p className="text-center text-gray-500">No assets registered yet</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InstitutionDashboard;