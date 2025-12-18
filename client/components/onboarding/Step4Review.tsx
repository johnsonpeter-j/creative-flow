'use client';

import React from 'react';
import { Building2, Palette, Type, MapPin, Briefcase, Layout } from 'lucide-react';

interface Step4ReviewProps {
  data: {
    // Step 1
    businessName: string;
    logoPreview: string | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    zip: string;
    industry: string;
    // Step 2 (formerly Step 3)
    logoPosition: string;
    fontType: 'dropdown' | 'google' | 'upload';
    fontValue: string;
    fontFile: File | null;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
  };
}

const hasValue = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim() !== '';
};

export default function Step4Review({ data }: Step4ReviewProps) {
  const hasBusinessInfo = hasValue(data.businessName) || hasValue(data.industry) || data.logoPreview || 
                          hasValue(data.addressLine1) || hasValue(data.city) || hasValue(data.zip);
  
  const hasDesignInfo = hasValue(data.logoPosition) || hasValue(data.fontValue) || data.fontFile ||
                        (data.colors.primary !== '#6366f1' || data.colors.secondary !== '#8b5cf6' || 
                         data.colors.background !== '#ffffff' || data.colors.text !== '#111827');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* Business Information */}
      {hasBusinessInfo && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 style={{ width: '16px', height: '16px', color: 'rgba(49, 49, 49, 0.5)' }} />
            <h3 
              style={{
                fontSize: 'clamp(14px, 1.3vw + 0.5rem, 16px)',
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400,
                color: 'rgba(49, 49, 49, 0.9)',
                margin: 0,
              }}
            >
              Business Information
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.logoPreview && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.6)',
                  minWidth: '120px',
                }}>Logo:</span>
                <img 
                  src={data.logoPreview} 
                  alt="Logo" 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }} 
                />
              </div>
            )}

            {hasValue(data.businessName) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.6)',
                  minWidth: '120px',
                }}>Business Name:</span>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.9)',
                }}>
                  {data.businessName}
                </span>
              </div>
            )}

            {hasValue(data.industry) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.6)',
                  minWidth: '120px',
                }}>Industry:</span>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.9)',
                }}>
                  {data.industry}
                </span>
              </div>
            )}

            {(hasValue(data.addressLine1) || hasValue(data.city) || hasValue(data.zip)) && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.6)',
                  minWidth: '120px',
                }}>Address:</span>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.9)',
                }}>
                  {[data.addressLine1, data.addressLine2, data.city, data.zip]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Design Preferences */}
      {hasDesignInfo && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette style={{ width: '16px', height: '16px', color: 'rgba(49, 49, 49, 0.5)' }} />
            <h3 
              style={{
                fontSize: 'clamp(14px, 1.3vw + 0.5rem, 16px)',
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400,
                color: 'rgba(49, 49, 49, 0.9)',
                margin: 0,
              }}
            >
              Design Preferences
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(hasValue(data.fontValue) || data.fontFile) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.6)',
                  minWidth: '120px',
                }}>Typography:</span>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: data.fontType === 'dropdown' && data.fontValue ? `"${data.fontValue}", sans-serif` : 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.9)',
                }}>
                  {data.fontType === 'dropdown' ? data.fontValue : 
                   data.fontType === 'google' ? 'Google Fonts' : 
                   data.fontFile ? data.fontFile.name : ''}
                </span>
              </div>
            )}

            {hasValue(data.logoPosition) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.6)',
                  minWidth: '120px',
                }}>Logo Position:</span>
                <span style={{ 
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.9)',
                }}>
                  {data.logoPosition}
                </span>
              </div>
            )}

            {/* Color Palette - Small Round Containers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ 
                fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', 
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                color: 'rgba(49, 49, 49, 0.6)',
                minWidth: '120px',
              }}>Color Palette:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { key: 'primary', label: 'Primary' },
                  { key: 'secondary', label: 'Secondary' },
                  { key: 'background', label: 'Background' },
                  { key: 'text', label: 'Text' },
                ].map(({ key, label }) => {
                  const color = data.colors[key as keyof typeof data.colors];
                  return (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: '1px solid rgba(49, 49, 49, 0.15)',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ 
                        fontSize: 'clamp(11px, 0.95vw + 0.5rem, 12px)', 
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontWeight: 400,
                        color: 'rgba(49, 49, 49, 0.7)',
                      }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasBusinessInfo && !hasDesignInfo && (
        <div
          style={{
            padding: '32px 24px',
            textAlign: 'center',
            borderRadius: '8px',
            backgroundColor: 'rgba(237, 237, 237, 0.3)',
            border: '1px dashed rgba(198, 124, 78, 0.2)',
          }}
        >
          <p style={{
            fontSize: 'clamp(13px, 1.1vw + 0.5rem, 15px)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            color: 'rgba(49, 49, 49, 0.6)',
          }}>
            No information provided yet. You can go back to add details or proceed with default settings.
          </p>
        </div>
      )}
    </div>
  );
}
