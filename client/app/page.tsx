'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { getOnboardingApi } from '@/api/onboarding.api';
import SlidingAuthForm from '@/components/auth/SlidingAuthForm';
import Sidebar from '@/components/campaign/Sidebar';
import { Loading } from '@/components/ui/Loading';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await getOnboardingApi();
        if (!response.data) {
          router.push('/onboarding');
        } else {
          setOnboardingComplete(true);
          setLoading(false);
        }
      } catch (error) {
        router.push('/onboarding');
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, router]);

  const handleCreateCampaign = () => {
    router.push('/campaign/create');
  };

  if (loading) {
    return <Loading />;
  }

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

  if (onboardingComplete) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-8 ml-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Create New Campaign</h1>
            <button
              onClick={handleCreateCampaign}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
            >
              Start
            </button>
          </div>
        </main>
      </div>
    );
  }

  return <Loading />;
}