import React from 'react';
import { KeyRound } from 'lucide-react';

export default function ForgotPasswordHeader() {
  return (
    <div className="text-center mb-10 animate-fade-in">
      <div 
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transform transition-all duration-300 hover:scale-110 hover:rotate-3"
        style={{ 
          backgroundColor: 'var(--color-frame)',
          boxShadow: '0 8px 24px rgba(198, 124, 78, 0.3)',
        }}
      >
        <KeyRound className="w-8 h-8" style={{ color: 'var(--color-background)' }} />
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
        Forgot Password?
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
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>
  );
}


