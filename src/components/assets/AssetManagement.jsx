import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OwnershipDetails } from './OwnershipDetails';
import { TransferRules } from './TransferRules';
import { Distribution } from './Distribution';
import { VotingRights } from './VotingRights';

export const AssetManagement = ({ assetId }) => {
  const { data: asset } = useQuery(['asset', assetId], 
    () => api.get(`/assets/${assetId}`));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Tabs defaultValue="ownership">
          <TabsList>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
            <TabsTrigger value="transfer">Transfer Rules</TabsTrigger>
            <TabsTrigger value="distribution">Distribution Rights</TabsTrigger>
            <TabsTrigger value="voting">Voting Rights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ownership">
            <OwnershipDetails 
              ownershipData={asset?.ownership}
              holdingPeriod={asset?.holdingPeriod}
              ownerLimits={asset?.ownerLimits}
            />
          </TabsContent>

          <TabsContent value="transfer">
            <TransferRules 
              transferRules={asset?.transferRules}
              timeLocks={asset?.timeLocks}
              valueLimits={asset?.valueLimits}
            />
          </TabsContent>

          <TabsContent value="distribution">
            <Distribution 
              distributionRights={asset?.distributionRights}
              exitRights={asset?.exitRights}
            />
          </TabsContent>

          <TabsContent value="voting">
            <VotingRights 
              votingRights={asset?.votingRights}
              governanceRules={asset?.governanceRules}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AssetManagement;