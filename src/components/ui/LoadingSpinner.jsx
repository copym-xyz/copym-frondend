// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[100px]">
      <div className={`
        ${sizeClasses[size]}
        animate-spin
        rounded-full
        border-4
        border-primary
        border-r-transparent
        ${className}
      `}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

// You can also create a full-page loading spinner variant
export const FullPageSpinner = () => {
  return (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  );
};

export default LoadingSpinner;