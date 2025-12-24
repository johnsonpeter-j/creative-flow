'use client';

import React, { useMemo } from 'react';
import { Download } from 'lucide-react';
import { AdCopy } from '@/api/campaign.api';

interface AdPreviewProps {
  adCopy: AdCopy | null;
  editedImageDataURL?: string | null;
}

const AdPreview: React.FC<AdPreviewProps> = ({ adCopy, editedImageDataURL }) => {
  // Use edited image if available, otherwise use original
  const imageUrl = useMemo(() => {
    // Priority: edited image > original image
    if (editedImageDataURL) {
      return editedImageDataURL;
    }
    if (!adCopy?.image_url) return null;
    return adCopy.image_url.startsWith('http')
      ? adCopy.image_url
      : `http://localhost:8000${adCopy.image_url}`;
  }, [adCopy?.image_url, editedImageDataURL]);

  const handleDownload = async () => {
    if (!adCopy || !imageUrl) {
      alert('No image or ad copy available to download');
      return;
    }

    try {
      // Create a canvas to combine image and text
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        alert('Failed to create canvas');
        return;
      }

      // Load the image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Get text layers
      const textLayers = adCopy.text_layers || [];
      
      // If no text layers, create default ones
      const layersToRender = textLayers.length > 0 ? textLayers : [
        { text: adCopy.headline, type: 'headline', top: 10, left: 50, fontSize: 36, fill: '#1a1a1a', fontFamily: 'Impact', fontWeight: 'bold', fontStyle: 'normal', textAlign: 'center' },
        ...(adCopy.body ? [{ text: adCopy.body, type: 'body', top: 50, left: 50, fontSize: 18, fill: '#333333', fontFamily: 'Inter', fontWeight: 'normal', fontStyle: 'normal', textAlign: 'center' }] : []),
        { text: adCopy.call_to_action, type: 'cta', top: 90, left: 50, fontSize: 26, fill: '#FFFFFF', fontFamily: 'Arial', fontWeight: 'bold', fontStyle: 'normal', textAlign: 'center' },
      ];

      // Draw text layers on the canvas
      layersToRender.forEach((layer) => {
        const fontSize = (layer.fontSize || 32) * (canvas.width / 800); // Scale font size
        const fontFamily = layer.fontFamily || 'Arial';
        const fontWeight = layer.fontWeight === 'bold' ? 'bold' : 'normal';
        const fontStyle = layer.fontStyle === 'italic' ? 'italic' : 'normal';
        const fill = layer.fill || '#000000';
        const textAlign = layer.textAlign || 'center';
        
        // Set font
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fill;
        ctx.textAlign = textAlign as CanvasTextAlign;
        ctx.textBaseline = 'top';

        // Calculate position
        const x = (layer.left / 100) * canvas.width;
        const y = (layer.top / 100) * canvas.height;

        // Add text shadow for readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Handle text wrapping for long text
        const maxWidth = canvas.width * 0.85;
        const words = layer.text.split(' ');
        let line = '';
        let lineY = y;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x, lineY);
            line = words[i] + ' ';
            lineY += fontSize * 1.2;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, lineY);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to generate image');
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `creative-flow-ad-${Date.now()}.jpg`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.95);

    } catch (error) {
      console.error('Error downloading ad:', error);
      alert('Failed to download ad. Please try again.');
    }
  };

  if (!adCopy) {
    return (
      <div className="w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
        <p className="text-gray-500">No ad copy available. Please go back and generate ad copy first.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col py-8" style={{ minHeight: 'auto' }}>

      
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Image Preview - Clean image without text */}
        <div className="w-full lg:w-1/2 flex-shrink-0">
          <div className="bg-white shadow-2xl rounded-2xl p-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Ad Visual"
                className="w-full h-auto object-contain"
                style={{ 
                  display: 'block',
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            ) : (
              <div className="w-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center" style={{ minHeight: '400px' }}>
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
        </div>

        {/* Text Content - Separate section */}
        <div className="w-full lg:w-1/2 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Headline */}
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Headline
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                {adCopy.headline}
              </h3>
            </div>

            {/* Body */}
            {adCopy.body && (
              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Body Copy
                </div>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  {adCopy.body}
                </p>
              </div>
            )}

            {/* CTA */}
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Call to Action
              </div>
              <div className="inline-block">
                <span className="text-lg lg:text-xl font-bold text-[var(--color-frame)] px-4 py-2 border-2 border-[var(--color-frame)] rounded-lg">
                  {adCopy.call_to_action}
                </span>
              </div>
            </div>

            {/* Visual Direction (optional info) */}
            {adCopy.visual_direction && (
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Visual Direction
                </div>
                <p className="text-sm text-gray-600 italic">
                  {adCopy.visual_direction}
                </p>
              </div>
            )}
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="w-full rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2"
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
            <Download className="w-5 h-5 mr-2" />
            Download Ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdPreview;
