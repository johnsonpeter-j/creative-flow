'use client';

import React, { useState } from 'react';

type TextPosition = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center-center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

const DesignAd: React.FC = () => {
  const [textPosition, setTextPosition] = useState<TextPosition>('bottom-left');

  const getPositionClass = () => {
    switch (textPosition) {
      case 'top-left': return 'items-start justify-start';
      case 'top-center': return 'items-start justify-center text-center';
      case 'top-right': return 'items-start justify-end text-right';
      case 'center-left': return 'items-center justify-start';
      case 'center-center': return 'items-center justify-center text-center';
      case 'center-right': return 'items-center justify-end text-right';
      case 'bottom-left': return 'items-end justify-start';
      case 'bottom-center': return 'items-end justify-center text-center';
      case 'bottom-right': return 'items-end justify-end text-right';
      default: return 'items-end justify-start';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Design Your Ad</h2>
        <p className="text-gray-500">Combine your ad copy and visual to create the final ad.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Design Controls */}
        <div className="md:col-span-1 bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Controls</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Position</label>
            <div className="grid grid-cols-3 gap-2">
              {(['top-left', 'top-center', 'top-right', 'center-left', 'center-center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'] as TextPosition[]).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setTextPosition(pos)}
                  className={`w-full h-10 rounded-lg flex items-center justify-center ${
                    textPosition === pos ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    textPosition === pos ? 'bg-white' : 'bg-gray-400'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ad Preview */}
        <div className="md:col-span-2 bg-gray-800 shadow-lg rounded-2xl p-6 aspect-w-1 aspect-h-1 flex items-center justify-center">
          <div className="relative w-full h-full bg-gray-400 rounded-lg flex p-4" style={{ backgroundColor: 'rgba(198, 124, 78, 0.4)' }}>
            <div className={`absolute inset-0 flex p-4 ${getPositionClass()}`}>
              <div className="text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                <h4 className="text-2xl font-bold">Walk the Walk, Change the World.</h4>
                <p className="text-sm mt-2">Your every step can make a difference. Our new eco-friendly sneakers are crafted from 100% recycled materials.</p>
                <button className="mt-4 bg-white text-black font-bold py-2 px-4 rounded">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignAd;
