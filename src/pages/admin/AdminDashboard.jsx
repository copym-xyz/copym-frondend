import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Building2, Users, FileText, Clock, RefreshCw,
  AlertTriangle, CheckCircle, DollarSign, Lock,
  Search, Filter, ArrowRight, BarChart2
} from 'lucide-react';
import { api } from '@/services/api';

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
      } catch (err) {
        console.error('Dashboard stats error:', err);
        throw err;
      }
    }
  });

  const StatCard = ({ title, value, icon: Icon, change, trend }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-semibold mt-2">{value}</h3>
          {change && (
            <div className={`flex items-center mt-2 ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? '↑' : '↓'}
              <span className="text-sm ml-1">{change}%</span>
            </div>
          )}
        </div>
        <div className="p-4 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );

  const RecentInstitutions = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Institutions</h3>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      <div className="space-y-4">
        {stats?.recentInstitutions?.map((inst) => (
          <div key={inst.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{inst.name}</p>
              <p className="text-sm text-gray-500">{inst.registrationNumber}</p>
            </div>
            <Badge variant={
              inst.status === 'approved' ? 'success' :
              inst.status === 'pending' ? 'warning' : 'destructive'
            }>
              {inst.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );

  const ValidationQueue = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Validation Queue</h3>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      <div className="space-y-4">
        {stats?.pendingValidations?.map((validation) => (
          <div key={validation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{validation.assetName}</p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(validation.submittedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button size="sm" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const SecurityAlerts = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Security Alerts</h3>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      <div className="space-y-4">
        {stats?.securityAlerts?.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {alert.severity === 'high' ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : (
                <Lock className="h-5 w-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium">{alert.title}</p>
                <p className="text-sm text-gray-500">{alert.description}</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Review</Button>
          </div>
        ))}
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
        <p>{error.message || 'Unable to load dashboard stats'}</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with search and filters */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Institutions"
          value={stats?.overview?.totalInstitutions || 0}
          icon={Building2}
          change="12"
          trend="up"
        />
        <StatCard
          title="Active Users"
          value={stats?.overview?.activeUsers || 0}
          icon={Users}
          change="8"
          trend="up"
        />
        <StatCard
          title="Total Assets"
          value={stats?.overview?.totalAssets || 0}
          icon={FileText}
          change="15"
          trend="up"
        />
        <StatCard
          title="Pending Validations"
          value={stats?.overview?.pendingValidations || 0}
          icon={Clock}
          change="5"
          trend="down"
        />
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Monthly Activity</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Assets</Button>
            <Button variant="outline" size="sm">Users</Button>
            <Button variant="outline" size="sm">Institutions</Button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.monthlyStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('default', { month: 'short' });
                }}
              />
              <YAxis />
              <Tooltip />
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

      {/* Recent Activity and Validation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentInstitutions />
        <ValidationQueue />
      </div>

      {/* Security Alerts */}
      <SecurityAlerts />

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
          <Button className="w-full">
            <Building2 className="h-4 w-4 mr-2" />
            Review Institutions
          </Button>
          <Button className="w-full">
            <BarChart2 className="h-4 w-4 mr-2" />
            Generate Reports
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;