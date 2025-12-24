'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { AdCopy, generateImageApi } from '@/api/campaign.api';

interface AdCopyVisualDirectionProps {
  adCopy: AdCopy | null;
  loading: boolean;
  campaignId: string;
  onImageGenerated?: (updatedAdCopy: AdCopy) => void;
  onBakeTextChange?: (bakeText: boolean) => void;
}

const AdCopyVisualDirection: React.FC<AdCopyVisualDirectionProps> = ({ 
  adCopy, 
  loading, 
  campaignId,
  onImageGenerated,
  onBakeTextChange
}) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [currentAdCopy, setCurrentAdCopy] = useState<AdCopy | null>(adCopy);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [bakeTextWithAI, setBakeTextWithAI] = useState(false);

  const handleGenerateImage = async () => {
    if (!campaignId) {
      alert('Campaign ID is missing');
      return;
    }

    setImageLoading(true);
    try {
      const result = await generateImageApi(campaignId, bakeTextWithAI);
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
    <div className="w-full max-w-5xl mx-auto flex flex-col py-4">
      <div className="text-center mb-6">
        <p className="text-gray-500">Here&apos;s the generated ad copy and visual direction for your campaign.</p>
      </div>
      
      {/* Unified Container */}
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100" style={{ height: 'calc(60vh - 100px)' }}>
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200" style={{ height: '100%' }}>
          {/* Ad Copy Section */}
          <div className="flex flex-col overflow-hidden" style={{ height: '100%', maxHeight: '100%' }}>
            <div className="flex-shrink-0 p-6 md:p-8 md:pr-10 pb-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-2">
                <div 
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: 'var(--color-frame)' }}
                />
                <h3 className="text-xl font-bold text-gray-900">Ad Copy</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 md:pr-10 pt-4" style={{ minHeight: 0 }}>
              <div className="space-y-4 md:space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Headline</p>
                <p className="text-lg text-gray-900 leading-relaxed">{displayAdCopy.headline}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Body</p>
                <p className="text-base text-gray-700 leading-relaxed">{displayAdCopy.body}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Call to Action</p>
                <p 
                  className="text-lg font-semibold"
                  style={{ color: 'var(--color-frame)' }}
                >
                  {displayAdCopy.call_to_action}
                </p>
              </div>
              </div>
            </div>
          </div>

          {/* Visual Direction Section */}
          <div className="flex flex-col overflow-hidden" style={{ height: '100%', maxHeight: '100%' }}>
            <div className="flex-shrink-0 p-6 md:p-8 md:pl-10 pb-4 border-b md:border-b-0 border-gray-200">
              <div className="flex items-center gap-2">
                <div 
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: 'var(--color-frame)' }}
                />
                <h3 className="text-xl font-bold text-gray-900">Visual Direction</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 md:pl-10 pt-4" style={{ minHeight: 0 }}>
              <div className="space-y-4 md:space-y-6">
                {/* Bake Text with AI Checkbox */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bakeTextWithAI}
                      onChange={(e) => {
                        setBakeTextWithAI(e.target.checked);
                        if (onBakeTextChange) {
                          onBakeTextChange(e.target.checked);
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-300"
                      style={{ accentColor: 'var(--color-frame)' }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Bake text with AI</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {bakeTextWithAI 
                          ? 'Image will be generated with text baked in. Design Your Ad step will be skipped.'
                          : 'Image will be generated without text. You can edit text in Design Your Ad step.'}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Generate Image Button */}
                {!displayAdCopy?.image_url && (
                  <button
                    onClick={handleGenerateImage}
                    disabled={imageLoading}
                    className="w-full rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      padding: '14px',
                      fontSize: 'clamp(13px, 1.1vw + 0.5rem, 14px)',
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontWeight: 400,
                      backgroundColor: 'var(--color-frame)',
                      color: 'rgba(237, 237, 237, 0.95)',
                      boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
                      opacity: imageLoading ? 0.7 : 1,
                      cursor: imageLoading ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!imageLoading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(198, 124, 78, 0.35)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(198, 124, 78, 0.25)';
                    }}
                  >
                    {imageLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5" />
                        Generate Image
                      </>
                    )}
                  </button>
                )}

                {/* Show image only if generated and checkbox is checked (baked text) */}
                {displayAdCopy?.image_url && bakeTextWithAI && (
                  <div className="space-y-4 md:space-y-6">
                    <div 
                      className="w-full bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer shadow-inner"
                      style={{ aspectRatio: '16/9' }}
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
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 
                              className="w-8 h-8 animate-spin" 
                              style={{ color: 'var(--color-frame)' }}
                            />
                            <span 
                              className="text-sm font-semibold"
                              style={{ color: 'rgba(49, 49, 49, 0.95)' }}
                            >
                              Generating...
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Visual Description */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Visual Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{displayAdCopy.visual_direction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCopyVisualDirection;
