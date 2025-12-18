'use client';

import { useRouter } from 'next/navigation';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingForm from '@/components/onboarding/OnboardingForm';
import { onboardingApi } from '@/api/onboarding.api';

export default function OnboardingPage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    brandName: string;
    industry: string;
    logo: File | null;
    logoPosition: string;
    typography: string;
    colorPalette: string[];
  }) => {
    try {
      await onboardingApi({
        brandName: data.brandName,
        industry: data.industry,
        logo: data.logo || undefined,
        logoPosition: data.logoPosition,
        typography: data.typography,
        colorPalette: data.colorPalette,
      });
      // After successful submission, redirect to dashboard or next step
      // router.push('/dashboard');
    } catch (error) {
      // Error is already handled by the API function with toast notification
      console.error('Onboarding submission failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-2xl p-10 border border-gray-100">
        <OnboardingHeader />
        <OnboardingForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

