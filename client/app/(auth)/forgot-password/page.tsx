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


