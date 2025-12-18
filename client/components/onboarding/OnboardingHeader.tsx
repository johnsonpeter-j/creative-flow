import React from 'react';

interface OnboardingHeaderProps {
  title: string;
  subtitle?: string;
}

export default function OnboardingHeader({ title, subtitle }: OnboardingHeaderProps) {
  return (
    <div className="mb-8">
      <h1 
        className="mb-3"
        style={{ 
          color: 'rgba(49, 49, 49, 0.95)',
          letterSpacing: '-0.01em',
          fontSize: 'clamp(24px, 3vw + 0.5rem, 28px)',
          fontFamily: 'var(--font-roboto), sans-serif',
          fontWeight: 400,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p 
          style={{ 
            color: 'rgba(49, 49, 49, 0.6)', 
            fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

