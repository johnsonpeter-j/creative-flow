'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Building2, Palette, Building2 as BusinessIcon, Layout, Type, Upload, X, ChevronDown } from 'lucide-react';
import { LOGO_POSITIONS, EASY_FONTS, COLOR_ROLES } from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProfile, updateProfile } from '@/store/slices/profileSlice';
import { fetchOnboarding, submitOnboarding } from '@/store/slices/onboardingSlice';

type TabType = 'personal' | 'business' | 'design';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user: profileUser, loading: profileLoading } = useAppSelector((state) => state.profile);
  const { data: onboardingData, loading: onboardingLoading } = useAppSelector((state) => state.onboarding);
  
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  
  // Personal Information State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Business Information State
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [businessAddressType, setBusinessAddressType] = useState('');
  const [businessType, setBusinessType] = useState('');
  
  // Design Preferences State
  const [logoPosition, setLogoPosition] = useState('Top Left');
  const [isLogoPositionOpen, setIsLogoPositionOpen] = useState(false);
  const [fontType, setFontType] = useState<'dropdown' | 'google' | 'upload'>('dropdown');
  const [fontValue, setFontValue] = useState('');
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [colors, setColors] = useState({
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#313131',
  });
  
  const logoPositionRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchOnboarding());
  }, [dispatch]);

  // Update form fields when data is fetched
  useEffect(() => {
    if (profileUser) {
      setName(profileUser.name);
      setEmail(profileUser.email);
    }
  }, [profileUser]);

  useEffect(() => {
    if (onboardingData) {
      setBusinessName(onboardingData.brandName || '');
      setIndustry(onboardingData.industry || '');
      setLogoPreview(onboardingData.logoUrl || null);
      setAddressLine1(onboardingData.addressLine1 || '');
      setAddressLine2(onboardingData.addressLine2 || '');
      setCity(onboardingData.city || '');
      setZip(onboardingData.zip || '');
      setBusinessAddressType(onboardingData.businessAddressType || '');
      setBusinessType(onboardingData.businessType || '');
      setLogoPosition(onboardingData.logoPosition || 'Top Left');
      
      // Set font type and value
      if (onboardingData.fontType) {
        setFontType(onboardingData.fontType as 'dropdown' | 'google' | 'upload');
      }
      if (onboardingData.typography) {
        setFontValue(onboardingData.typography);
      }
      
      // Set colors from color palette
      if (onboardingData.colorPalette && onboardingData.colorPalette.length >= 4) {
        setColors({
          primary: onboardingData.colorPalette[0] || '#6366f1',
          secondary: onboardingData.colorPalette[1] || '#8b5cf6',
          background: onboardingData.colorPalette[2] || '#ffffff',
          text: onboardingData.colorPalette[3] || '#313131',
        });
      }
    }
  }, [onboardingData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoPositionRef.current && !logoPositionRef.current.contains(event.target as Node)) {
        setIsLogoPositionOpen(false);
      }
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      setLogo(file);
      
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
  };

  const handleFontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['font/woff', 'font/woff2', 'application/font-woff', 'application/font-woff2', 'application/x-font-ttf', 'font/ttf', 'font/otf'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['woff', 'woff2', 'ttf', 'otf'];
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension || '')) {
        return;
      }
      
      setFontFile(file);
    }
  };

  const handleColorChange = (role: keyof typeof colors, color: string) => {
    setColors({ ...colors, [role]: color });
  };

  const getSelectedFontLabel = () => {
    if (fontType === 'dropdown') {
      const font = EASY_FONTS.find(f => f.value === fontValue);
      return font ? font.label : 'Select a font';
    }
    return 'Select a font';
  };

  const tabs = [
    { id: 'personal' as TabType, label: 'Personal Information', icon: User },
    { id: 'business' as TabType, label: 'Business Information', icon: BusinessIcon },
    { id: 'design' as TabType, label: 'Design Preferences', icon: Palette },
  ];

  const handleSave = async () => {
    try {
      // Save personal information
      await dispatch(updateProfile({ name })).unwrap();
      
      // Build typography value based on font type
      let typography = '';
      if (fontType === 'dropdown') {
        typography = fontValue;
      } else if (fontType === 'google') {
        typography = fontValue;
      }
      
      // Save business information and design preferences
      await dispatch(submitOnboarding({
        brandName: businessName,
        industry: industry,
        logo: logo || undefined,
        logoPosition: logoPosition,
        typography: typography,
        fontType: fontType,
        fontFile: fontFile || undefined,
        colorPalette: [colors.primary, colors.secondary, colors.background, colors.text],
        addressLine1: addressLine1 || undefined,
        addressLine2: addressLine2 || undefined,
        city: city || undefined,
        zip: zip || undefined,
        businessAddressType: businessAddressType || undefined,
        businessType: businessType || undefined,
      })).unwrap();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const loading = profileLoading || onboardingLoading;

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            width: '400px',
            height: '400px',
            left: '-100px',
            bottom: '-100px',
            backgroundColor: 'rgba(198, 124, 78, 0.08)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            transform: 'rotate(-45deg)',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '350px',
            height: '350px',
            right: '-80px',
            top: '-80px',
            backgroundColor: 'rgba(198, 124, 78, 0.06)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'rotate(45deg)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: 'rgba(49, 49, 49, 0.95)' }}
            >
              Profile Settings
            </h1>
            <p 
              className="text-base"
              style={{ color: 'rgba(49, 49, 49, 0.6)' }}
            >
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div 
              className="rounded-xl p-2"
              style={{ 
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 24px rgba(49, 49, 49, 0.08)',
              }}
            >
              <nav className="flex space-x-2" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative flex-1 whitespace-nowrap py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                        ${
                          activeTab === tab.id
                            ? 'text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                      style={
                        activeTab === tab.id
                          ? {
                              background: 'linear-gradient(135deg, #CD9C74 0%, #E4C5AC 100%)',
                              boxShadow: '0 4px 16px rgba(205, 156, 116, 0.3)',
                            }
                          : {}
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span className="relative z-10">{tab.label}</span>
                      {activeTab === tab.id && (
                        <span 
                          className="absolute inset-0 rounded-lg opacity-20"
                          style={{
                            background: 'linear-gradient(135deg, #CD9C74 0%, #E4C5AC 100%)',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div 
            className="rounded-2xl p-8 relative z-10"
            style={{ 
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 24px rgba(49, 49, 49, 0.08)',
            }}
          >
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div>
                  <h2 
                    className="text-xl font-semibold mb-2"
                    style={{ color: 'rgba(49, 49, 49, 0.95)' }}
                  >
                    Personal Information
                  </h2>
                  <p 
                    className="text-sm mb-6"
                    style={{ color: 'rgba(49, 49, 49, 0.6)' }}
                  >
                    Update your personal details and contact information
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label 
                      htmlFor="name"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: 'rgba(49, 49, 49, 0.85)' }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                      style={{
                        backgroundColor: 'rgba(237, 237, 237, 0.6)',
                        borderColor: 'rgba(198, 124, 78, 0.2)',
                        color: 'rgba(49, 49, 49, 0.95)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-frame)';
                        e.target.style.boxShadow = '0 4px 20px rgba(198, 124, 78, 0.12)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(198, 124, 78, 0.2)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="email"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: 'rgba(49, 49, 49, 0.85)' }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled
                      className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all cursor-not-allowed"
                      style={{
                        backgroundColor: 'rgba(237, 237, 237, 0.4)',
                        borderColor: 'rgba(198, 124, 78, 0.15)',
                        color: 'rgba(49, 49, 49, 0.6)',
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Business Information Tab */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div>
                  <h2 
                    className="text-xl font-semibold mb-2"
                    style={{ color: 'rgba(49, 49, 49, 0.95)' }}
                  >
                    Business Information
                  </h2>
                  <p 
                    className="text-sm mb-6"
                    style={{ color: 'rgba(49, 49, 49, 0.6)' }}
                  >
                    Update your business details and information
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Business Name, Industry (Left) and Logo (Right) - Two Column Layout */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                    {/* Left Side: Business Name and Industry */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Business Name */}
                      <div>
                        <label 
                          htmlFor="businessName" 
                          className="block mb-2 text-sm font-semibold"
                          style={{ color: 'rgba(49, 49, 49, 0.85)' }}
                        >
                          Business Name
                        </label>
                        <div className="relative">
                          <Building2 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
                            style={{
                              width: '16px',
                              height: '16px',
                              color: 'rgba(49, 49, 49, 0.5)',
                            }}
                          />
                          <input
                            id="businessName"
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full rounded-lg border-2 outline-none transition-all duration-300 pl-10 pr-4 py-3"
                            style={{
                              fontSize: '14px',
                              backgroundColor: 'rgba(237, 237, 237, 0.8)',
                              borderColor: 'rgba(198, 124, 78, 0.2)',
                              color: 'rgba(49, 49, 49, 0.75)',
                            }}
                            placeholder="Enter your business name"
                          />
                        </div>
                      </div>

                      {/* Industry */}
                      <div>
                        <label 
                          htmlFor="industry" 
                          className="block mb-2 text-sm font-semibold"
                          style={{ color: 'rgba(49, 49, 49, 0.85)' }}
                        >
                          Industry
                        </label>
                        <div className="relative">
                          <Building2 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
                            style={{
                              width: '16px',
                              height: '16px',
                              color: 'rgba(49, 49, 49, 0.5)',
                            }}
                          />
                          <input
                            id="industry"
                            type="text"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full rounded-lg border-2 outline-none transition-all duration-300 pl-10 pr-4 py-3"
                            style={{
                              fontSize: '14px',
                              backgroundColor: 'rgba(237, 237, 237, 0.8)',
                              borderColor: 'rgba(198, 124, 78, 0.2)',
                              color: 'rgba(49, 49, 49, 0.75)',
                            }}
                            placeholder="e.g., Technology, Fashion, Food & Beverage"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Logo Upload */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label 
                        className="block mb-2 text-sm font-semibold"
                        style={{ color: 'rgba(49, 49, 49, 0.85)' }}
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
                              src={logoPreview}
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

                  {/* Business Address Type and Business Type - Two Column Layout */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Business Address Dropdown */}
                    <div>
                      <label 
                        htmlFor="businessAddress" 
                        className="block mb-2 text-sm font-semibold"
                        style={{ color: 'rgba(49, 49, 49, 0.85)' }}
                      >
                        Business address
                      </label>
                      <div className="relative">
                        <select
                          id="businessAddress"
                          value={businessAddressType}
                          onChange={(e) => setBusinessAddressType(e.target.value)}
                          className="w-full rounded-lg border-2 outline-none transition-all duration-300 pr-10 pl-4 py-3"
                          style={{
                            fontSize: '14px',
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
                        className="block mb-2 text-sm font-semibold"
                        style={{ color: 'rgba(49, 49, 49, 0.85)' }}
                      >
                        Type
                      </label>
                      <div className="relative">
                        <select
                          id="businessType"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="w-full rounded-lg border-2 outline-none transition-all duration-300 pr-10 pl-4 py-3"
                          style={{
                            fontSize: '14px',
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
                      className="block mb-2 text-sm font-semibold"
                      style={{ color: 'rgba(49, 49, 49, 0.85)' }}
                    >
                      Address
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {/* Address Line 1 */}
                      <div>
                        <input
                          type="text"
                          placeholder="Address line 1"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          className="w-full rounded-lg border-2 outline-none transition-all duration-300 px-4 py-3"
                          style={{
                            fontSize: '14px',
                            backgroundColor: 'rgba(237, 237, 237, 0.8)',
                            borderColor: 'rgba(198, 124, 78, 0.2)',
                            color: 'rgba(49, 49, 49, 0.75)',
                          }}
                        />
                      </div>
                      {/* Address Line 2 */}
                      <div>
                        <input
                          type="text"
                          placeholder="Address line 2"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          className="w-full rounded-lg border-2 outline-none transition-all duration-300 px-4 py-3"
                          style={{
                            fontSize: '14px',
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
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full rounded-lg border-2 outline-none transition-all duration-300 px-4 py-3"
                          style={{
                            fontSize: '14px',
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
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="w-full rounded-lg border-2 outline-none transition-all duration-300 px-4 py-3"
                          style={{
                            fontSize: '14px',
                            backgroundColor: 'rgba(237, 237, 237, 0.8)',
                            borderColor: 'rgba(198, 124, 78, 0.2)',
                            color: 'rgba(49, 49, 49, 0.75)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Design Preferences Tab */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div>
                  <h2 
                    className="text-xl font-semibold mb-2"
                    style={{ color: 'rgba(49, 49, 49, 0.95)' }}
                  >
                    Design Preferences
                  </h2>
                  <p 
                    className="text-sm mb-6"
                    style={{ color: 'rgba(49, 49, 49, 0.6)' }}
                  >
                    Customize your design preferences to match your brand identity
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Logo Position */}
                  <div>
                    <label 
                      htmlFor="logoPosition" 
                      className="block mb-2 text-sm font-semibold"
                      style={{ color: 'rgba(49, 49, 49, 0.85)' }}
                    >
                      Logo Position
                    </label>
                    <div className="relative" ref={logoPositionRef}>
                      <button
                        type="button"
                        id="logoPosition"
                        onClick={() => setIsLogoPositionOpen(!isLogoPositionOpen)}
                        className="w-full rounded-lg border-2 outline-none transition-all duration-200 text-left flex items-center justify-between relative pl-10 pr-4 py-3"
                        style={{
                          fontSize: '14px',
                          backgroundColor: isLogoPositionOpen 
                            ? 'rgba(237, 237, 237, 0.95)' 
                            : 'rgba(237, 237, 237, 0.8)',
                          borderColor: isLogoPositionOpen 
                            ? 'var(--color-frame)' 
                            : 'rgba(198, 124, 78, 0.2)',
                          color: 'rgba(49, 49, 49, 0.75)',
                          cursor: 'pointer',
                          boxShadow: isLogoPositionOpen 
                            ? '0 4px 20px rgba(198, 124, 78, 0.15)' 
                            : 'none',
                        }}
                      >
                        <Layout 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                          style={{
                            width: '16px',
                            height: '16px',
                            color: 'rgba(49, 49, 49, 0.5)',
                          }}
                        />
                        <span>{logoPosition || 'Top Left'}</span>
                        <ChevronDown 
                          style={{
                            width: '16px',
                            height: '16px',
                            color: 'rgba(49, 49, 49, 0.5)',
                            transform: isLogoPositionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                          }}
                        />
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
                                onClick={() => {
                                  setLogoPosition(position);
                                  setIsLogoPositionOpen(false);
                                }}
                                className="w-full text-left transition-all duration-150 flex items-center gap-2 px-4 py-2"
                                style={{
                                  fontSize: '14px',
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
                  </div>

                  {/* Typography Selection */}
                  <div>
                    <label 
                      className="block mb-2 text-sm font-semibold"
                      style={{ color: 'rgba(49, 49, 49, 0.85)' }}
                    >
                      Typography
                    </label>

                    {/* Font Type Selection Tabs */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setFontType('dropdown')}
                        className="rounded-lg transition-all duration-200 px-4 py-2 text-sm"
                        style={{
                          backgroundColor: fontType === 'dropdown' 
                            ? 'var(--color-frame)' 
                            : 'rgba(237, 237, 237, 0.8)',
                          color: fontType === 'dropdown' 
                            ? 'rgba(237, 237, 237, 0.95)' 
                            : 'rgba(49, 49, 49, 0.7)',
                          border: `2px solid ${fontType === 'dropdown' ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)'}`,
                        }}
                      >
                        Easy Fonts
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontType('google')}
                        className="rounded-lg transition-all duration-200 px-4 py-2 text-sm"
                        style={{
                          backgroundColor: fontType === 'google' 
                            ? 'var(--color-frame)' 
                            : 'rgba(237, 237, 237, 0.8)',
                          color: fontType === 'google' 
                            ? 'rgba(237, 237, 237, 0.95)' 
                            : 'rgba(49, 49, 49, 0.7)',
                          border: `2px solid ${fontType === 'google' ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)'}`,
                        }}
                      >
                        Google Fonts
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontType('upload')}
                        className="rounded-lg transition-all duration-200 px-4 py-2 text-sm"
                        style={{
                          backgroundColor: fontType === 'upload' 
                            ? 'var(--color-frame)' 
                            : 'rgba(237, 237, 237, 0.8)',
                          color: fontType === 'upload' 
                            ? 'rgba(237, 237, 237, 0.95)' 
                            : 'rgba(49, 49, 49, 0.7)',
                          border: `2px solid ${fontType === 'upload' ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)'}`,
                        }}
                      >
                        Upload Font
                      </button>
                    </div>

                    {/* Font Dropdown Option */}
                    {fontType === 'dropdown' && (
                      <div className="relative" ref={fontDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                          className="w-full rounded-lg border-2 outline-none transition-all duration-200 text-left flex items-center justify-between relative pl-10 pr-4 py-3"
                          style={{
                            fontSize: '14px',
                            backgroundColor: isFontDropdownOpen 
                              ? 'rgba(237, 237, 237, 0.95)' 
                              : 'rgba(237, 237, 237, 0.8)',
                            borderColor: isFontDropdownOpen 
                              ? 'var(--color-frame)' 
                              : 'rgba(198, 124, 78, 0.2)',
                            color: 'rgba(49, 49, 49, 0.75)',
                            cursor: 'pointer',
                            boxShadow: isFontDropdownOpen 
                              ? '0 4px 20px rgba(198, 124, 78, 0.15)' 
                              : 'none',
                          }}
                        >
                          <Type 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                            style={{
                              width: '16px',
                              height: '16px',
                              color: 'rgba(49, 49, 49, 0.5)',
                            }}
                          />
                          <span>{getSelectedFontLabel()}</span>
                          <ChevronDown 
                            style={{
                              width: '16px',
                              height: '16px',
                              color: 'rgba(49, 49, 49, 0.5)',
                              transform: isFontDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s',
                            }}
                          />
                        </button>
                        
                        {isFontDropdownOpen && (
                          <div 
                            className="absolute z-50 w-full mt-2 rounded-lg overflow-hidden max-h-64 overflow-y-auto"
                            style={{
                              backgroundColor: 'rgba(237, 237, 237, 0.98)',
                              border: '2px solid rgba(198, 124, 78, 0.2)',
                              boxShadow: '0 8px 32px rgba(49, 49, 49, 0.15)',
                              backdropFilter: 'blur(10px)',
                            }}
                          >
                            <div style={{ padding: '4px 0' }}>
                              {EASY_FONTS.map((font) => (
                                <button
                                  key={font.value}
                                  type="button"
                                  onClick={() => {
                                    setFontValue(font.value);
                                    setIsFontDropdownOpen(false);
                                  }}
                                  className="w-full text-left transition-all duration-150 px-4 py-2"
                                  style={{
                                    fontSize: '14px',
                                    fontFamily: `"${font.value}", sans-serif`,
                                    backgroundColor: fontValue === font.value
                                      ? 'rgba(198, 124, 78, 0.1)'
                                      : 'transparent',
                                    color: fontValue === font.value
                                      ? 'rgba(198, 124, 78, 0.9)'
                                      : 'rgba(49, 49, 49, 0.75)',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (fontValue !== font.value) {
                                      e.currentTarget.style.backgroundColor = 'rgba(198, 124, 78, 0.05)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (fontValue !== font.value) {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{font.label}</span>
                                    <span style={{ 
                                      fontSize: '12px', 
                                      color: 'rgba(49, 49, 49, 0.5)',
                                    }}>{font.category}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Google Fonts Input */}
                    {fontType === 'google' && (
                      <div className="relative">
                        <Type 
                          className="absolute left-3 top-3 pointer-events-none z-10"
                          style={{
                            width: '16px',
                            height: '16px',
                            color: 'rgba(49, 49, 49, 0.5)',
                          }}
                        />
                        <textarea
                          value={fontValue}
                          onChange={(e) => setFontValue(e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border-2 outline-none transition-all duration-300 resize-none pl-10 pr-4 py-3"
                          style={{
                            fontSize: '14px',
                            backgroundColor: 'rgba(237, 237, 237, 0.8)',
                            borderColor: 'rgba(198, 124, 78, 0.2)',
                            color: 'rgba(49, 49, 49, 0.75)',
                          }}
                          placeholder='e.g., <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">'
                        />
                      </div>
                    )}

                    {/* Upload Font Option */}
                    {fontType === 'upload' && (
                      <div className="relative">
                        <input
                          type="file"
                          id="fontFile"
                          accept=".woff,.woff2,.ttf,.otf"
                          onChange={handleFontFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="fontFile"
                          className="flex flex-col items-center justify-center w-full cursor-pointer transition-all duration-200 rounded-lg border-2 border-dashed p-6"
                          style={{
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
                          <Upload style={{
                            width: '24px',
                            height: '24px',
                            marginBottom: '8px',
                            color: 'rgba(49, 49, 49, 0.5)',
                          }} />
                          <p style={{
                            marginBottom: '4px',
                            fontSize: '12px',
                            color: 'rgba(49, 49, 49, 0.6)',
                          }}>
                            <span>Click to upload</span> or drag and drop
                          </p>
                          <p style={{
                            fontSize: '11px',
                            color: 'rgba(49, 49, 49, 0.5)',
                          }}>WOFF, WOFF2, TTF, OTF (MAX. 10MB)</p>
                          {fontFile && (
                            <p style={{
                              marginTop: '8px',
                              fontSize: '12px',
                              color: 'rgba(198, 124, 78, 0.9)',
                              fontWeight: 500,
                            }}>
                              {fontFile.name}
                            </p>
                          )}
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label 
                      className="block mb-2 text-sm font-semibold"
                      style={{ color: 'rgba(49, 49, 49, 0.85)' }}
                    >
                      Color Palette
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {COLOR_ROLES.map((role) => (
                        <div key={role.key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              className="relative rounded-lg cursor-pointer"
                              style={{
                                width: '48px',
                                height: '48px',
                                border: '2px solid rgba(198, 124, 78, 0.2)',
                                backgroundColor: colors[role.key as keyof typeof colors],
                                flexShrink: 0,
                              }}
                            >
                              <input
                                type="color"
                                value={colors[role.key as keyof typeof colors]}
                                onChange={(e) => handleColorChange(role.key as keyof typeof colors, e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  color: 'rgba(49, 49, 49, 0.9)',
                                }}>
                                  {role.label}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={colors[role.key as keyof typeof colors]}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                    handleColorChange(role.key as keyof typeof colors, value);
                                  }
                                }}
                                placeholder="#000000"
                                className="w-full rounded-lg border-2 outline-none transition-all duration-300 px-2 py-1 text-xs"
                                style={{
                                  fontFamily: 'monospace',
                                  backgroundColor: 'rgba(237, 237, 237, 0.8)',
                                  borderColor: 'rgba(198, 124, 78, 0.2)',
                                  color: 'rgba(49, 49, 49, 0.75)',
                                }}
                              />
                              <p style={{
                                fontSize: '11px',
                                color: 'rgba(49, 49, 49, 0.5)',
                              }}>
                                {role.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  backgroundColor: loading ? 'rgba(205, 156, 116, 0.5)' : 'var(--color-frame)',
                  color: 'rgba(237, 237, 237, 0.95)',
                  boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(198, 124, 78, 0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(198, 124, 78, 0.25)';
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
