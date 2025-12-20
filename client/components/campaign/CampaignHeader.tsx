'use client';

import React from 'react';

interface CampaignHeaderProps {
  number?: string;
  title: string;
  sectionTitle?: string;
}

export default function CampaignHeader({ 
  number = 'Ad', 
  title = 'Generator', 
  sectionTitle 
}: CampaignHeaderProps) {
  return (
    <div className="w-full">
      {/* Header with Number and Title */}
      <div className="flex items-center justify-end relative">
        <span 
          className="font-bold relative z-0"
          style={{
            fontSize: 'clamp(100px, 4vw + 1rem, 100px)',
            color: '#EDD6C8',
            fontFamily: 'var(--font-roboto), sans-serif',
            lineHeight: 1,
            marginRight: '-30px', // Overlap slightly with Generator
          }}
        >
          {number}
        </span>
        <h1 
          className="relative z-10 font-bold"
          style={{
            fontSize: 'clamp(36px, 4vw + 1rem, 48px)',
            color: '#313131',
            fontFamily: 'var(--font-roboto), sans-serif',
          }}
        >
          {title}
        </h1>
      </div>
      
      {/* Section Title with Underline */}
      {sectionTitle && (
        <div 
          className="border-b-2"
          style={{ borderColor: '#E3E3E3' }}
        >
          <div 
            className="inline-block -mb-0.5"
            style={{ borderBottom: '4px solid #C67C4E' }}
          >
            <h2 
              className="font-semibold pb-3"
              style={{
                fontSize: 'clamp(18px, 2vw + 0.5rem, 20px)',
                color: '#313131',
                fontFamily: 'var(--font-roboto), sans-serif',
              }}
            >
              {sectionTitle}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}



