import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { showToast } from '@/utils/toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MoreVertical,
  UserCog,
  Building2,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  KeyRound
} from 'lucide-react';

const UsersList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users with filters
  const { data: users, isLoading } = useQuery({
    queryKey: ['users', search, roleFilter, statusFilter],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users?search=${search}&role=${roleFilter}&status=${statusFilter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    }
  });

  // Update user status mutation
  const updateUserStatus = useMutation({
    mutationFn: async ({ userId, status }) => {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showToast.success('User status updated successfully');
    },
    onError: (error) => {
      showToast.error(error.message);
    },
  });
  // Update user role mutation
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }) => {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper function for status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      suspended: { color: "bg-red-100 text-red-800", icon: XCircle },
      inactive: { color: "bg-gray-100 text-gray-800", icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <Badge className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Helper function for role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      super_admin: "bg-purple-100 text-purple-800",
      institution_admin: "bg-blue-100 text-blue-800",
      institution_user: "bg-green-100 text-green-800"
    };

    return (
      <Badge className={roleConfig[role] || "bg-gray-100 text-gray-800"}>
        {role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  const UserDetailsDialog = ({ user }) => (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>User Details</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Email</label>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
            <UserCog className="h-4 w-4 text-gray-500" />
            {user.email}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Role</label>
            <div className="mt-1">{getRoleBadge(user.role)}</div>
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <div className="mt-1">{getStatusBadge(user.status)}</div>
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Institution</label>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
            <Building2 className="h-4 w-4 text-gray-500" />
            {user.institution?.name || 'N/A'}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Security Settings</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <span>Two-Factor Authentication</span>
              </div>
              <Badge variant={user.twoFactorEnabled ? "success" : "secondary"}>
                {user.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-gray-500" />
                <span>Last Password Change</span>
              </div>
              <span className="text-sm text-gray-500">
                {user.lastPasswordChange ? new Date(user.lastPasswordChange).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button onClick={() => navigate('/admin/users/new')}>
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="institution_admin">Institution Admin</SelectItem>
              <SelectItem value="institution_user">Institution User</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <UserCog className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.institution ? (
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span>{user.institution.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem
                            onClick={() => updateUserStatus.mutate({
                              userId: user.id,
                              status: user.status === 'active' ? 'suspended' : 'active'
                            })}
                          >
                            {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                          </DropdownMenuItem>
                          {user.role !== 'super_admin' && (
                            <DropdownMenuItem
                              onClick={() => updateUserRole.mutate({
                                userId: user.id,
                                role: user.role === 'institution_admin' ? 'institution_user' : 'institution_admin'
                              })}
                            >
                              Change Role
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {selectedUser && <UserDetailsDialog user={selectedUser} />}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default UsersList;