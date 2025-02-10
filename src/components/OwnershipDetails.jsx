import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, ArrowRight, Settings } from 'lucide-react';

// OwnershipDetails Component
export const OwnershipDetails = ({ assetId }) => {
  const { data: ownershipData } = useQuery(
    ['ownership', assetId],
    () => api.get(`/assets/${assetId}/ownership`)
  );

  const updateOwnership = useMutation({
    mutationFn: (data) => api.patch(`/assets/${assetId}/ownership`, data)
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Holding Period Rules</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Holding Period
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={ownershipData?.minHoldingPeriod || ''}
                onChange={(e) => updateOwnership.mutate({
                  minHoldingPeriod: parseInt(e.target.value)
                })}
              />
              <span>days</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Lock-up Period
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={ownershipData?.lockupPeriod || ''}
                onChange={(e) => updateOwnership.mutate({
                  lockupPeriod: parseInt(e.target.value)
                })}
              />
              <span>days</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Owner Limits</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Maximum Owners
            </label>
            <Input
              type="number"
              value={ownershipData?.maxOwners || ''}
              onChange={(e) => updateOwnership.mutate({
                maxOwners: parseInt(e.target.value)
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Ownership Percentage
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={ownershipData?.minOwnershipPct || ''}
                onChange={(e) => updateOwnership.mutate({
                  minOwnershipPct: parseFloat(e.target.value)
                })}
              />
              <span>%</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};