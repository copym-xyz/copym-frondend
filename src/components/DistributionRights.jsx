export const DistributionRights = ({ assetId }) => {
    const { data: distributionData } = useQuery(
      ['distribution', assetId],
      () => api.get(`/assets/${assetId}/distribution`)
    );
  
    const updateDistribution = useMutation({
      mutationFn: (data) => api.patch(`/assets/${assetId}/distribution`, data)
    });
  
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribution Rights</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Distribution Frequency
              </label>
              <select
                className="w-full border rounded-md p-2"
                value={distributionData?.frequency || ''}
                onChange={(e) => updateDistribution.mutate({
                  frequency: e.target.value
                })}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Distribution Type
              </label>
              <select
                className="w-full border rounded-md p-2"
                value={distributionData?.type || ''}
                onChange={(e) => updateDistribution.mutate({
                  type: e.target.value
                })}
              >
                <option value="pro_rata">Pro Rata</option>
                <option value="fixed">Fixed Amount</option>
                <option value="waterfall">Waterfall</option>
              </select>
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Distribution Amount
            </label>
            <Input
              type="number"
              value={distributionData?.minAmount || ''}
              onChange={(e) => updateDistribution.mutate({
                minAmount: parseFloat(e.target.value)
              })}
            />
          </div>
        </div>
      </Card>
    );
  };