'use client';

import React, { useState } from 'react';

interface ContentTypeProps {
  campaignBrief: string;
  setCampaignBrief: (brief: string) => void;
}

const ContentType: React.FC<ContentTypeProps> = ({ campaignBrief, setCampaignBrief }) => {
  const [objective, setObjective] = useState<string>('Awareness');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [adFormats, setAdFormats] = useState<string[]>([]);
  const [campaignBriefError, setCampaignBriefError] = useState<string | null>(null);

  const handleCampaignBriefChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCampaignBrief(e.target.value);
    if (campaignBriefError) {
      setCampaignBriefError(null);
    }
  };

  const handleObjectiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setObjective(e.target.value);
  };

  const handleTargetAudienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetAudience(e.target.value);
  };

  const handleAdFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setAdFormats((prev) => [...prev, value]);
    } else {
      setAdFormats((prev) => prev.filter((format) => format !== value));
    }
  };

  return (
    <div className="flex justify-center mt-5 h-full w-full">
      <div className="w-full max-w-2xl px-6 py-6">
        <div className="space-y-6">
          {/* Campaign Brief */}
          <div>
            <label htmlFor="campaign-brief" className="block" style={{
              fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              color: 'rgba(49, 49, 49, 0.8)',
            }}>
              Campaign Brief <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              id="campaign-brief"
              rows={3}
              value={campaignBrief}
              onChange={handleCampaignBriefChange}
              className="w-full rounded-lg border-2 outline-none transition-all duration-300"
              style={{
                padding: '12px 16px',
                fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                backgroundColor: campaignBriefError ? 'rgba(255, 0, 0, 0.05)' : 'rgba(237, 237, 237, 0.8)',
                borderColor: campaignBriefError ? 'rgba(255, 0, 0, 0.5)' : 'rgba(198, 124, 78, 0.2)',
                color: 'rgba(49, 49, 49, 0.75)',
              }}
              placeholder="e.g., Launching a new line of eco-friendly sneakers."
            />
            {campaignBriefError && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{campaignBriefError}</p>
            )}
          </div>

          {/* Objective */}
          <div>
            <label htmlFor="objective" className="block mb-2" style={{
              fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              color: 'rgba(49, 49, 49, 0.8)',
            }}>
              Objective
            </label>
            <div className="relative">
              <select
                id="objective"
                value={objective}
                onChange={handleObjectiveChange}
                className="w-full rounded-lg border-2 outline-none transition-all duration-300"
                style={{
                  padding: '12px 16px',
                  paddingRight: '40px',
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  backgroundColor: 'rgba(237, 237, 237, 0.8)',
                  borderColor: 'rgba(198, 124, 78, 0.2)',
                  color: 'rgba(49, 49, 49, 0.75)',
                  appearance: 'none',
                  cursor: 'pointer',
                }}
              >
                <option>Awareness</option>
                <option>Sales</option>
                <option>Launch</option>
              </select>
              <svg 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{
                  width: '16px',
                  height: '16px',
                  color: 'rgba(49, 49, 49, 0.5)',
                }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label htmlFor="target-audience" className="block mb-2" style={{
              fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              color: 'rgba(49, 49, 49, 0.8)',
            }}>
              Target Audience
            </label>
            <input
              type="text"
              id="target-audience"
              value={targetAudience}
              onChange={handleTargetAudienceChange}
              className="w-full rounded-lg border-2 outline-none transition-all duration-300"
              style={{
                padding: '12px 16px',
                fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                backgroundColor: 'rgba(237, 237, 237, 0.8)',
                borderColor: 'rgba(198, 124, 78, 0.2)',
                color: 'rgba(49, 49, 49, 0.75)',
              }}
              placeholder="e.g., Millennials aged 25-35, interested in sustainable fashion."
            />
          </div>

          {/* Ad Formats Needed */}
          <div>
            <label className="block mb-2" style={{
              fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              color: 'rgba(49, 49, 49, 0.8)',
            }}>
              Ad Formats Needed
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="instagram-post"
                  type="checkbox"
                  value="Instagram Post"
                  checked={adFormats.includes('Instagram Post')}
                  onChange={handleAdFormatChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="instagram-post" className="ml-3 text-sm text-gray-600" style={{
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.75)',
                }}>
                  Instagram Post
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="story"
                  type="checkbox"
                  value="Story"
                  checked={adFormats.includes('Story')}
                  onChange={handleAdFormatChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="story" className="ml-3 text-sm text-gray-600" style={{
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.75)',
                }}>
                  Story
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="poster"
                  type="checkbox"
                  value="Poster"
                  checked={adFormats.includes('Poster')}
                  onChange={handleAdFormatChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="poster" className="ml-3 text-sm text-gray-600" style={{
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.75)',
                }}>
                  Poster
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentType;
