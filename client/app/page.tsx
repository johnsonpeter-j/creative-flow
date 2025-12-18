'use client';

import SlidingAuthForm from '@/components/auth/SlidingAuthForm';

export default function HomePage() {
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Abstract Background Shapes - Same as onboarding */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            width: '400px',
            height: '400px',
            left: '-100px',
            bottom: '-100px',
            backgroundColor: 'rgba(198, 124, 78, 0.08)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            transform: 'rotate(-45deg)',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '350px',
            height: '350px',
            right: '-80px',
            top: '-80px',
            backgroundColor: 'rgba(198, 124, 78, 0.06)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'rotate(45deg)',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '300px',
            height: '300px',
            right: '10%',
            bottom: '10%',
            backgroundColor: 'rgba(237, 214, 200, 0.4)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            transform: 'rotate(20deg)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <SlidingAuthForm />
      </div>
    </div>
  );
}