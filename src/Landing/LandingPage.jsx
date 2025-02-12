import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wallet, Building2, UserPlus } from 'lucide-react';

const GlowingBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-lg blur-3xl opacity-20 animate-pulse"></div>
    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-lg blur-3xl opacity-10 animate-pulse delay-700"></div>
  </div>
);

const FloatingCard = ({ children, className }) => (
  <div className={`relative bg-slate-900/80 backdrop-blur-lg rounded-lg p-6 shadow-xl border border-slate-800 hover:border-slate-700 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <GlowingBackground />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Accelerate Your Crypto Journey
          </h1>
          <p className="text-slate-400 text-lg">
            Experience the next generation of secure digital asset management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FloatingCard className="transform hover:-translate-y-2">
            <div className="flex flex-col items-center">
              <div className="mb-6 p-3 bg-blue-500/10 rounded">
                <Wallet className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Login</h2>
              <p className="text-slate-400 text-sm mb-6 text-center">
                Access your secure wallet
              </p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white group rounded"
                onClick={() => navigate('/login')}
              >
                Enter Platform
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </FloatingCard>

          <FloatingCard className="transform hover:-translate-y-2">
            <div className="flex flex-col items-center">
              <div className="mb-6 p-3 bg-purple-500/10 rounded">
                <Building2 className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Institution</h2>
              <p className="text-slate-400 text-sm mb-6 text-center">
                Register your organization
              </p>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-500 text-white group rounded"
                onClick={() => navigate('/register-institution')}
              >
                Register Institution
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </FloatingCard>

          <FloatingCard className="transform hover:-translate-y-2">
            <div className="flex flex-col items-center">
              <div className="mb-6 p-3 bg-emerald-500/10 rounded">
                <UserPlus className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">User Account</h2>
              <p className="text-slate-400 text-sm mb-6 text-center">
                Create personal account
              </p>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white group rounded"
                onClick={() => navigate('/register')}
              >
                Register User
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </FloatingCard>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Secure • Scalable • Seamless
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;