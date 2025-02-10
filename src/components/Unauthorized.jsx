import React from 'react'
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const Unauthorized = () => (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-6">
        <h1>Unauthorized Access</h1>
        <p>You don't have permission to access this page.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Card>
    </div>
  );
export default Unauthorized