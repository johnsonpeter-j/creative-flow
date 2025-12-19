'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/campaign/Sidebar';
import CampaignHeader from '@/components/campaign/CampaignHeader';
import ContentType from '@/components/campaign/skeleton/content_type';
import CampaignIdeas from '@/components/campaign/skeleton/CampaignIdeas';
import AdCopyVisualDirection from '@/components/campaign/skeleton/AdCopyVisualDirection';
import DesignAd from '@/components/campaign/skeleton/DesignAd';
import AdPreview from '@/components/campaign/skeleton/AdPreview';

const STEPS = [
  { step: 1, title: 'Start a New Campaign' },
  { step: 2, title: 'Campaign Ideas' },
  { step: 3, title: 'Ad Copy & Visual Direction' },
  { step: 4, title: 'Design Your Ad' },
  { step: 5, 'title': 'Your Ad Is Ready' },
];

export default function AddCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);
  const [campaignBrief, setCampaignBrief] = useState<string>('');
  const currentStepTitle = STEPS.find((s) => s.step === currentStep)?.title || 'Create Campaign';

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ContentType campaignBrief={campaignBrief} setCampaignBrief={setCampaignBrief} />;
      case 2:
        return <CampaignIdeas selectedIdea={selectedIdea} setSelectedIdea={setSelectedIdea} />;
      case 3:
        return <AdCopyVisualDirection />;
      case 4:
        return <DesignAd />;
      case 5:
        return <AdPreview />;
      default:
        return <ContentType campaignBrief={campaignBrief} setCampaignBrief={setCampaignBrief} />;
    }
  };

  return (
    <div 
      className="h-screen flex relative overflow-hidden"
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

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col" style={{ marginLeft: '80px' }}>
        <div className="w-full max-w-7xl mx-auto px-6 pt-8 flex items-center" style={{ height: '20vh' }}>

            <CampaignHeader 
              number="Ad"
              title="Generator"
              sectionTitle={currentStepTitle}
            />
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 overflow-y-auto" style={{ height: '60vh' }}>
          <div className="flex flex-col items-center justify-center h-full">{renderStep()}</div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 flex justify-end items-center" style={{ height: '20vh' }}>
          {currentStep < STEPS.length ? (
            <button
              onClick={handleNext}
              disabled={(currentStep === 1 && !campaignBrief) || (currentStep === 2 && selectedIdea === null)}
              className="w-full max-w-xs rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                padding: '14px',
                fontSize: 'clamp(13px, 1.1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                backgroundColor: 'var(--color-frame)',
                color: 'rgba(237, 237, 237, 0.95)',
                boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(198, 124, 78, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(198, 124, 78, 0.25)';
              }}
            >
              {currentStep === 1 ? 'Generate Campaign Ideas' : 'Next'}
              <span style={{ fontSize: '16px' }}>→</span>
            </button>
          ) : (
            <button
              onClick={() => console.log('Finish')}
              className="w-full max-w-xs rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                padding: '14px',
                fontSize: 'clamp(13px, 1.1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                backgroundColor: 'var(--color-frame)',
                color: 'rgba(237, 237, 237, 0.95)',
                boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(198, 124, 78, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(198, 124, 78, 0.25)';
              }}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
