import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Building2, 
  Users, 
  FileText, 
  Clock 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { api } from '@/services/api';
import { showToast } from '@/utils/toast';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [searchAssets, setSearchAssets] = useState('');
  const [searchInstitutions, setSearchInstitutions] = useState('');

  // Fetch Dashboard Statistics
  const { 
    data: dashboardStats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => api.get('/admin/dashboard/stats'),
    onError: (error) => {
      showToast.error('Failed to load dashboard statistics');
      console.error('Dashboard stats error:', error);
    }
  });

  console.log(dashboardStats,"asdf");
  

  // Asset Verification Mutation
  const verifyAssetMutation = useMutation({
    mutationFn: ({ id, status, comments }) => 
      api.patch(`/admin/assets/${id}/verify`, { status, comments }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminDashboardStats']);
      showToast.success('Asset verification processed');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Verification failed');
    }
  });

  // Institution Verification Mutation
  const verifyInstitutionMutation = useMutation({
    mutationFn: ({ id, status, comments }) => 
      api.patch(`/admin/institutions/${id}/verify`, { status, comments }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminDashboardStats']);
      showToast.success('Institution verification processed');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Verification failed');
    }
  });

  // Verification Handlers
  const handleAssetVerification = (asset, status) => {
    verifyAssetMutation.mutate({
      id: asset.id,
      status,
      comments: status === 'verified' 
        ? 'Asset verified by admin' 
        : 'Asset does not meet requirements'
    });
  };

  const handleInstitutionVerification = (institution, status) => {
    verifyInstitutionMutation.mutate({
      id: institution.id,
      status,
      comments: status === 'approved' 
        ? 'Institution approved by admin' 
        : 'Institution does not meet requirements'
    });
  };

  // Loading and Error States
  if (statsLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="text-center text-red-500 p-6">
        <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
        <p>{statsError.message || 'Unable to load dashboard stats'}</p>
        <Button onClick={() => queryClient.invalidateQueries(['adminDashboardStats'])} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  // Ensure we have stats data
  if (!dashboardStats) {
    return <div>No dashboard data available</div>;
  }

  const { overview, recentAssets, recentInstitutions, monthlyStats } = dashboardStats.data;
  console.log(overview, recentAssets, recentInstitutions, monthlyStats);
  

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Button variant="outline">Generate Report</Button>
          <Button>Quick Actions</Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Institutions', 
            value: overview?.totalInstitutions || 0, 
            icon: Building2 
          },
          { 
            title: 'Pending Institutions', 
            value: overview?.pendingInstitutions || 0, 
            icon: Clock 
          },
          { 
            title: 'Total Assets', 
            value: overview?.totalAssets || 0, 
            icon: FileText 
          },
          { 
            title: 'Pending Assets', 
            value: overview?.pendingAssets || 0, 
            icon: Users 
          }
        ].map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-primary opacity-70" />
            </div>
          </Card>
        ))}
      </div>

      {/* Monthly Activity Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Activity</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
                }}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Institutions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Pending Institutions</h2>
          <Input 
            placeholder="Search institutions..."
            value={searchInstitutions}
            onChange={(e) => setSearchInstitutions(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="space-y-4">
          {recentInstitutions?.map((institution) => (
            <div 
              key={institution.id} 
              className="flex justify-between items-center p-4 bg-white border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{institution.name}</h3>
                <p className="text-sm text-gray-500">
                  Reg No: {institution.registrationNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Email: {institution.email}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleInstitutionVerification(institution, 'approved')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleInstitutionVerification(institution, 'rejected')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Assets */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Assets</h2>
          <Input 
            placeholder="Search assets..."
            value={searchAssets}
            onChange={(e) => setSearchAssets(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="space-y-4">
          {recentAssets?.map((asset) => (
            <div 
              key={asset.id} 
              className="flex justify-between items-center p-4 bg-white border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{asset.name}</h3>
                <p className="text-sm text-gray-500">
                  Serial No: {asset.serialNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Institution: {asset.institution?.name}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <Badge variant="outline">{asset.type}</Badge>
                  <Badge 
                    variant={
                      asset.status === 'draft' ? 'secondary' :
                      asset.status === 'pending' ? 'warning' :
                      asset.status === 'verified' ? 'success' : 'destructive'
                    }
                  >
                    {asset.status}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {/* View Asset Details */}}
                >
                  View Details
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleAssetVerification(asset, 'verified')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;