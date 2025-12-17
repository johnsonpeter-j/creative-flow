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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-10 border border-gray-100">
        <ForgotPasswordHeader />
        <ForgotPasswordForm onSubmit={handleSubmit} />
        <LoginLink onLoginClick={handleLogin} />
      </div>
    </div>
  );
}


