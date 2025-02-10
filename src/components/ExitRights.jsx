export const ExitRights = ({ assetId }) => {
    const { data: exitData } = useQuery(
      ['exit', assetId],
      () => api.get(`/assets/${assetId}/exit-rights`)
    );
  
    const updateExitRights = useMutation({
      mutationFn: (data) => api.patch(`/assets/${assetId}/exit-rights`, data)
    });
  
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Exit Rights</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Exit Mechanism
            </label>
            <select
              className="w-full border rounded-md p-2"
              value={exitData?.mechanism || ''}
              onChange={(e) => updateExitRights.mutate({
                mechanism: e.target.value
              })}
            >
              <option value="redemption">Redemption</option>
              <option value="secondary_sale">Secondary Sale</option>
              <option value="put_option">Put Option</option>
            </select>
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Notice Period
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={exitData?.noticePeriod || ''}
                  onChange={(e) => updateExitRights.mutate({
                    noticePeriod: parseInt(e.target.value)
                  })}
                />
                <span>days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Exit Fee
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={exitData?.exitFee || ''}
                  onChange={(e) => updateExitRights.mutate({
                    exitFee: parseFloat(e.target.value)
                  })}
                />
                <span>%</span>
              </div>
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">
              Restrictions
            </label>
            <div className="space-y-2">
              {exitData?.restrictions?.map((restriction, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{restriction.type}</span>
                  <Badge variant={restriction.active ? 'success' : 'secondary'}>
                    {restriction.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  };