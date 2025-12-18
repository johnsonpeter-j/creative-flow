'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginHeader from '@/components/login/LoginHeader';
import LoginForm from '@/components/login/LoginForm';
import Divider from '@/components/login/Divider';
import SocialLoginButtons from '@/components/login/SocialLoginButtons';
import SignUpLink from '@/components/login/SignUpLink';

export default function SignInPage() {
  const router = useRouter();

  const handleSubmit = (email: string, password: string) => {
    console.log('Login submitted:', { email, password });
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
  };

  const handleGithubSignIn = () => {
    console.log('GitHub sign in clicked');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-10 border border-gray-100">
        <LoginHeader />
        <LoginForm onSubmit={handleSubmit} onForgotPasswordClick={handleForgotPassword} />
        {/* <Divider />
        <SocialLoginButtons 
          onGoogleSignIn={handleGoogleSignIn}
          onGithubSignIn={handleGithubSignIn}
        /> */}
        <SignUpLink onSignUpClick={handleSignUp} />
      </div>
    </div>
  );
}


