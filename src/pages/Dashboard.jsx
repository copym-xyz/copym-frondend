// src/pages/Dashboard.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Building2,
  Users,
  //   GoldIcon, 
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { api } from '@/services/api';

const Dashboard = () => {
  const {
    data: dashboardStats,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        console.log('Dashboard stats response:', response.data);
        return response.data;
      } catch (error) {
        console.error(error.response ? err.response.data: error, 'error');

      }
    },
      retry: 1,
      onError: (err) => {
        showToast.error(
          'Failed to load dashboard',
          err.response?.data?.error || 'Unable to fetch dashboard statistics'
        );

    }
  });

  
  const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-semibold mt-2">{value}</h3>
          {change && (
            <div className={`flex items-center mt-2 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
              {changeType === 'increase' ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm">{change}%</span>
            </div>
          )}
        </div>
        <div className="p-4 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );

  const RecentAssetsTable = ({ assets }) => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Recent Assets</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institution
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets?.map((asset) => (
              <tr key={asset.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {asset.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {asset.Institution.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${asset.status === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : asset.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        <p>Failed to load dashboard. Please try again later.</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Institutions"
          value={dashboardStats?.overview.totalInstitutions}
          icon={Building2}
        />
        <StatCard
          title="Active Users"
          value={dashboardStats?.overview.activeUsers}
          icon={Users}
        />
        <StatCard
          title="Total Assets"
          value={dashboardStats?.overview.totalAssets}
          icon={Building2}
        />
        <StatCard
          title="Pending Institutions"
          value={dashboardStats?.overview.pendingInstitutions}
          icon={Clock}
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Asset Registration</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardStats?.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('default', { month: 'short' });
                }}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [value, 'Assets']}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('default', {
                    month: 'long',
                    year: 'numeric'
                  });
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <RecentAssetsTable assets={dashboardStats?.recentAssets} />
    </div>
  );
};

export default Dashboard;