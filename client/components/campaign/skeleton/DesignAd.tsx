'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AdCopy } from '@/api/campaign.api';

interface DesignAdProps {
  adCopy: AdCopy | null;
}

// Dynamically import Editor to avoid SSR issues
const Editor = dynamic(() => import('@/components/AdEditor/Editor'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[var(--color-frame)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Editor...</p>
      </div>
    </div>
  ),
});

const DesignAd: React.FC<DesignAdProps> = ({ adCopy }) => {
  if (!adCopy) {
    return (
      <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Ad Copy Available</h2>
          <p className="text-gray-500">Please go back and generate ad copy first.</p>
        </div>
      </div>
    );
  }

  // Prepare image URL
  const imageUrl = adCopy.image_url
    ? adCopy.image_url.startsWith('http')
      ? adCopy.image_url
      : `http://localhost:8000${adCopy.image_url}`
    : undefined;

  return (
    <div className="w-full h-full flex flex-col p-0 m-0">
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-0">
        <Editor 
          initialImage={imageUrl}
        />
      </div>
    </div>
  );
};

export default DesignAd;
