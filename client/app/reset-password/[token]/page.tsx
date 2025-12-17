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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-10 border border-gray-100">
        <ResetPasswordHeader />
        <ResetPasswordForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}


