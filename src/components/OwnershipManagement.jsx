const OwnershipManagement = ({ assetId }) => {
    return (
      <div className="space-y-6">
        <OwnershipDetails assetId={assetId} />
        <DistributionRights assetId={assetId} />
        <ExitRights assetId={assetId} />
      </div>
    );
  };
  
  export default OwnershipManagement;