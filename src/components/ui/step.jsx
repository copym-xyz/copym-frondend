import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Steps = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="relative flex items-center">
              <button
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  "transition-colors duration-200",
                  {
                    "bg-primary text-primary-foreground": isCompleted || isCurrent,
                    "bg-gray-200": !isCompleted && !isCurrent,
                    "cursor-pointer": index <= currentStep,
                    "cursor-not-allowed": index > currentStep
                  }
                )}
                onClick={() => onStepClick?.(index)}
                disabled={index > currentStep}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[2px] mx-2",
                  {
                    "bg-primary": isCompleted,
                    "bg-gray-200": !isCompleted
                  }
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};