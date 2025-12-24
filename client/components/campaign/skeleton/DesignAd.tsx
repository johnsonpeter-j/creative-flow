'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AdCopy } from '@/api/campaign.api';

interface DesignAdProps {
  adCopy: AdCopy | null;
  onEditedImageChange?: (dataURL: string) => void;
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

const DesignAd: React.FC<DesignAdProps> = ({ adCopy, onEditedImageChange }) => {
  // Convert text_layers from API format to Editor format
  const initialTexts = useMemo(() => {
    if (!adCopy?.text_layers || adCopy.text_layers.length === 0) {
      return undefined;
    }
    
    return adCopy.text_layers
      .filter(layer => layer.type !== 'body') // Filter out body text to avoid clutter
      .map(layer => ({
        text: layer.text,
        type: layer.type,
        left: layer.left, // Will be converted to pixels in Editor (0-100 treated as percentage)
        top: layer.top,   // Will be converted to pixels in Editor (0-100 treated as percentage)
        fontSize: layer.fontSize,
        fill: layer.fill,
        fontFamily: layer.fontFamily,
        fontWeight: layer.fontWeight,
        fontStyle: layer.fontStyle,
        textAlign: layer.textAlign,
      }));
  }, [adCopy?.text_layers]);

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
          initialTexts={initialTexts}
          onCanvasChange={onEditedImageChange}
        />
      </div>
    </div>
  );
};

export default DesignAd;
