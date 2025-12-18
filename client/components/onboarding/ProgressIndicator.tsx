'use client';

import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="w-full mb-8">
      <div className="relative w-full">
        {/* Background line */}
        <div
          style={{
            width: '100%',
            height: '3px',
            backgroundColor: 'rgba(49, 49, 49, 0.15)',
            borderRadius: '2px',
          }}
        />
        {/* Progress line */}
        <div
          className="absolute top-0 left-0 transition-all duration-500 ease-out"
          style={{
            width: `${progressPercentage}%`,
            height: '3px',
            backgroundColor: 'var(--color-frame)',
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  );
}

