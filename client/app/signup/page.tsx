'use client';

import { useRouter } from 'next/navigation';
import SignupHeader from '@/components/signup/SignupHeader';
import SignupForm from '@/components/signup/SignupForm';
import LoginLink from '@/components/signup/LoginLink';

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = (name: string, email: string, password: string) => {
    console.log('Signup submitted:', { name, email, password });
  };

  const handleLogin = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-10 border border-gray-100">
        <SignupHeader />
        <SignupForm onSubmit={handleSubmit} />

        <LoginLink onLoginClick={handleLogin} />
      </div>
    </div>
  );
}

