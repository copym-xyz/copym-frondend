import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Filter, Download, Upload, 
  RefreshCw, Database 
} from 'lucide-react';

const RegistryService = () => {
  const [selectedRegistry, setSelectedRegistry] = useState('asset');
  const [search, setSearch] = useState('');

  const registryTypes = {
    asset: {
      title: 'Asset Registry',
      columns: [
        { accessorKey: 'id', header: 'Asset ID' },
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'type', header: 'Type' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'createdAt', header: 'Registration Date' }
      ]
    },
    ownership: {
      title: 'Ownership Registry',
      columns: [
        { accessorKey: 'assetId', header: 'Asset ID' },
        { accessorKey: 'owner', header: 'Owner' },
        { accessorKey: 'percentage', header: 'Ownership %' },
        { accessorKey: 'transferDate', header: 'Transfer Date' }
      ]
    },
    compliance: {
      title: 'Compliance Registry',
      columns: [
        { accessorKey: 'assetId', header: 'Asset ID' },
        { accessorKey: 'checkType', header: 'Check Type' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'lastChecked', header: 'Last Checked' }
      ]
    },
    price: {
      title: 'Price Registry',
      columns: [
        { accessorKey: 'assetId', header: 'Asset ID' },
        { accessorKey: 'price', header: 'Price' },
        { accessorKey: 'currency', header: 'Currency' },
        { accessorKey: 'updateDate', header: 'Last Updated' }
      ]
    },
    vault: {
      title: 'Vault Registry',
      columns: [
        { accessorKey: 'assetId', header: 'Asset ID' },
        { accessorKey: 'vaultId', header: 'Vault ID' },
        { accessorKey: 'location', header: 'Location' },
        { accessorKey: 'securityLevel', header: 'Security Level' }
      ]
    }
  };

  // Fetch registry data
  const { data: registryData, isLoading } = useQuery(
    ['registry', selectedRegistry, search],
    () => api.get(`/registry/${selectedRegistry}`, { params: { search } })
  );

  // Update registry entry
  const updateEntry = useMutation({
    mutationFn: (data) => api.patch(`/registry/${selectedRegistry}/${data.id}`, data)
  });

  // Sync registry
  const syncRegistry = useMutation({
    mutationFn: () => api.post(`/registry/${selectedRegistry}/sync`)
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Registry Management</h2>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => syncRegistry.mutate()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Registry
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={selectedRegistry} onValueChange={setSelectedRegistry}>
          <TabsList>
            {Object.entries(registryTypes).map(([key, { title }]) => (
              <TabsTrigger key={key} value={key}>
                {title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(registryTypes).map(([key, { title, columns }]) => (
            <TabsContent key={key} value={key}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={`Search ${title}...`}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                  </div>
                </div>

                <DataTable
                  columns={columns}
                  data={registryData || []}
                  loading={isLoading}
                  onRowClick={(row) => {
                    // Handle row click
                  }}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Registry Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Registry Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Assets</p>
                <p className="text-2xl font-semibold">
                  {registryData?.stats?.totalAssets || 0}
                </p>
              </div>
              <Database className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Owners</p>
                <p className="text-2xl font-semibold">
                  {registryData?.stats?.activeOwners || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Compliance Rate</p>
                <p className="text-2xl font-semibold">
                  {registryData?.stats?.complianceRate || 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegistryService;