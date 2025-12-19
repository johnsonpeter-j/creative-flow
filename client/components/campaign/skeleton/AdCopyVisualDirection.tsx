'use client';

import React from 'react';
import { Image } from 'lucide-react';

const AdCopyVisualDirection: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Ad Copy & Visual Direction</h2>
        <p className="text-gray-500">Here&apos;s the generated ad copy and visual direction for your campaign.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Ad Copy */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ad Copy</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <p><strong>Headline:</strong> Walk the Walk, Change the World.</p>
            <p><strong>Body:</strong> Your every step can make a difference. Our new eco-friendly sneakers are crafted from 100% recycled materials, combining sustainable style with unparalleled comfort. Join the movement. #EcoWarriorsUnite #SustainableStyle</p>
            <p><strong>Call to Action:</strong> Shop Now and be the change.</p>
          </div>
        </div>

        {/* Visual Direction */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Visual Direction</h3>
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Image alt="Visual direction placeholder" className="w-12 h-12 mx-auto mb-2" />
              <p>Visual direction placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCopyVisualDirection;
