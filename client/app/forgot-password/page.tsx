'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordHeader from '@/components/forgot-password/ForgotPasswordHeader';
import ForgotPasswordForm from '@/components/forgot-password/ForgotPasswordForm';
import LoginLink from '@/components/forgot-password/LoginLink';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSubmit = (email: string) => {
    // TODO: Backend API call to send reset password email with JWT token
    // The backend should:
    // 1. Generate a JWT token
    // 2. Send email with link: /reset-password/:token
    console.log('Forgot password submitted:', { email });
    // After successful API call, you might want to show a success message
  };

  const handleLogin = () => {
    router.push('/');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(198, 124, 78, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(198, 124, 78, 0.08) 0%, transparent 50%)`,
        }}
      />
      <div 
        className="glass-strong rounded-3xl w-full max-w-md p-10 animate-scale-in relative z-10"
        style={{ 
          boxShadow: '0 20px 60px rgba(49, 49, 49, 0.15), 0 0 0 1px rgba(198, 124, 78, 0.1)',
        }}
      >
        <ForgotPasswordHeader />
        <div className="mt-8">
          <ForgotPasswordForm onSubmit={handleSubmit} />
        </div>
        <LoginLink onLoginClick={handleLogin} />
      </div>
    </div>
  );
}


