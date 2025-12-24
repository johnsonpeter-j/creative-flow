'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { getOnboardingApi } from '@/api/onboarding.api';
import SlidingAuthForm from '@/components/auth/SlidingAuthForm';
import { Loading } from '@/components/ui/Loading';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      // If authenticated, check onboarding status and redirect
      try {
        const response = await getOnboardingApi();
        if (!response.data) {
          // Not onboarded, redirect to onboarding
          router.push('/onboarding');
        } else {
          // Onboarded, redirect to campaign
          router.push('/campaign');
        }
      } catch (error) {
        // On error, try onboarding first
        router.push('/onboarding');
      }
    };

    checkAuthAndRedirect();
  }, [isAuthenticated, router]);

  // Show loading while checking auth
  if (loading && isAuthenticated) {
    return <Loading />;
  }

  // Show auth form for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen relative overflow-hidden"
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

        {/* Main Content */}
        <div className="relative z-10">
          <SlidingAuthForm />
        </div>
      </div>
    );
  }

  // This should not be reached, but show loading just in case
  return <Loading />;
}