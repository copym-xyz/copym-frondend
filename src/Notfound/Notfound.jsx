import React from 'react';
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Animated 404 Text */}
        <h1 className="text-8xl font-bold text-primary animate-bounce">
          404
        </h1>
        
        {/* Main heading with fade-in animation */}
        <div className="space-y-4 animate-[fadeIn_1s_ease-in]">
          <h2 className="text-4xl font-semibold text-foreground">
            Page not found
          </h2>
          <p className="text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Button with hover animation */}
        <div className="pt-8 animate-[slideUp_0.5s_ease-out]">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="group transition-all duration-300 hover:border-primary"
          >
            <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Background pattern - adapts to dark mode */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(var(--muted)_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
    </div>
  );
};

export default NotFound;