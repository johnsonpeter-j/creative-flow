'use client';

import React from 'react';

interface LoginLinkProps {
  onLoginClick?: () => void;
}

export default function LoginLink({ onLoginClick }: LoginLinkProps) {
  return (
    <p className="text-center mt-8 pt-6 border-t" style={{
      color: 'var(--color-text)',
      opacity: 0.65,
      borderColor: 'rgba(198, 124, 78, 0.15)',
      fontSize: 'clamp(11px, 1vw + 0.5rem, 13px)',
      fontFamily: 'var(--font-inter), sans-serif',
    }}>
      Remember your password?{' '}
      <button
        onClick={onLoginClick}
        className="font-semibold transition-all duration-200 hover:underline underline-offset-4 cursor-pointer"
        style={{ 
          color: 'var(--color-frame)',
          fontSize: 'clamp(11px, 1vw + 0.5rem, 13px)',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.85';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Sign in
      </button>
    </p>
  );
}



