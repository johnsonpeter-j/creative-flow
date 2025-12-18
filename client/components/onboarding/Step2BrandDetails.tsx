'use client';

import React, { useState } from 'react';
import { Building2, Briefcase, Upload, X } from 'lucide-react';

interface Step2BrandDetailsProps {
  data: {
    brandName: string;
    industry: string;
    logo: File | null;
    logoPreview: string | null;
  };
  onChange: (data: any) => void;
  errors: Record<string, string>;
}

export default function Step2BrandDetails({ data, onChange, errors }: Step2BrandDetailsProps) {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      onChange({ ...data, logo: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, logo: file, logoPreview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    onChange({ ...data, logo: null, logoPreview: null });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Brand Name */}
      <div>
        <label 
          htmlFor="brandName" 
          className="block mb-2"
          style={{
            fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            color: 'rgba(49, 49, 49, 0.8)',
          }}
        >
          Brand Name
        </label>
        <div className="relative">
          <Building2 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
            style={{
              width: '16px',
              height: '16px',
              color: errors.brandName 
                ? 'rgba(239, 68, 68, 0.8)' 
                : 'rgba(49, 49, 49, 0.5)',
            }}
          />
          <input
            id="brandName"
            type="text"
            value={data.brandName}
            onChange={(e) => onChange({ ...data, brandName: e.target.value })}
            className="w-full rounded-lg border-2 outline-none transition-all duration-300"
            style={{
              padding: '12px 12px 12px 40px',
              fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              backgroundColor: errors.brandName 
                ? 'rgba(239, 68, 68, 0.05)' 
                : 'rgba(237, 237, 237, 0.8)',
              borderColor: errors.brandName 
                ? 'rgba(239, 68, 68, 0.4)' 
                : 'rgba(198, 124, 78, 0.2)',
              color: 'rgba(49, 49, 49, 0.75)',
            }}
            placeholder="Enter your brand name"
          />
        </div>
        {errors.brandName && (
          <p style={{
            marginTop: '4px',
            fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
            color: 'rgba(239, 68, 68, 0.85)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
          }}>{errors.brandName}</p>
        )}
      </div>

      {/* Industry */}
      <div>
        <label 
          htmlFor="industry" 
          className="block mb-2"
          style={{
            fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            color: 'rgba(49, 49, 49, 0.8)',
          }}
        >
          Industry
        </label>
        <div className="relative">
          <Briefcase 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
            style={{
              width: '16px',
              height: '16px',
              color: errors.industry 
                ? 'rgba(239, 68, 68, 0.8)' 
                : 'rgba(49, 49, 49, 0.5)',
            }}
          />
          <input
            id="industry"
            type="text"
            value={data.industry}
            onChange={(e) => onChange({ ...data, industry: e.target.value })}
            className="w-full rounded-lg border-2 outline-none transition-all duration-300"
            style={{
              padding: '12px 12px 12px 40px',
              fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              backgroundColor: errors.industry 
                ? 'rgba(239, 68, 68, 0.05)' 
                : 'rgba(237, 237, 237, 0.8)',
              borderColor: errors.industry 
                ? 'rgba(239, 68, 68, 0.4)' 
                : 'rgba(198, 124, 78, 0.2)',
              color: 'rgba(49, 49, 49, 0.75)',
            }}
            placeholder="e.g., Technology, Fashion, Food & Beverage"
          />
        </div>
        {errors.industry && (
          <p style={{
            marginTop: '4px',
            fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
            color: 'rgba(239, 68, 68, 0.85)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
          }}>{errors.industry}</p>
        )}
      </div>

      {/* Logo Upload */}
      <div>
        <label 
          className="block mb-2"
          style={{
            fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            color: 'rgba(49, 49, 49, 0.8)',
          }}
        >
          Logo
        </label>
        {!data.logoPreview ? (
          <div className="relative">
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <label
              htmlFor="logo"
              className="flex flex-col items-center justify-center w-full cursor-pointer transition-all duration-200 rounded-lg border-2 border-dashed"
              style={{
                height: '120px',
                backgroundColor: 'rgba(237, 237, 237, 0.6)',
                borderColor: 'rgba(198, 124, 78, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(237, 237, 237, 0.8)';
                e.currentTarget.style.borderColor = 'var(--color-frame)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(237, 237, 237, 0.6)';
                e.currentTarget.style.borderColor = 'rgba(198, 124, 78, 0.3)';
              }}
            >
              <div className="flex flex-col items-center justify-center">
                <Upload style={{
                  width: '24px',
                  height: '24px',
                  marginBottom: '8px',
                  color: 'rgba(49, 49, 49, 0.5)',
                }} />
                <p style={{
                  marginBottom: '4px',
                  fontSize: 'clamp(11px, 0.95vw + 0.5rem, 12px)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  color: 'rgba(49, 49, 49, 0.6)',
                }}>
                  <span style={{ fontWeight: 400 }}>Click to upload</span> or drag and drop
                </p>
                <p style={{
                  fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  color: 'rgba(49, 49, 49, 0.5)',
                }}>PNG, JPG, SVG (MAX. 5MB)</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="relative">
            <div 
              className="flex items-center justify-center w-full rounded-lg p-4"
              style={{
                height: '120px',
                border: '2px solid rgba(198, 124, 78, 0.2)',
                backgroundColor: 'rgba(237, 237, 237, 0.6)',
              }}
            >
              <img
                src={data.logoPreview}
                alt="Logo preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="absolute top-2 right-2 rounded-full transition-colors"
              style={{
                padding: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
              }}
              aria-label="Remove logo"
            >
              <X style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
