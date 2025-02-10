import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Clock, AlertTriangle, CheckCircle, 
  FileText, Download, Filter
} from 'lucide-react';

const ValidationDashboard = () => {
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  // Fetch validation queue
  const { data: validations } = useQuery(
    ['validations', priorityFilter, assigneeFilter],
    () => api.get('/validations', {
      params: { priority: priorityFilter, assignee: assigneeFilter }
    })
  );

  // Fetch statistics
  const { data: stats } = useQuery(['validationStats', dateRange], 
    () => api.get('/validations/stats', { params: { range: dateRange } })
  );

  // Validation assignment mutation
  const assignValidation = useMutation({
    mutationFn: ({ validationId, assigneeId }) =>
      api.patch(`/validations/${validationId}/assign`, { assigneeId })
  });

  // Update validation status mutation
  const updateStatus = useMutation({
    mutationFn: ({ validationId, status, comments }) =>
      api.patch(`/validations/${validationId}/status`, { status, comments })
  });

  // Generate report mutation
  const generateReport = useMutation({
    mutationFn: (filters) => api.post('/validations/report', filters)
  });

  const ValidationQueue = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Validation Queue</h3>
        <div className="flex space-x-4">
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </Select>
          <Select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {/* Map through available assignees */}
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {validations?.map((validation) => (
          <Card key={validation.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{validation.assetName}</h4>
                  <Badge variant={validation.priority}>
                    {validation.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted: {new Date(validation.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Select
                  value={validation.assigneeId || ''}
                  onChange={(e) => assignValidation.mutate({
                    validationId: validation.id,
                    assigneeId: e.target.value
                  })}
                >
                  <option value="">Assign to...</option>
                  {/* Map through available validators */}
                </Select>
                <Button
                  variant="outline"
                  onClick={() => updateStatus.mutate({
                    validationId: validation.id,
                    status: 'approved'
                  })}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateStatus.mutate({
                    validationId: validation.id,
                    status: 'rejected'
                  })}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );

  const Statistics = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Validation Statistics</h3>
        <Select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Validations</p>
              <p className="text-2xl font-semibold">{stats?.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="p-4 bg-green-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-semibold">{stats?.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="p-4 bg-red-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-semibold">{stats?.rejected}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats?.timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="validations" stroke="hsl(var(--primary))" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );

  const Reports = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Validation Reports</h3>
        <Button
          onClick={() => generateReport.mutate({
            dateRange,
            priority: priorityFilter,
            assignee: assigneeFilter
          })}
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="space-y-4">
        {stats?.recentReports?.map((report) => (
          <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{report.name}</p>
              <p className="text-sm text-gray-500">
                Generated: {new Date(report.generatedAt).toLocaleDateString()}
              </p>
            </div>
            <Button variant="ghost" onClick={() => window.open(report.url)}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <ValidationQueue />
      <Statistics />
      <Reports />
    </div>
  );
};

export default ValidationDashboard;