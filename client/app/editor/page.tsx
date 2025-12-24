'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import Editor to avoid SSR issues with canvas/window
const Editor = dynamic(() => import('@/components/AdEditor/Editor'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading Editor...</div>
});

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ad Editor</h1>
          <p className="mt-2 text-gray-600">Customize your ad creative with editable layers.</p>
        </div>
        
        <div className="flex justify-center">
          <Editor 
            initialImage="/test.png"
            initialText={{
              text: "Transform Your Business Today",
              left: 150,
              top: 200,
              fontSize: 48,
              fill: "#ffffff",
              fontFamily: "Inter"
            }}
          />
        </div>
      </div>
    </div>
  );
}
