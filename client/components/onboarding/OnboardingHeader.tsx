import React from 'react';
import { Sparkles } from 'lucide-react';

export default function OnboardingHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg transform transition-transform hover:scale-105">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Welcome to Creative Flow
      </h1>
      <p className="text-gray-600 mt-2 text-sm">Let's set up your brand to create amazing advertising creatives.</p>
    </div>
  );
}

