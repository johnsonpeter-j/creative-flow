'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CampaignHeader from "@/components/campaign/CampaignHeader";
import CampaignCard from "@/components/campaign/cardItem";
import { getUserCampaignsApi, CampaignResponse } from "@/api/campaign.api";

export default function CampaignPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserCampaignsApi();
        setCampaigns(data);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load campaigns. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCreateCampaign = () => {
    router.push('/campaign/create');
  };

  return (
    <main className="relative z-10 flex-1 flex flex-col">
      {/* Header Section */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-8" style={{ height: '20vh' }}>
        <CampaignHeader 
          number="Ad"
          title="Generator"
          sectionTitle={'Elevate your ads. Amplify your brand.'}
        />
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto px-6 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-frame)' }}></div>
              <p style={{ color: 'rgba(49, 49, 49, 0.6)' }}>Loading campaigns...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] py-12">
            <div className="text-center max-w-md">
              <p className="text-base mb-4" style={{ color: 'rgba(220, 38, 38, 0.8)' }}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg px-4 py-2"
                style={{
                  backgroundColor: 'var(--color-frame)',
                  color: 'rgba(237, 237, 237, 0.95)',
                }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : campaigns.length === 0 || campaigns.filter((campaign) => campaign.ad_copy).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] py-12">
            {/* Empty State */}
            <div className="text-center max-w-md">
              <div 
                className="mx-auto mb-6 flex items-center justify-center rounded-full"
                style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: 'rgba(198, 124, 78, 0.1)',
                }}
              >
                <svg 
                  width="60" 
                  height="60" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ color: 'var(--color-frame)' }}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>

              <h2 
                className="text-2xl font-semibold mb-3"
                style={{ color: 'rgba(49, 49, 49, 0.95)' }}
              >
                No campaigns yet
              </h2>
              
              <p 
                className="text-base mb-8"
                style={{ color: 'rgba(49, 49, 49, 0.6)' }}
              >
                Get started by creating your first ad campaign. Our AI-powered generator will help you create compelling ads that resonate with your audience.
              </p>
              
              {/* Create Campaign Button */}
              <button
                onClick={handleCreateCampaign}
                className="rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                style={{
                  padding: '16px 32px',
                  fontSize: 'clamp(14px, 1.2vw + 0.5rem, 16px)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 500,
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
                Create Your First Campaign
                <span style={{ fontSize: '18px', fontWeight: 300 }}>+</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12">
            {/* Create Campaign Button */}
            <div className="mb-8 flex justify-end">
              <button
                onClick={handleCreateCampaign}
                className="rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  padding: '12px 24px',
                  fontSize: 'clamp(14px, 1.2vw + 0.5rem, 16px)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 500,
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
                Create New Campaign
                <span style={{ fontSize: '18px', fontWeight: 300 }}>+</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns
                .filter((campaign) => campaign.ad_copy)
                .map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    title={campaign.ad_copy?.call_to_action || ""}
                    description={campaign.ad_copy?.body || 'No description available'}
                    imagePath={campaign.ad_copy?.image_url ? `${process.env.NEXT_PUBLIC_IMAGE_PREFIX_PATH}${campaign.ad_copy?.image_url}` : ''}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
