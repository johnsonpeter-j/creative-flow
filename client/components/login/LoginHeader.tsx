import React from 'react';
import { Lock } from 'lucide-react';

export default function LoginHeader() {
  return (
    <div className="text-center mb-10 animate-fade-in">
      <div 
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transform transition-all duration-300 hover:scale-110 hover:rotate-3"
        style={{ 
          backgroundColor: 'var(--color-frame)',
          boxShadow: '0 8px 24px rgba(198, 124, 78, 0.3)',
        }}
      >
        <Lock className="w-8 h-8" style={{ color: 'var(--color-background)' }} />
      </div>
      <h1 
        className="font-bold mb-2 tracking-tight"
        style={{ 
          color: 'var(--color-frame)',
          letterSpacing: '-0.02em',
          fontSize: 'clamp(24px, 3vw + 0.5rem, 28px)',
          fontFamily: 'var(--font-roboto), sans-serif',
        }}
      >
        Creative Flow
      </h1>
      <p 
        className="mt-3 font-medium" 
        style={{ 
          color: 'var(--color-text)', 
          opacity: 0.65,
          fontSize: 'clamp(11px, 1vw + 0.5rem, 13px)',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        Welcome back! Please sign in to continue.
      </p>
    </div>
  );
}


