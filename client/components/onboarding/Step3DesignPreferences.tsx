'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layout, Type, Palette, ChevronDown, X, Upload } from 'lucide-react';
import { LOGO_POSITIONS, EASY_FONTS, COLOR_ROLES } from '@/lib/constants';

interface Step3DesignPreferencesProps {
  data: {
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
  onChange: (data: any) => void;
  errors: Record<string, string>;
}

export default function Step3DesignPreferences({ data, onChange, errors }: Step3DesignPreferencesProps) {
  const [isLogoPositionOpen, setIsLogoPositionOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const logoPositionRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);

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

  const handleColorChange = (role: keyof typeof data.colors, color: string) => {
    onChange({ ...data, colors: { ...data.colors, [role]: color } });
  };

  const handleFontTypeChange = (type: 'dropdown' | 'google' | 'upload') => {
    onChange({ ...data, fontType: type, fontValue: '', fontFile: null });
  };

  const handleFontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['font/woff', 'font/woff2', 'application/font-woff', 'application/font-woff2', 'application/x-font-ttf', 'font/ttf', 'font/otf'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['woff', 'woff2', 'ttf', 'otf'];
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension || '')) {
        return;
      }
      
      onChange({ ...data, fontFile: file });
    }
  };

  const getSelectedFontLabel = () => {
    if (data.fontType === 'dropdown') {
      const font = EASY_FONTS.find(f => f.value === data.fontValue);
      return font ? font.label : 'Select a font';
    }
    return 'Select a font';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            className="w-full rounded-lg border-2 outline-none transition-all duration-200 text-left flex items-center justify-between relative"
            style={{
              padding: '12px 16px',
              paddingLeft: '40px',
              fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
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
            <span>{data.logoPosition || 'Top Left'}</span>
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
                      onChange({ ...data, logoPosition: position });
                      setIsLogoPositionOpen(false);
                    }}
                    className="w-full text-left transition-all duration-150 flex items-center gap-2"
                    style={{
                      padding: '10px 16px',
                      fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontWeight: 400,
                      backgroundColor: data.logoPosition === position
                        ? 'rgba(198, 124, 78, 0.1)'
                        : 'transparent',
                      color: data.logoPosition === position
                        ? 'rgba(198, 124, 78, 0.9)'
                        : 'rgba(49, 49, 49, 0.75)',
                    }}
                    onMouseEnter={(e) => {
                      if (data.logoPosition !== position) {
                        e.currentTarget.style.backgroundColor = 'rgba(198, 124, 78, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (data.logoPosition !== position) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: data.logoPosition === position 
                        ? 'var(--color-frame)' 
                        : 'transparent',
                    }} />
                    <span>{position}</span>
                    {data.logoPosition === position && (
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
          className="block mb-2"
          style={{
            fontSize: 'clamp(12px, 1vw + 0.5rem, 14px)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            color: 'rgba(49, 49, 49, 0.8)',
          }}
        >
          Typography
        </label>

        {/* Font Type Selection Tabs */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => handleFontTypeChange('dropdown')}
            className="rounded-lg transition-all duration-200"
            style={{
              padding: '8px 16px',
              fontSize: 'clamp(11px, 0.95vw + 0.5rem, 12px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              backgroundColor: data.fontType === 'dropdown' 
                ? 'var(--color-frame)' 
                : 'rgba(237, 237, 237, 0.8)',
              color: data.fontType === 'dropdown' 
                ? 'rgba(237, 237, 237, 0.95)' 
                : 'rgba(49, 49, 49, 0.7)',
              border: `2px solid ${data.fontType === 'dropdown' ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)'}`,
            }}
          >
            Easy Fonts
          </button>
          <button
            type="button"
            onClick={() => handleFontTypeChange('google')}
            className="rounded-lg transition-all duration-200"
            style={{
              padding: '8px 16px',
              fontSize: 'clamp(11px, 0.95vw + 0.5rem, 12px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              backgroundColor: data.fontType === 'google' 
                ? 'var(--color-frame)' 
                : 'rgba(237, 237, 237, 0.8)',
              color: data.fontType === 'google' 
                ? 'rgba(237, 237, 237, 0.95)' 
                : 'rgba(49, 49, 49, 0.7)',
              border: `2px solid ${data.fontType === 'google' ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)'}`,
            }}
          >
            Google Fonts
          </button>
          <button
            type="button"
            onClick={() => handleFontTypeChange('upload')}
            className="rounded-lg transition-all duration-200"
            style={{
              padding: '8px 16px',
              fontSize: 'clamp(11px, 0.95vw + 0.5rem, 12px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              backgroundColor: data.fontType === 'upload' 
                ? 'var(--color-frame)' 
                : 'rgba(237, 237, 237, 0.8)',
              color: data.fontType === 'upload' 
                ? 'rgba(237, 237, 237, 0.95)' 
                : 'rgba(49, 49, 49, 0.7)',
              border: `2px solid ${data.fontType === 'upload' ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)'}`,
            }}
          >
            Upload Font
          </button>
        </div>

        {/* Font Dropdown Option */}
        {data.fontType === 'dropdown' && (
          <div className="relative" ref={fontDropdownRef}>
            <button
              type="button"
              onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
              className="w-full rounded-lg border-2 outline-none transition-all duration-200 text-left flex items-center justify-between relative"
              style={{
                padding: '12px 16px',
                paddingLeft: '40px',
                fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                backgroundColor: isFontDropdownOpen 
                  ? 'rgba(237, 237, 237, 0.95)' 
                  : 'rgba(237, 237, 237, 0.8)',
                borderColor: errors.fontValue 
                  ? 'rgba(239, 68, 68, 0.4)' 
                  : isFontDropdownOpen 
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
                  color: errors.fontValue 
                    ? 'rgba(239, 68, 68, 0.8)' 
                    : 'rgba(49, 49, 49, 0.5)',
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
                        onChange({ ...data, fontValue: font.value });
                        setIsFontDropdownOpen(false);
                      }}
                      className="w-full text-left transition-all duration-150"
                      style={{
                        padding: '10px 16px',
                        fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                        fontFamily: `"${font.value}", sans-serif`,
                        fontWeight: 400,
                        backgroundColor: data.fontValue === font.value
                          ? 'rgba(198, 124, 78, 0.1)'
                          : 'transparent',
                        color: data.fontValue === font.value
                          ? 'rgba(198, 124, 78, 0.9)'
                          : 'rgba(49, 49, 49, 0.75)',
                      }}
                      onMouseEnter={(e) => {
                        if (data.fontValue !== font.value) {
                          e.currentTarget.style.backgroundColor = 'rgba(198, 124, 78, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (data.fontValue !== font.value) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{font.label}</span>
                        <span style={{ 
                          fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)', 
                          color: 'rgba(49, 49, 49, 0.5)',
                          fontFamily: 'var(--font-inter), sans-serif',
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
        {data.fontType === 'google' && (
          <div className="relative">
            <Type 
              className="absolute left-3 top-3 pointer-events-none z-10"
              style={{
                width: '16px',
                height: '16px',
                color: errors.fontValue 
                  ? 'rgba(239, 68, 68, 0.8)' 
                  : 'rgba(49, 49, 49, 0.5)',
              }}
            />
            <textarea
              value={data.fontValue}
              onChange={(e) => onChange({ ...data, fontValue: e.target.value })}
              rows={3}
              className="w-full rounded-lg border-2 outline-none transition-all duration-300 resize-none"
              style={{
                padding: '12px 12px 12px 40px',
                fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                backgroundColor: errors.fontValue 
                  ? 'rgba(239, 68, 68, 0.05)' 
                  : 'rgba(237, 237, 237, 0.8)',
                borderColor: errors.fontValue 
                  ? 'rgba(239, 68, 68, 0.4)' 
                  : 'rgba(198, 124, 78, 0.2)',
                color: 'rgba(49, 49, 49, 0.75)',
              }}
              placeholder='e.g., &lt;link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"&gt;'
            />
          </div>
        )}

        {/* Upload Font Option */}
        {data.fontType === 'upload' && (
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
              className="flex flex-col items-center justify-center w-full cursor-pointer transition-all duration-200 rounded-lg border-2 border-dashed"
              style={{
                padding: '24px',
                backgroundColor: errors.fontFile 
                  ? 'rgba(239, 68, 68, 0.05)' 
                  : 'rgba(237, 237, 237, 0.6)',
                borderColor: errors.fontFile 
                  ? 'rgba(239, 68, 68, 0.4)' 
                  : 'rgba(198, 124, 78, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!errors.fontFile) {
                  e.currentTarget.style.backgroundColor = 'rgba(237, 237, 237, 0.8)';
                  e.currentTarget.style.borderColor = 'var(--color-frame)';
                }
              }}
              onMouseLeave={(e) => {
                if (!errors.fontFile) {
                  e.currentTarget.style.backgroundColor = 'rgba(237, 237, 237, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(198, 124, 78, 0.3)';
                }
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
              }}>WOFF, WOFF2, TTF, OTF (MAX. 10MB)</p>
              {data.fontFile && (
                <p style={{
                  marginTop: '8px',
                  fontSize: 'clamp(11px, 0.95vw + 0.5rem, 12px)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  color: 'rgba(198, 124, 78, 0.9)',
                  fontWeight: 500,
                }}>
                  {data.fontFile.name}
                </p>
              )}
            </label>
          </div>
        )}

        {/* Error Messages */}
        {(errors.fontValue || errors.fontFile) && (
          <p style={{
            marginTop: '4px',
            fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
            color: 'rgba(239, 68, 68, 0.85)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
          }}>{errors.fontValue || errors.fontFile}</p>
        )}
      </div>

      {/* Color Selection */}
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
                    backgroundColor: data.colors[role.key as keyof typeof data.colors],
                    flexShrink: 0,
                  }}
                >
                  <input
                    type="color"
                    value={data.colors[role.key as keyof typeof data.colors]}
                    onChange={(e) => handleColorChange(role.key as keyof typeof data.colors, e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 'clamp(12px, 1vw + 0.5rem, 13px)',
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontWeight: 500,
                      color: 'rgba(49, 49, 49, 0.9)',
                    }}>
                      {role.label}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={data.colors[role.key as keyof typeof data.colors]}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                        handleColorChange(role.key as keyof typeof data.colors, value);
                      }
                    }}
                    placeholder="#000000"
                    className="w-full rounded-lg border-2 outline-none transition-all duration-300"
                    style={{
                      padding: '6px 10px',
                      fontSize: 'clamp(11px, 0.9vw + 0.5rem, 12px)',
                      fontFamily: 'var(--font-mono), monospace',
                      fontWeight: 400,
                      backgroundColor: 'rgba(237, 237, 237, 0.8)',
                      borderColor: 'rgba(198, 124, 78, 0.2)',
                      color: 'rgba(49, 49, 49, 0.75)',
                    }}
                  />
                  <p style={{
                    fontSize: 'clamp(10px, 0.85vw + 0.5rem, 11px)',
                    fontFamily: 'var(--font-inter), sans-serif',
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
  );
}
