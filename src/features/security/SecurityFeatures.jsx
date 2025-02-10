import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Key, Lock, AlertTriangle, 
  UserCheck, Clock, Eye, EyeOff,
  Download
} from 'lucide-react';

const SecurityFeatures = () => {
  const { toast } = useToast();
  const [showSecret, setShowSecret] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emergencyStop, setEmergencyStop] = useState(false);

  // 2FA setup mutation
  const setup2FA = useMutation({
    mutationFn: () => api.post('/auth/2fa/setup'),
    onSuccess: (data) => {
      toast({
        title: '2FA Setup Successful',
        description: 'Please save your backup codes'
      });
    }
  });

  // Emergency stop mutation
  const toggleEmergencyStop = useMutation({
    mutationFn: (enabled) => api.post('/security/emergency-stop', { enabled }),
    onSuccess: () => {
      toast({
        title: 'Emergency Stop Updated',
        description: `Emergency stop ${emergencyStop ? 'enabled' : 'disabled'}`
      });
    }
  });

  // Access control mutation
  const updateAccessControl = useMutation({
    mutationFn: (settings) => api.patch('/security/access-control', settings)
  });

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Enable 2FA</span>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={(checked) => {
                setTwoFactorEnabled(checked);
                if (checked) {
                  setup2FA.mutate();
                }
              }}
            />
          </div>

          {setup2FA.data && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium mb-2">Backup Codes</p>
                <div className="grid grid-cols-2 gap-2">
                  {setup2FA.data.backupCodes.map((code, index) => (
                    <code key={index} className="p-1 bg-white rounded">
                      {code}
                    </code>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Input
                  type={showSecret ? 'text' : 'password'}
                  value={setup2FA.data.secret}
                  readOnly
                />
                <Button
                  variant="ghost"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Access Controls */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Access Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span>Multi-Signature Required</span>
            </div>
            <Switch
              onCheckedChange={(checked) => 
                updateAccessControl.mutate({ multiSig: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Time-based Restrictions</span>
            </div>
            <Switch
              onCheckedChange={(checked) =>
                updateAccessControl.mutate({ timeRestricted: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <span>IP Whitelist</span>
            </div>
            <Switch
              onCheckedChange={(checked) =>
                updateAccessControl.mutate({ ipWhitelist: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Emergency Controls */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Emergency Controls</h3>
        <div className="space-y-4">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <p>Emergency stop will halt all asset operations immediately</p>
          </Alert>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Emergency Stop</span>
            </div>
            <Switch
              checked={emergencyStop}
              onCheckedChange={(checked) => {
                setEmergencyStop(checked);
                toggleEmergencyStop.mutate(checked);
              }}
            />
          </div>

          {emergencyStop && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Emergency Stop Active</span>
              </div>
              <p className="mt-2 text-sm text-red-500">
                All asset operations are currently halted. Contact system administrator to resume operations.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Audit Logging */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Audit Log</h3>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2">Timestamp</th>
                  <th className="text-left px-4 py-2">Action</th>
                  <th className="text-left px-4 py-2">User</th>
                  <th className="text-left px-4 py-2">IP Address</th>
                  <th className="text-left px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">2024-02-09 10:30:15</td>
                  <td className="px-4 py-2">Login Attempt</td>
                  <td className="px-4 py-2">john.doe@example.com</td>
                  <td className="px-4 py-2">192.168.1.1</td>
                  <td className="px-4 py-2">
                    <Badge variant="success">Success</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>
      </Card>

      {/* Value Limits */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Limits</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Single Transaction Limit
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                onChange={(e) => updateAccessControl.mutate({
                  singleTransactionLimit: parseFloat(e.target.value)
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Daily Transaction Limit
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                onChange={(e) => updateAccessControl.mutate({
                  dailyTransactionLimit: parseFloat(e.target.value)
                })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <span>Require Approval Above Limit</span>
            </div>
            <Switch
              onCheckedChange={(checked) =>
                updateAccessControl.mutate({ requireApproval: checked })
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecurityFeatures;