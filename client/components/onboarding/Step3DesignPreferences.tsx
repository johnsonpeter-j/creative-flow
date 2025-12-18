'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layout, Type, Palette, ChevronDown, X } from 'lucide-react';

interface Step3DesignPreferencesProps {
  data: {
    logoPosition: string;
    typography: string;
    colorPalette: string[];
  };
  onChange: (data: any) => void;
  errors: Record<string, string>;
}

const LOGO_POSITIONS = [
  'Top Left',
  'Top Middle',
  'Top Right',
  'Bottom Left',
  'Bottom Middle',
  'Bottom Right',
] as const;

export default function Step3DesignPreferences({ data, onChange, errors }: Step3DesignPreferencesProps) {
  const [isLogoPositionOpen, setIsLogoPositionOpen] = useState(false);
  const logoPositionRef = useRef<HTMLDivElement>(null);

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

  const handleColorChange = (index: number, color: string) => {
    const newPalette = [...data.colorPalette];
    newPalette[index] = color;
    onChange({ ...data, colorPalette: newPalette });
  };

  const handleAddColor = () => {
    if (data.colorPalette.length < 6) {
      onChange({ ...data, colorPalette: [...data.colorPalette, '#000000'] });
    }
  };

  const handleRemoveColor = (index: number) => {
    if (data.colorPalette.length > 1) {
      const newPalette = data.colorPalette.filter((_, i) => i !== index);
      onChange({ ...data, colorPalette: newPalette });
    }
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
        <div className="relative">
          <Type 
            className="absolute left-3 top-3 pointer-events-none z-10"
            style={{
              width: '16px',
              height: '16px',
              color: errors.typography 
                ? 'rgba(239, 68, 68, 0.8)' 
                : 'rgba(49, 49, 49, 0.5)',
            }}
          />
          <textarea
            id="typography"
            value={data.typography}
            onChange={(e) => onChange({ ...data, typography: e.target.value })}
            rows={3}
            className="w-full rounded-lg border-2 outline-none transition-all duration-300 resize-none"
            style={{
              padding: '12px 12px 12px 40px',
              fontSize: 'clamp(12px, 1.1vw + 0.5rem, 14px)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              backgroundColor: errors.typography 
                ? 'rgba(239, 68, 68, 0.05)' 
                : 'rgba(237, 237, 237, 0.8)',
              borderColor: errors.typography 
                ? 'rgba(239, 68, 68, 0.4)' 
                : 'rgba(198, 124, 78, 0.2)',
              color: 'rgba(49, 49, 49, 0.75)',
            }}
            placeholder='e.g., &lt;link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"&gt;'
          />
        </div>
        {errors.typography && (
          <p style={{
            marginTop: '4px',
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
          {data.colorPalette.map((color, index) => (
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
                {data.colorPalette.length > 1 && (
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
          {data.colorPalette.length < 6 && (
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
    </div>
  );
}
