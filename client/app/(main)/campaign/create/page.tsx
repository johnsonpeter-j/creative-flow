'use client';

import React, { useState, useEffect } from 'react';
import CampaignHeader from '@/components/campaign/CampaignHeader';
import ContentType from '@/components/campaign/skeleton/content_type';
import CampaignIdeas from '@/components/campaign/skeleton/CampaignIdeas';
import AdCopyVisualDirection from '@/components/campaign/skeleton/AdCopyVisualDirection';
import DesignAd from '@/components/campaign/skeleton/DesignAd';
import AdPreview from '@/components/campaign/skeleton/AdPreview';
import { createCampaignApi, generateCampaignIdeasApi, generateAdCopyApi, CampaignIdea, AdCopy } from '@/api/campaign.api';

const STEPS = [
  { step: 1, title: 'Start a New Campaign' },
  { step: 2, title: 'Campaign Ideas' },
  { step: 3, title: 'Ad Copy & Visual Direction' },
  { step: 4, title: 'Design Your Ad' },
  { step: 5, title: 'Your Ad Is Ready' },
];

export default function AddCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);
  const [campaignBrief, setCampaignBrief] = useState<string>('');
  const [campaignId, setCampaignId] = useState<string>('');
  const [campaignIdeas, setCampaignIdeas] = useState<CampaignIdea[]>([]);
  const [adCopy, setAdCopy] = useState<AdCopy | null>(null);
  const [editedImageDataURL, setEditedImageDataURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bakeTextWithAI, setBakeTextWithAI] = useState(false);
  const [objective, setObjective] = useState<string>('Awareness');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [adFormats, setAdFormats] = useState<string[]>([]);
  const currentStepTitle = STEPS.find((s) => s.step === currentStep)?.title || 'Create Campaign';

  // Auto-skip step 4 if text is baked with AI
  useEffect(() => {
    if (currentStep === 4 && bakeTextWithAI && adCopy?.image_url) {
      setCurrentStep(5);
    }
  }, [currentStep, bakeTextWithAI, adCopy?.image_url]);

  const handleNext = async () => {
    if (currentStep === 1) {
      // Generate campaign ideas
      setLoading(true);
      try {
        // Create campaign
        const campaign = await createCampaignApi({
          campaign_brief: campaignBrief,
          objective: objective,
          target_audience: targetAudience,
          ad_formats: adFormats
        });
        
        setCampaignId(campaign.id);
        
        // Generate ideas using multi-agent system
        const result = await generateCampaignIdeasApi(campaign.id);
        
        // Check if we got valid ideas
        if (!result || !result.top_ideas || result.top_ideas.length === 0) {
          throw new Error('No ideas were generated. Please try again.');
        }
        
        setCampaignIdeas(result.top_ideas);
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        console.error('Error generating campaign ideas:', error);
        
        // Get error message
        let errorMessage = 'Failed to generate campaign ideas. ';
        if (error.response?.data?.detail) {
          errorMessage += error.response.data.detail;
        } else if (error.message) {
          errorMessage += error.message;
        } else if (error.code === 'ECONNABORTED') {
          errorMessage += 'The request took too long. Please try again.';
        } else {
          errorMessage += 'Please try again.';
        }
        
        alert(errorMessage);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 2) {
      // Generate ad copy and visual direction
      if (selectedIdea === null) {
        alert('Please select a campaign idea first.');
        return;
      }
      
      setLoading(true);
      try {
        const result = await generateAdCopyApi(campaignId, selectedIdea);
        setAdCopy(result.ad_copy);
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        console.error('Error generating ad copy:', error);
        
        let errorMessage = 'Failed to generate ad copy. ';
        if (error.response?.data?.detail) {
          errorMessage += error.response.data.detail;
        } else if (error.message) {
          errorMessage += error.message;
        } else if (error.code === 'ECONNABORTED') {
          errorMessage += 'The request took too long. Please try again.';
        } else {
          errorMessage += 'Please try again.';
        }
        
        alert(errorMessage);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 3) {
      // Step 3: Ad Copy & Visual Direction -> Next step
      // Check if image is generated
      if (!adCopy?.image_url) {
        alert('Please generate the image first by clicking "Generate Image" button.');
        return;
      }
      
      // If bakeTextWithAI is checked and image exists, skip to preview (step 5)
      // Otherwise go to Design Your Ad (step 4)
      if (bakeTextWithAI && adCopy?.image_url) {
        setCurrentStep(5); // Skip to preview
      } else {
        setCurrentStep(4); // Go to Design Your Ad
      }
    } else if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ContentType 
          campaignBrief={campaignBrief} 
          setCampaignBrief={setCampaignBrief}
          objective={objective}
          setObjective={setObjective}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          adFormats={adFormats}
          setAdFormats={setAdFormats}
        />;
      case 2:
        return <CampaignIdeas 
          selectedIdea={selectedIdea} 
          setSelectedIdea={setSelectedIdea}
          campaignIdeas={campaignIdeas}
          loading={loading}
        />;
      case 3:
        return <AdCopyVisualDirection 
          adCopy={adCopy} 
          loading={loading} 
          campaignId={campaignId}
          onImageGenerated={(updatedAdCopy) => setAdCopy(updatedAdCopy)}
          onBakeTextChange={setBakeTextWithAI}
        />;
      case 4:
        // Skip Design Your Ad step if text is baked with AI
        if (bakeTextWithAI && adCopy?.image_url) {
          // Automatically skip to preview step
          return null; // Will be handled by useEffect
        }
        return <DesignAd adCopy={adCopy} onEditedImageChange={setEditedImageDataURL} />;
      case 5:
        return <AdPreview adCopy={adCopy} editedImageDataURL={editedImageDataURL} />;
      default:
        return <ContentType 
          campaignBrief={campaignBrief} 
          setCampaignBrief={setCampaignBrief}
          objective={objective}
          setObjective={setObjective}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          adFormats={adFormats}
          setAdFormats={setAdFormats}
        />;
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-6 pt-8 flex items-center" style={{ height: '20vh' }}>

            <CampaignHeader 
              number="Ad"
              title="Generator"
              sectionTitle={currentStepTitle}
            />
        </div>

        <div className="w-full max-w-7xl mx-auto px-6" style={{ minHeight: '60vh', overflow: 'auto' }}>
          <div className="flex flex-col items-center justify-start min-h-full">{renderStep()}</div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 flex justify-end items-center" style={{ height: '20vh' }}>
          {currentStep < STEPS.length ? (
            <button
              onClick={handleNext}
              disabled={(currentStep === 1 && (!campaignBrief || adFormats.length === 0)) || (currentStep === 2 && selectedIdea === null) || loading}
              className="w-full max-w-xs rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                padding: '14px',
                fontSize: 'clamp(13px, 1.1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                backgroundColor: 'var(--color-frame)',
                color: 'rgba(237, 237, 237, 0.95)',
                boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
                opacity: ((currentStep === 1 && (!campaignBrief || adFormats.length === 0)) || (currentStep === 2 && selectedIdea === null) || (currentStep === 3 && !adCopy?.image_url) || loading) ? 0.5 : 1,
                cursor: ((currentStep === 1 && (!campaignBrief || adFormats.length === 0)) || (currentStep === 2 && selectedIdea === null) || (currentStep === 3 && !adCopy?.image_url) || loading) ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!loading && !((currentStep === 1 && (!campaignBrief || adFormats.length === 0)) || (currentStep === 2 && selectedIdea === null) || (currentStep === 3 && !adCopy?.image_url))) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(198, 124, 78, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(198, 124, 78, 0.25)';
              }}
            >
              {loading 
                ? 'Generating Ideas...' 
                : currentStep === 1 
                  ? 'Generate Campaign Ideas' 
                  : currentStep === 3 && !adCopy?.image_url
                    ? 'Generate Image First'
                    : 'Next'}
              {!loading && <span style={{ fontSize: '16px' }}>→</span>}
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
    </>
  );
}

