import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
 const navigate = useNavigate();

 return (
   <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-4">
     <Card className="w-full max-w-md p-8 shadow-lg">
       <div className="text-center mb-8">
         <h1 className="text-3xl font-bold text-gray-900">RWA Platform</h1>
         <p className="mt-2 text-gray-600">Manage and track real-world assets</p>
       </div>
       
       <div className="space-y-4">
         <Button 
           className="w-full py-6 text-lg"
           onClick={() => navigate('/login')}
         >
           Login
         </Button>
         
         <Button 
           className="w-full py-6 text-lg"
           variant="outline"
           onClick={() => navigate('/register-institution')}
         >
           Register New Institution
         </Button>
         
         <Button 
           className="w-full py-6 text-lg" 
           variant="outline"
           onClick={() => navigate('/register')}
         >
           Register as User
         </Button>
       </div>

       <p className="mt-6 text-center text-sm text-gray-500">
         Secure Asset Management and Validation Platform
       </p>
     </Card>
   </div>
 );
};

export default LandingPage;