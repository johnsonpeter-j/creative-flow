'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

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
    // Step 2
    brandName: string;
    // Step 3
    logoPosition: string;
    typography: string;
    colorPalette: string[];
  };
}

export default function Step4Review({ data }: Step4ReviewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="text-center">
        <div 
          className="inline-flex items-center justify-center rounded-full mb-4"
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(198, 124, 78, 0.1)',
          }}
        >
          <CheckCircle2 
            style={{
              width: '32px',
              height: '32px',
              color: 'var(--color-frame)',
            }}
          />
        </div>
        <h2 
          style={{
            fontSize: 'clamp(20px, 2.5vw + 0.5rem, 24px)',
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 400,
            color: 'rgba(49, 49, 49, 0.95)',
            marginBottom: '8px',
          }}
        >
          Review Your Information
        </h2>
        <p 
          style={{
            fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            color: 'rgba(49, 49, 49, 0.6)',
          }}
        >
          Please review all the information before completing your setup.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Business Information */}
        <div>
          <h3 
            style={{
              fontSize: 'clamp(14px, 1.3vw + 0.5rem, 16px)',
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400,
              color: 'rgba(49, 49, 49, 0.9)',
              marginBottom: '12px',
            }}
          >
            Business Information
          </h3>
          <div 
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'rgba(237, 237, 237, 0.5)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.6)' }}>Business Name:</span>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.9)', fontWeight: 400 }}>{data.businessName || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.6)' }}>Industry:</span>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.9)', fontWeight: 400 }}>{data.industry || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.6)' }}>Address:</span>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.9)', fontWeight: 400 }}>
                  {data.addressLine1 || 'N/A'} {data.city ? `, ${data.city}` : ''} {data.zip ? `, ${data.zip}` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Details */}
        <div>
          <h3 
            style={{
              fontSize: 'clamp(14px, 1.3vw + 0.5rem, 16px)',
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400,
              color: 'rgba(49, 49, 49, 0.9)',
              marginBottom: '12px',
            }}
          >
            Brand Details
          </h3>
          <div 
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'rgba(237, 237, 237, 0.5)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.6)' }}>Brand Name:</span>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.9)', fontWeight: 400 }}>{data.brandName || 'N/A'}</span>
              </div>
              {data.logoPreview && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.6)' }}>Logo:</span>
                  <img src={data.logoPreview} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Design Preferences */}
        <div>
          <h3 
            style={{
              fontSize: 'clamp(14px, 1.3vw + 0.5rem, 16px)',
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400,
              color: 'rgba(49, 49, 49, 0.9)',
              marginBottom: '12px',
            }}
          >
            Design Preferences
          </h3>
          <div 
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'rgba(237, 237, 237, 0.5)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.6)' }}>Logo Position:</span>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.9)', fontWeight: 400 }}>{data.logoPosition || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.6)' }}>Typography:</span>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.9)', fontWeight: 400 }}>
                  {data.typography ? 'Configured' : 'N/A'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)', color: 'rgba(49, 49, 49, 0.6)' }}>Color Palette:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {data.colorPalette.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        backgroundColor: color,
                        border: '1px solid rgba(49, 49, 49, 0.1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
