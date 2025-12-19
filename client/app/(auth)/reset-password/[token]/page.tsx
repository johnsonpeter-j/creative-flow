'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPasswordThunk } from '@/store/slices/authThunk';
import ResetPasswordHeader from '@/components/reset-password/ResetPasswordHeader';
import ResetPasswordForm from '@/components/reset-password/ResetPasswordForm';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const token = params.token as string;

  const handleSubmit = async (password: string) => {
    try {
      await dispatch(resetPasswordThunk({ token, password })).unwrap();
      // Success is handled by the thunk (toast notification)
      // Redirect to login page after successful password reset
      router.push('/login');
    } catch (err) {
      // Error is already handled by the thunk (toast notification)
      console.error('Reset password failed:', err);
    }
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
          <ResetPasswordForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}


