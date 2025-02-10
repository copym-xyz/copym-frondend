import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  Building2, 
  Plus, 
  Filter, 
  Search 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
// import DocumentManagement from '@/components/documents/DocumentManagement';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toast';

const InstitutionDashboard = () => {
  const navigate = useNavigate();
  const [assetsFilter, setAssetsFilter] = useState({
    status: 'all',
    search: ''
  });
  const [usersFilter, setUsersFilter] = useState({
    role: 'all',
    search: ''
  });

  // Fetch institution details
  const { 
    data: institutionData, 
    isLoading: institutionLoading, 
    error: institutionError 
  } = useQuery({
    queryKey: ['institutionDetails'],
    queryFn: async () => {
      try {
        const response = await api.get('/institutions/details');
        return response.data;
      } catch (error) {
        showToast.error('Failed to fetch institution details', error.message);
        throw error;
      }
    }
  });

  // Fetch assets
  const { 
    data: assets, 
    isLoading: assetsLoading, 
    error: assetsError 
  } = useQuery({
    queryKey: ['institutionAssets', assetsFilter],
    queryFn: async () => {
      try {
        const response = await api.get('/institutions/assets', {
          params: {
            status: assetsFilter.status === 'all' ? undefined : assetsFilter.status,
            search: assetsFilter.search || undefined
          }
        });
        return response.data;
      } catch (error) {
        showToast.error('Failed to fetch assets', error.message);
        throw error;
      }
    }
  });

  // Fetch users
  const { 
    data: users, 
    isLoading: usersLoading, 
    error: usersError 
  } = useQuery({
    queryKey: ['institutionUsers', usersFilter],
    queryFn: async () => {
      try {
        const response = await api.get('/institutions/users', {
          params: {
            role: usersFilter.role === 'all' ? undefined : usersFilter.role,
            search: usersFilter.search || undefined
          }
        });
        return response.data;
      } catch (error) {
        showToast.error('Failed to fetch users', error.message);
        throw error;
      }
    }
  });

  // Status color mapping
  const getStatusColor = (status) => {
    const colorMap = {
      'active': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'suspended': 'bg-red-100 text-red-800',
      'draft': 'bg-blue-100 text-blue-800',
      'verified': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Render loading state
  if (institutionLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render error state
  if (institutionError) {
    return (
      <div className="text-center text-red-500 p-6">
        <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
        <p>{institutionError.message || 'Unable to load institution details'}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">{institutionData.name}</h1>
            <p className="text-gray-500">{institutionData.registrationNumber}</p>
          </div>
          <Badge 
            className={`${getStatusColor(institutionData.status)} px-4 py-2`}
          >
            {institutionData.status}
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default InstitutionDashboard;