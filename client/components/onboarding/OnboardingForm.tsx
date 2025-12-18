'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Building2, Briefcase, Image, Layout, Type, Palette, Upload, X, ChevronDown } from 'lucide-react';

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

const LOGO_POSITIONS = [
  'Top Left',
  'Top Middle',
  'Top Right',
  'Bottom Left',
  'Bottom Middle',
  'Bottom Right',
] as const;

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
    <form onSubmit={handleSubmit} >
      {/* Brand Name */}
      <div>
        <label htmlFor="brandName" className="block text-sm font-semibold text-gray-700 mb-2">
          Brand Name
        </label>
        <div className="relative group">
          <Building2 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
              errors.brandName 
                ? 'text-red-500' 
                : isFocused.brandName 
                  ? 'text-indigo-600' 
                  : 'text-gray-400 group-hover:text-gray-600'
            }`} 
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
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 ${
              errors.brandName
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="Enter your brand name"
          />
        </div>
        <div className="min-h-[20px] mt-1">
          {errors.brandName && (
            <p className="text-sm text-red-600">{errors.brandName}</p>
          )}
        </div>
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
          Industry
        </label>
        <div className="relative group">
          <Briefcase 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
              errors.industry 
                ? 'text-red-500' 
                : isFocused.industry 
                  ? 'text-indigo-600' 
                  : 'text-gray-400 group-hover:text-gray-600'
            }`} 
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
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 ${
              errors.industry
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="e.g., Technology, Fashion, Food & Beverage"
          />
        </div>
        <div className="min-h-[20px] mt-1">
          {errors.industry && (
            <p className="text-sm text-red-600">{errors.industry}</p>
          )}
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-indigo-500 group"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, SVG (MAX. 5MB)</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-center w-full h-32 border-2 border-gray-200 rounded-xl bg-gray-50 p-4">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              aria-label="Remove logo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="min-h-[20px] mt-1">
          {errors.logo && (
            <p className="text-sm text-red-600">{errors.logo}</p>
          )}
        </div>
      </div>

      {/* Logo Position */}
      <div>
        <label htmlFor="logoPosition" className="block text-sm font-semibold text-gray-700 mb-2">
          Logo Position
        </label>
        <div className="relative" ref={logoPositionRef}>
          <button
            type="button"
            id="logoPosition"
            onClick={() => setIsLogoPositionOpen(!isLogoPositionOpen)}
            className={`w-full pl-11 pr-10 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all duration-200 bg-gray-50 text-left text-gray-900 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:bg-white ${
              isLogoPositionOpen ? 'bg-white border-indigo-500 ring-2 ring-indigo-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layout className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <span className="pl-6">{logoPosition}</span>
              </span>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isLogoPositionOpen ? 'transform rotate-180' : ''
                }`}
              />
            </div>
          </button>
          
          {isLogoPositionOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden">
              <div className="py-1">
                {LOGO_POSITIONS.map((position) => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => handleLogoPositionSelect(position)}
                    className={`w-full px-4 py-3 text-left transition-all duration-150 flex items-center gap-2 ${
                      logoPosition === position
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      logoPosition === position ? 'bg-indigo-600' : 'bg-transparent'
                    }`} />
                    <span>{position}</span>
                    {logoPosition === position && (
                      <svg className="ml-auto w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <label htmlFor="typography" className="block text-sm font-semibold text-gray-700 mb-2">
          Typography (Google Fonts Embedded Code)
        </label>
        <div className="relative group">
          <Type 
            className={`absolute left-3 top-3 w-5 h-5 transition-colors ${
              errors.typography 
                ? 'text-red-500' 
                : isFocused.typography 
                  ? 'text-indigo-600' 
                  : 'text-gray-400 group-hover:text-gray-600'
            }`} 
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
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 resize-none ${
              errors.typography
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder='e.g., &lt;link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"&gt;'
          />
        </div>
        <div className="min-h-[20px] mt-1">
          {errors.typography && (
            <p className="text-sm text-red-600">{errors.typography}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Paste the Google Fonts link 
          </p>
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                />
                {colorPalette.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs"
                    aria-label="Remove color"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {colorPalette.length < 6 && (
            <button
              type="button"
              onClick={handleAddColor}
              className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"
              aria-label="Add color"
            >
              <Palette className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Click on a color to change it. Add up to 6 colors for your brand palette.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 mt-8"
      >
        Complete Setup
      </button>
    </form>
  );
}

