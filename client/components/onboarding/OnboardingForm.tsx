'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Building2, Briefcase, Image, Layout, Type, Palette, Upload, X, ChevronDown } from 'lucide-react';
import { LOGO_POSITIONS } from '@/lib/constants';

interface OnboardingFormProps {
  onSubmit: (data: {
    brandName: string;
    industry: string;
    logo: File | null;
    logoPosition: string;
    typography: string;
    colorPalette: string[];
  }) => void;
}

export default function OnboardingForm({ onSubmit }: OnboardingFormProps) {
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState<string>('Top Left');
  const [isLogoPositionOpen, setIsLogoPositionOpen] = useState(false);
  const [typography, setTypography] = useState('');
  const [colorPalette, setColorPalette] = useState<string[]>(['#6366f1', '#8b5cf6', '#ec4899']);
  const [isFocused, setIsFocused] = useState({
    brandName: false,
    industry: false,
    typography: false,
  });
  const logoPositionRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState({
    brandName: '',
    industry: '',
    logo: '',
    logoPosition: '',
    typography: '',
    colorPalette: '',
  });

  const validateBrandName = (name: string): string => {
    if (!name.trim()) {
      return 'Brand name is required';
    }
    if (name.trim().length < 2) {
      return 'Brand name must be at least 2 characters';
    }
    return '';
  };

  const validateIndustry = (industry: string): string => {
    if (!industry.trim()) {
      return 'Industry is required';
    }
    return '';
  };

  const validateTypography = (typography: string): string => {
    if (!typography.trim()) {
      return 'Typography is required';
    }
    // Basic validation for Google Fonts link format
    if (!typography.includes('fonts.googleapis.com') && !typography.includes('@import')) {
      return 'Please provide a valid Google Fonts embedded code';
    }
    return '';
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, logo: 'Please upload an image file' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, logo: 'Image size must be less than 5MB' });
        return;
      }
      setLogo(file);
      setErrors({ ...errors, logo: '' });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    setErrors({ ...errors, logo: '' });
  };

  const handleColorChange = (index: number, color: string) => {
    const newPalette = [...colorPalette];
    newPalette[index] = color;
    setColorPalette(newPalette);
  };

  const handleAddColor = () => {
    if (colorPalette.length < 6) {
      setColorPalette([...colorPalette, '#000000']);
    }
  };

  const handleRemoveColor = (index: number) => {
    if (colorPalette.length > 1) {
      const newPalette = colorPalette.filter((_, i) => i !== index);
      setColorPalette(newPalette);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoPositionRef.current && !logoPositionRef.current.contains(event.target as Node)) {
        setIsLogoPositionOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoPositionSelect = (position: string) => {
    setLogoPosition(position);
    setIsLogoPositionOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const brandNameError = validateBrandName(brandName);
    const industryError = validateIndustry(industry);
    const typographyError = validateTypography(typography);
    
    if (brandNameError || industryError || typographyError) {
      setErrors({
        brandName: brandNameError,
        industry: industryError,
        logo: '',
        logoPosition: '',
        typography: typographyError,
        colorPalette: '',
      });
      return;
    }
    
    setErrors({
      brandName: '',
      industry: '',
      logo: '',
      logoPosition: '',
      typography: '',
      colorPalette: '',
    });
    
    onSubmit({
      brandName: brandName.trim(),
      industry: industry.trim(),
      logo,
      logoPosition,
      typography: typography.trim(),
      colorPalette,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Business Details - Two Column Layout */}
      <div className="onboarding-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Business Address Dropdown */}
        <div>
          <label 
            htmlFor="businessAddress" 
            className="block mb-2"
            style={{
              fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              color: 'rgba(49, 49, 49, 0.8)',
            }}
          >
            Business address
          </label>
          <div className="relative">
            <select
              id="businessAddress"
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
              <option value="">Registered business address</option>
              <option value="registered">Registered business address</option>
              <option value="operating">Operating business address</option>
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{
                width: '16px',
                height: '16px',
                color: 'rgba(49, 49, 49, 0.5)',
              }}
            />
          </div>
        </div>

        {/* Type of Business Dropdown */}
        <div>
          <label 
            htmlFor="businessType" 
            className="block mb-2"
            style={{
              fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              color: 'rgba(49, 49, 49, 0.8)',
            }}
          >
            Type
          </label>
          <div className="relative">
            <select
              id="businessType"
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
              <option value="">Type of business</option>
              <option value="sole">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{
                width: '16px',
                height: '16px',
                color: 'rgba(49, 49, 49, 0.5)',
              }}
            />
          </div>
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
          {/* Address Line 1 - Right */}
          <div>
            <input
              type="text"
              placeholder="Address line 1"
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
          {/* Zip */}
          <div>
            <input
              type="text"
              placeholder="Zip"
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
        </div>
      </div>

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
        <div className="relative group">
          <Building2 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors"
            style={{
              width: '16px',
              height: '16px',
              color: errors.brandName 
                ? 'rgba(239, 68, 68, 0.8)' 
                : isFocused.brandName 
                  ? 'rgba(198, 124, 78, 0.8)' 
                  : 'rgba(49, 49, 49, 0.5)',
            }}
          />
          <input
            id="brandName"
            type="text"
            value={brandName}
            onChange={(e) => {
              setBrandName(e.target.value);
              if (errors.brandName) {
                setErrors({ ...errors, brandName: '' });
              }
            }}
            onFocus={() => setIsFocused({ ...isFocused, brandName: true })}
            onBlur={() => setIsFocused({ ...isFocused, brandName: false })}
            className="w-full pl-11 pr-4 rounded-lg border-2 outline-none transition-all duration-300"
            style={{
              padding: '12px',
              fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              backgroundColor: errors.brandName 
                ? 'rgba(239, 68, 68, 0.05)' 
                : 'rgba(237, 237, 237, 0.8)',
              borderColor: errors.brandName 
                ? 'rgba(239, 68, 68, 0.4)' 
                : isFocused.brandName 
                  ? 'var(--color-frame)' 
                  : 'transparent',
              color: 'rgba(49, 49, 49, 0.75)',
              boxShadow: isFocused.brandName && !errors.brandName 
                ? '0 4px 20px rgba(198, 124, 78, 0.15)' 
                : 'none',
            }}
            placeholder="Enter your brand name"
          />
        </div>
        <div style={{ minHeight: '20px', marginTop: '4px' }}>
          {errors.brandName && (
            <p style={{
              fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
              color: 'rgba(239, 68, 68, 0.85)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
            }}>{errors.brandName}</p>
          )}
        </div>
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
        <div className="relative group">
          <Briefcase 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors"
            style={{
              width: '16px',
              height: '16px',
              color: errors.industry 
                ? 'rgba(239, 68, 68, 0.8)' 
                : isFocused.industry 
                  ? 'rgba(198, 124, 78, 0.8)' 
                  : 'rgba(49, 49, 49, 0.5)',
            }}
          />
          <input
            id="industry"
            type="text"
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
              if (errors.industry) {
                setErrors({ ...errors, industry: '' });
              }
            }}
            onFocus={() => setIsFocused({ ...isFocused, industry: true })}
            onBlur={() => setIsFocused({ ...isFocused, industry: false })}
            className="w-full pl-11 pr-4 rounded-lg border-2 outline-none transition-all duration-300"
            style={{
              padding: '12px',
              fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              backgroundColor: errors.industry 
                ? 'rgba(239, 68, 68, 0.05)' 
                : 'rgba(237, 237, 237, 0.8)',
              borderColor: errors.industry 
                ? 'rgba(239, 68, 68, 0.4)' 
                : isFocused.industry 
                  ? 'var(--color-frame)' 
                  : 'transparent',
              color: 'rgba(49, 49, 49, 0.75)',
              boxShadow: isFocused.industry && !errors.industry 
                ? '0 4px 20px rgba(198, 124, 78, 0.15)' 
                : 'none',
            }}
            placeholder="e.g., Technology, Fashion, Food & Beverage"
          />
        </div>
        <div style={{ minHeight: '20px', marginTop: '4px' }}>
          {errors.industry && (
            <p style={{
              fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
              color: 'rgba(239, 68, 68, 0.85)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
            }}>{errors.industry}</p>
          )}
        </div>
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
        {!logoPreview ? (
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
              className="flex flex-col items-center justify-center w-full cursor-pointer transition-all duration-200 rounded-lg border-2 border-dashed group"
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
                src={logoPreview}
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
        <div style={{ minHeight: '20px', marginTop: '4px' }}>
          {errors.logo && (
            <p style={{
              fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
              color: 'rgba(239, 68, 68, 0.85)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
            }}>{errors.logo}</p>
          )}
        </div>
      </div>

      {/* Logo Position */}
      <div>
        <label 
          htmlFor="logoPosition" 
          className="block mb-2"
          style={{
            fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            color: 'rgba(49, 49, 49, 0.8)',
          }}
        >
          Logo Position
        </label>
        <div className="relative" ref={logoPositionRef}>
          <button
            type="button"
            id="logoPosition"
            onClick={() => setIsLogoPositionOpen(!isLogoPositionOpen)}
            className="w-full pl-11 pr-10 rounded-lg border-2 outline-none transition-all duration-200 text-left cursor-pointer relative"
            style={{
              padding: '12px',
              fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              backgroundColor: isLogoPositionOpen 
                ? 'rgba(237, 237, 237, 0.95)' 
                : 'rgba(237, 237, 237, 0.8)',
              borderColor: isLogoPositionOpen 
                ? 'var(--color-frame)' 
                : 'transparent',
              color: 'rgba(49, 49, 49, 0.75)',
              boxShadow: isLogoPositionOpen 
                ? '0 4px 20px rgba(198, 124, 78, 0.15)' 
                : 'none',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layout 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  style={{
                    width: '16px',
                    height: '16px',
                    color: 'rgba(49, 49, 49, 0.5)',
                  }}
                />
                <span className="pl-6">{logoPosition}</span>
              </span>
              <ChevronDown 
                className="transition-transform duration-200"
                style={{
                  width: '16px',
                  height: '16px',
                  color: 'rgba(49, 49, 49, 0.5)',
                  transform: isLogoPositionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </div>
          </button>
          
          {isLogoPositionOpen && (
            <div 
              className="absolute z-50 w-full mt-2 rounded-lg overflow-hidden"
              style={{
                backgroundColor: 'rgba(237, 237, 237, 0.98)',
                border: '2px solid rgba(198, 124, 78, 0.2)',
                boxShadow: '0 8px 32px rgba(49, 49, 49, 0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ padding: '4px 0' }}>
                {LOGO_POSITIONS.map((position) => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => handleLogoPositionSelect(position)}
                    className="w-full text-left transition-all duration-150 flex items-center gap-2"
                    style={{
                      padding: '10px 16px',
                      fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontWeight: 400,
                      backgroundColor: logoPosition === position
                        ? 'rgba(198, 124, 78, 0.1)'
                        : 'transparent',
                      color: logoPosition === position
                        ? 'rgba(198, 124, 78, 0.9)'
                        : 'rgba(49, 49, 49, 0.75)',
                    }}
                    onMouseEnter={(e) => {
                      if (logoPosition !== position) {
                        e.currentTarget.style.backgroundColor = 'rgba(198, 124, 78, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (logoPosition !== position) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: logoPosition === position 
                        ? 'var(--color-frame)' 
                        : 'transparent',
                    }} />
                    <span>{position}</span>
                    {logoPosition === position && (
                      <svg 
                        className="ml-auto" 
                        style={{
                          width: '16px',
                          height: '16px',
                          color: 'var(--color-frame)',
                        }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
        </div>
        <div className="min-h-[20px] mt-1">
          
        </div>
      </div>

      {/* Typography */}
      <div>
        <label 
          htmlFor="typography" 
          className="block mb-2"
          style={{
            fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            color: 'rgba(49, 49, 49, 0.8)',
          }}
        >
          Typography (Google Fonts Embedded Code)
        </label>
        <div className="relative group">
          <Type 
            className="absolute left-3 top-3 transition-colors"
            style={{
              width: '16px',
              height: '16px',
              color: errors.typography 
                ? 'rgba(239, 68, 68, 0.8)' 
                : isFocused.typography 
                  ? 'rgba(198, 124, 78, 0.8)' 
                  : 'rgba(49, 49, 49, 0.5)',
            }}
          />
          <textarea
            id="typography"
            value={typography}
            onChange={(e) => {
              setTypography(e.target.value);
              if (errors.typography) {
                setErrors({ ...errors, typography: '' });
              }
            }}
            onFocus={() => setIsFocused({ ...isFocused, typography: true })}
            onBlur={() => setIsFocused({ ...isFocused, typography: false })}
            rows={3}
            className="w-full pl-11 pr-4 rounded-lg border-2 outline-none transition-all duration-300 resize-none"
            style={{
              padding: '12px',
              fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              backgroundColor: errors.typography 
                ? 'rgba(239, 68, 68, 0.05)' 
                : 'rgba(237, 237, 237, 0.8)',
              borderColor: errors.typography 
                ? 'rgba(239, 68, 68, 0.4)' 
                : isFocused.typography 
                  ? 'var(--color-frame)' 
                  : 'transparent',
              color: 'rgba(49, 49, 49, 0.75)',
              boxShadow: isFocused.typography && !errors.typography 
                ? '0 4px 20px rgba(198, 124, 78, 0.15)' 
                : 'none',
            }}
            placeholder='e.g., &lt;link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"&gt;'
          />
        </div>
        <div style={{ minHeight: '20px', marginTop: '4px' }}>
          {errors.typography && (
            <p style={{
              fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
              color: 'rgba(239, 68, 68, 0.85)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
            }}>{errors.typography}</p>
          )}
          <p style={{
            marginTop: '4px',
            fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
            fontFamily: 'var(--font-inter), sans-serif',
            color: 'rgba(49, 49, 49, 0.5)',
          }}>
            Paste the Google Fonts link 
          </p>
        </div>
      </div>

      {/* Color Palette */}
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
          Color Palette
        </label>
        <div className="flex flex-wrap gap-3 items-center">
          {colorPalette.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="rounded-lg cursor-pointer"
                  style={{
                    width: '48px',
                    height: '48px',
                    border: '2px solid rgba(198, 124, 78, 0.2)',
                  }}
                />
                {colorPalette.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="absolute rounded-full transition-colors"
                    style={{
                      top: '-6px',
                      right: '-6px',
                      padding: '4px',
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
                    }}
                    aria-label="Remove color"
                  >
                    <X style={{ width: '12px', height: '12px' }} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {colorPalette.length < 6 && (
            <button
              type="button"
              onClick={handleAddColor}
              className="rounded-lg border-2 border-dashed flex items-center justify-center transition-colors"
              style={{
                width: '48px',
                height: '48px',
                borderColor: 'rgba(198, 124, 78, 0.3)',
                color: 'rgba(49, 49, 49, 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-frame)';
                e.currentTarget.style.color = 'var(--color-frame)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(198, 124, 78, 0.3)';
                e.currentTarget.style.color = 'rgba(49, 49, 49, 0.5)';
              }}
              aria-label="Add color"
            >
              <Palette style={{ width: '20px', height: '20px' }} />
            </button>
          )}
        </div>
        <p style={{
          marginTop: '8px',
          fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
          fontFamily: 'var(--font-inter), sans-serif',
          color: 'rgba(49, 49, 49, 0.5)',
        }}>
          Click on a color to change it. Add up to 6 colors for your brand palette.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2"
        style={{
          marginTop: '32px',
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
        Continue
        <span style={{ fontSize: '16px' }}>→</span>
      </button>
    </form>
  );
}


