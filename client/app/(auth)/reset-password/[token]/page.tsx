'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ResetPasswordHeader from '@/components/reset-password/ResetPasswordHeader';
import ResetPasswordForm from '@/components/reset-password/ResetPasswordForm';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const handleSubmit = (password: string) => {
    // TODO: Backend API call to reset password using the token
    // The backend should:
    // 1. Verify the JWT token
    // 2. Update the user's password
    console.log('Reset password submitted:', { token, password });
    // After successful API call, redirect to login page
    // router.push('/');
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
        <ResetPasswordHeader />
        <div className="mt-8">
          <ResetPasswordForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}


