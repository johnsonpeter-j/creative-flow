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
        className="glass-strong rounded-3xl w-full max-w-2xl p-10 animate-scale-in relative z-10"
        style={{ 
          boxShadow: '0 20px 60px rgba(49, 49, 49, 0.15), 0 0 0 1px rgba(198, 124, 78, 0.1)',
        }}
      >
        <OnboardingHeader />
        <div className="mt-8">
          <OnboardingForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

