'use client';

import React from 'react';
import { Building2, Briefcase, Upload, X } from 'lucide-react';

interface Step1BusinessInfoProps {
  data: {
    businessName: string;
    logo: File | null;
    logoPreview: string | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    zip: string;
    industry: string;
  };
  onChange: (data: any) => void;
  errors: Record<string, string>;
}

export default function Step1BusinessInfo({ data, onChange, errors }: Step1BusinessInfoProps) {
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
      {/* Business Name, Industry (Left) and Logo (Right) - Two Column Layout */}
      <div className="onboarding-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Side: Business Name and Industry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Business Name */}
          <div>
            <label 
              htmlFor="businessName" 
              className="block mb-2"
              style={{
                fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                color: 'rgba(49, 49, 49, 0.8)',
              }}
            >
              Business Name
            </label>
            <div className="relative">
              <Building2 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
                style={{
                  width: '16px',
                  height: '16px',
                  color: errors.businessName 
                    ? 'rgba(239, 68, 68, 0.8)' 
                    : 'rgba(49, 49, 49, 0.5)',
                }}
              />
              <input
                id="businessName"
                type="text"
                value={data.businessName}
                onChange={(e) => onChange({ ...data, businessName: e.target.value })}
                className="w-full rounded-lg border-2 outline-none transition-all duration-300"
                style={{
                  padding: '12px 12px 12px 40px',
                  fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  backgroundColor: errors.businessName 
                    ? 'rgba(239, 68, 68, 0.05)' 
                    : 'rgba(237, 237, 237, 0.8)',
                  borderColor: errors.businessName 
                    ? 'rgba(239, 68, 68, 0.4)' 
                    : 'rgba(198, 124, 78, 0.2)',
                  color: 'rgba(49, 49, 49, 0.75)',
                }}
                placeholder="Enter your business name"
              />
            </div>
            {errors.businessName && (
              <p style={{
                marginTop: '4px',
                fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
                color: 'rgba(239, 68, 68, 0.85)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
              }}>{errors.businessName}</p>
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
        </div>

        {/* Right Side: Logo Upload */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                className="flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border-2 border-dashed relative mx-auto"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
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
                  <div 
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'rgba(198, 124, 78, 0.1)',
                    }}
                  >
                    <Upload style={{
                      width: '20px',
                      height: '20px',
                      color: 'rgba(198, 124, 78, 0.7)',
                    }} />
                  </div>
                </div>
              </label>
            </div>
          ) : (
            <div className="relative mx-auto" style={{ width: '120px', height: '120px' }}>
              <div 
                className="flex items-center justify-center rounded-full overflow-hidden p-2"
                style={{
                  width: '120px',
                  height: '120px',
                  border: '2px solid rgba(198, 124, 78, 0.2)',
                  backgroundColor: 'rgba(237, 237, 237, 0.6)',
                }}
              >
                <img
                  src={data.logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute top-0 right-0 rounded-full transition-colors"
                style={{
                  padding: '4px',
                  backgroundColor: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
                }}
                aria-label="Remove logo"
              >
                <X style={{ width: '12px', height: '12px' }} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Address Section */}
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
          Address
        </label>
        <div className="onboarding-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Address Line 1 - Left */}
          <div>
            <input
              type="text"
              placeholder="Address line 1"
              value={data.addressLine1}
              onChange={(e) => onChange({ ...data, addressLine1: e.target.value })}
              className="w-full rounded-lg border-2 outline-none transition-all duration-300"
              style={{
                padding: '12px 16px',
                fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                backgroundColor: errors.addressLine1 
                  ? 'rgba(239, 68, 68, 0.05)' 
                  : 'rgba(237, 237, 237, 0.8)',
                borderColor: errors.addressLine1 
                  ? 'rgba(239, 68, 68, 0.4)' 
                  : 'rgba(198, 124, 78, 0.2)',
                color: 'rgba(49, 49, 49, 0.75)',
              }}
            />
            {errors.addressLine1 && (
              <p style={{
                marginTop: '4px',
                fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
                color: 'rgba(239, 68, 68, 0.85)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
              }}>{errors.addressLine1}</p>
            )}
          </div>
          {/* Address Line 2 - Right */}
          <div>
            <input
              type="text"
              placeholder="Address line 2"
              value={data.addressLine2}
              onChange={(e) => onChange({ ...data, addressLine2: e.target.value })}
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
            />
          </div>
          {/* City */}
          <div>
            <input
              type="text"
              placeholder="City"
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              className="w-full rounded-lg border-2 outline-none transition-all duration-300"
              style={{
                padding: '12px 16px',
                fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                backgroundColor: errors.city 
                  ? 'rgba(239, 68, 68, 0.05)' 
                  : 'rgba(237, 237, 237, 0.8)',
                borderColor: errors.city 
                  ? 'rgba(239, 68, 68, 0.4)' 
                  : 'rgba(198, 124, 78, 0.2)',
                color: 'rgba(49, 49, 49, 0.75)',
              }}
            />
            {errors.city && (
              <p style={{
                marginTop: '4px',
                fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
                color: 'rgba(239, 68, 68, 0.85)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
              }}>{errors.city}</p>
            )}
          </div>
          {/* Zip */}
          <div>
            <input
              type="text"
              placeholder="Zip"
              value={data.zip}
              onChange={(e) => onChange({ ...data, zip: e.target.value })}
              className="w-full rounded-lg border-2 outline-none transition-all duration-300"
              style={{
                padding: '12px 16px',
                fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                backgroundColor: errors.zip 
                  ? 'rgba(239, 68, 68, 0.05)' 
                  : 'rgba(237, 237, 237, 0.8)',
                borderColor: errors.zip 
                  ? 'rgba(239, 68, 68, 0.4)' 
                  : 'rgba(198, 124, 78, 0.2)',
                color: 'rgba(49, 49, 49, 0.75)',
              }}
            />
            {errors.zip && (
              <p style={{
                marginTop: '4px',
                fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
                color: 'rgba(239, 68, 68, 0.85)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
              }}>{errors.zip}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
