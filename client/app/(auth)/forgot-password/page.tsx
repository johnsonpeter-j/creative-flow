'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgotPasswordThunk } from '@/store/slices/authThunk';
import ForgotPasswordHeader from '@/components/forgot-password/ForgotPasswordHeader';
import ForgotPasswordForm from '@/components/forgot-password/ForgotPasswordForm';
import LoginLink from '@/components/forgot-password/LoginLink';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (email: string) => {
    try {
      await dispatch(forgotPasswordThunk({ email })).unwrap();
      // Success is handled by the thunk (toast notification)
    } catch (err) {
      // Error is already handled by the thunk (toast notification)
      console.error('Forgot password failed:', err);
    }
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
          <ForgotPasswordForm onSubmit={handleSubmit} loading={loading} />
        </div>
        <LoginLink onLoginClick={handleLogin} />
      </div>
    </div>
  );
}


