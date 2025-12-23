'use client';

import React from 'react';
import { Download } from 'lucide-react';

const AdPreview: React.FC = () => {
  const handleDownload = () => {
    // Implement download logic here
    console.log('Downloading Ad...');
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col py-8">
      <div className="text-center mb-8">
        {/* <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Ad Is Ready!</h2> */}
        <p className="text-gray-500">Here&apos;s a preview of your final ad. You can now download it.</p>
      </div>
      <div className="flex flex-col items-center flex-1">
        {/* Ad Preview */}
        <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-2xl p-6 aspect-w-1 aspect-h-1 flex items-center justify-center">
          <div className="relative w-full h-full bg-gray-400 rounded-lg flex items-end justify-start p-4">
            <div className="text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              <h4 className="text-2xl font-bold">Walk the Walk, Change the World.</h4>
              <p className="text-sm mt-2">Your every step can make a difference. Our new eco-friendly sneakers are crafted from 100% recycled materials.</p>
              <button className="mt-4 bg-white text-black font-bold py-2 px-4 rounded">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="pt-6 mt-8 w-full max-w-md">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2"
            style={{
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
            <Download className="w-5 h-5 mr-2" />
            Download Ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdPreview;
