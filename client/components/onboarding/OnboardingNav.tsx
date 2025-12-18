'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function OnboardingNav() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-8">
      <button
        onClick={() => router.back()}
        className="flex items-center justify-center rounded-lg transition-all duration-200"
        style={{
          width: '36px',
          height: '36px',
          color: 'rgba(49, 49, 49, 0.7)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(198, 124, 78, 0.1)';
          e.currentTarget.style.color = 'var(--color-frame)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'rgba(49, 49, 49, 0.7)';
        }}
      >
        <ArrowLeft style={{ width: '20px', height: '20px' }} />
      </button>
      <h2
        style={{
          fontSize: 'clamp(16px, 2vw + 0.5rem, 18px)',
          fontFamily: 'var(--font-roboto), sans-serif',
          fontWeight: 400,
          color: 'rgba(49, 49, 49, 0.9)',
        }}
      >
        Account verification
      </h2>
      <div
        className="rounded-full px-3 py-1"
        style={{
          backgroundColor: 'rgba(198, 124, 78, 0.15)',
          color: 'var(--color-frame)',
          fontSize: 'clamp(11px, 0.95vw + 0.5rem, 12px)',
          fontFamily: 'var(--font-inter), sans-serif',
          fontWeight: 400,
        }}
      >
        In progress
      </div>
    </div>
  );
}

