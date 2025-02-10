import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/services/api'; // Import your API service

const InstitutionsList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  console.log('Rendering InstitutionsList');

  // Log the current filter state
  console.log('Current filters:', { search, statusFilter });

  // Fetch institutions with debugging
  const { data: institutions, isLoading, error } = useQuery({
    queryKey: ['institutions', search, statusFilter],
    queryFn: async () => {
      console.log('Fetching institutions...');
      try {
        const response = await api.get('/admin/institutions', {
          params: {
            search,
            status: statusFilter !== 'all' ? statusFilter : undefined
          }
        });
        console.log('Institutions response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching institutions:', error);
        throw error;
      }
    }
  });

  // Update institution status with debugging
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      console.log('Updating institution status:', { id, status });
      const response = await api.patch(`/admin/institutions/${id}/status`, { status });
      console.log('Update response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['institutions']);
      toast({
        title: 'Success',
        description: 'Institution status updated successfully',
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update institution status',
        variant: 'destructive',
      });
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Add error handling
  if (error) {
    console.error('Error in component:', error);
    return (
      <div className="p-4 text-red-500">
        Error loading institutions: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Institutions</h2>
        <Button onClick={() => navigate('/register-institution')}>
          Add Institution
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search institutions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Institutions List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </Card>
        ) : !institutions || institutions.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No institutions found
          </Card>
        ) : (
          institutions.map((institution) => (
            <Card key={institution.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-gray-400" />
                    <div>
                      <h3 className="text-xl font-semibold">{institution.name}</h3>
                      <p className="text-sm text-gray-500">ID: {institution.registrationNumber}</p>
                    </div>
                  </div>

                  <div className="flex gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{institution.userCount || 0} Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{institution.assetCount || 0} Assets</span>
                    </div>
                    <div>
                      Registered: {new Date(institution.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(institution.status)}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          console.log('View details clicked:', institution.id);
                          // Add your view details logic here
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      {institution.status === 'pending' && (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log('Approve clicked:', institution.id);
                              updateStatus.mutate({
                                id: institution.id,
                                status: 'approved'
                              });
                            }}
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log('Reject clicked:', institution.id);
                              updateStatus.mutate({
                                id: institution.id,
                                status: 'rejected'
                              });
                            }}
                            className="text-red-600"
                          >
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {institution.verificationComments && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                  <p className="font-medium">Verification Comments:</p>
                  <p className="text-gray-600">{institution.verificationComments}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default InstitutionsList;