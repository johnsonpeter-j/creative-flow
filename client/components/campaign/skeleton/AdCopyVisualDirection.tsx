'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { AdCopy, generateImageApi } from '@/api/campaign.api';

interface AdCopyVisualDirectionProps {
  adCopy: AdCopy | null;
  loading: boolean;
  campaignId: string;
  onImageGenerated?: (updatedAdCopy: AdCopy) => void;
}

const AdCopyVisualDirection: React.FC<AdCopyVisualDirectionProps> = ({ 
  adCopy, 
  loading, 
  campaignId,
  onImageGenerated 
}) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [currentAdCopy, setCurrentAdCopy] = useState<AdCopy | null>(adCopy);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const handleGenerateImage = async () => {
    if (!campaignId) {
      alert('Campaign ID is missing');
      return;
    }

    setImageLoading(true);
    try {
      const result = await generateImageApi(campaignId);
      setCurrentAdCopy(result.ad_copy);
      if (onImageGenerated) {
        onImageGenerated(result.ad_copy);
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      let errorMessage = 'Failed to generate image. ';
      if (error.response?.data?.detail) {
        errorMessage += error.response.data.detail;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again.';
      }
      alert(errorMessage);
    } finally {
      setImageLoading(false);
    }
  };

  const displayAdCopy = currentAdCopy || adCopy;
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center items-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[var(--color-frame)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Ad Copy & Visual Direction...</h2>
          <p className="text-gray-500">Our AI is creating compelling ad copy and visual direction for your campaign.</p>
          <p className="text-sm text-gray-400 mt-2">This may take up to 2 minutes...</p>
        </div>
      </div>
    );
  }

  if (!displayAdCopy) {
    return (
      <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Ad Copy Generated</h2>
          <p className="text-gray-500">Ad copy has not been generated yet. Please go back and select an idea.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col py-8">
      <div className="text-center mb-8">
        {/* <h2 className="text-3xl font-bold text-gray-800 mb-2">Ad Copy & Visual Direction</h2> */}
        <p className="text-gray-500">Here&apos;s the generated ad copy and visual direction for your campaign.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start flex-1">
        {/* Ad Copy */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ad Copy</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-800 mb-1">Headline:</p>
              <p className="text-base">{displayAdCopy.headline}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Body:</p>
              <p>{displayAdCopy.body}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Call to Action:</p>
              <p className="text-base font-medium text-[var(--color-frame)]">{displayAdCopy.call_to_action}</p>
            </div>
          </div>
        </div>

        {/* Visual Direction */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Visual Direction</h3>
          </div>
          {displayAdCopy?.image_url ? (
            <div className="space-y-4">
              <div 
                className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
                onClick={handleGenerateImage}
              >
                <img
                  src={displayAdCopy.image_url.startsWith('http') ? displayAdCopy.image_url : `http://localhost:8000${displayAdCopy.image_url}`}
                  alt="Generated ad poster"
                  className="w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: isImageHovered ? 0.5 : 1 }}
                />
                {isImageHovered && !imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                    <div className="flex flex-col items-center gap-2">
                      <div 
                        className="rounded-full p-3 transition-transform duration-300 shadow-lg"
                        style={{
                          backgroundColor: 'var(--color-frame)',
                          transform: 'scale(1)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <RefreshCw className="w-6 h-6 text-white" />
                      </div>
                      <span 
                        className="text-sm font-medium"
                        style={{ 
                          color: 'rgba(49, 49, 49, 0.95)',
                          textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
                        }}
                      >
                        Regenerate Image
                      </span>
                    </div>
                  </div>
                )}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 
                        className="w-8 h-8 animate-spin" 
                        style={{ color: 'var(--color-frame)' }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: 'rgba(49, 49, 49, 0.95)' }}
                      >
                        Generating...
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-800 mb-2">Visual Description:</p>
                <p className="text-sm text-gray-600">{displayAdCopy.visual_direction}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Click "Generate Image" to create</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-800 mb-2">Visual Description:</p>
                <p className="text-sm text-gray-600">{displayAdCopy.visual_direction}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdCopyVisualDirection;
