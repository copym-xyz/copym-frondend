import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock } from 'lucide-react';

const RegistrationPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <Clock className="h-16 w-16 text-primary animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">
          Registration Pending Approval
        </h1>
        
        <div className="space-y-4 text-gray-600">
          <p>Your institution registration is currently under review.</p>
          <p>You will receive an email notification once your registration has been approved.</p>
        </div>
        
        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 justify-center">
            <CheckCircle2 className="h-4 w-4" />
            <span>Registration details submitted</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 justify-center">
            <Clock className="h-4 w-4" />
            <span>Awaiting admin verification</span>
          </div>
        </div>

        <div className="pt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationPending;