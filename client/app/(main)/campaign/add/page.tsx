'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';

type TabType = 'question' | 'result' | 'edit' | 'previews';

export default function AddCampaignPage() {
  const [activeTab, setActiveTab] = useState<TabType>('question');
  const [primaryGoal, setPrimaryGoal] = useState<string>('');
  const [adPlatform, setAdPlatform] = useState<string>('');
  const [targetBuyer, setTargetBuyer] = useState<string>('');
  const [brief, setBrief] = useState<string>('');

  const tabs = [
    { id: 'question' as TabType, label: 'Question' },
    { id: 'result' as TabType, label: 'Result' },
    { id: 'edit' as TabType, label: 'Edit' },
    { id: 'previews' as TabType, label: 'Previews' },
  ];

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id as TabType);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id as TabType);
    }
  };


  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download preview');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <nav className="flex space-x-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex-1 whitespace-nowrap py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="relative z-10">{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse opacity-20"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {/* Tab 1: Question */}
        {activeTab === 'question' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Create Your Campaign
            </h2>

            <div className="space-y-8">
              {/* Primary Goal */}
              <div>
                <label
                  htmlFor="primaryGoal"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  What is your primary goal?
                </label>
                <input
                  type="text"
                  id="primaryGoal"
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  placeholder="e.g., Awareness: Get more eyes on the brand, Conversion: Sell a specific product, Lead Gen: Get sign-ups or emails, Traffic: Send people to a website/blog"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Examples: Awareness, Conversion, Lead Gen, Traffic
                </p>
              </div>

              {/* Ad Platform */}
              <div>
                <label
                  htmlFor="adPlatform"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Where will this ad run?
                </label>
                <input
                  type="text"
                  id="adPlatform"
                  value={adPlatform}
                  onChange={(e) => setAdPlatform(e.target.value)}
                  placeholder="e.g., Instagram, LinkedIn, Google Search, Facebook, Twitter, TikTok"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Examples: Instagram, LinkedIn, Google Search, Facebook, Twitter, TikTok
                </p>
              </div>

              {/* Target Buyer */}
              <div>
                <label
                  htmlFor="targetBuyer"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Who is your target buyer?
                </label>
                <input
                  type="text"
                  id="targetBuyer"
                  value={targetBuyer}
                  onChange={(e) => setTargetBuyer(e.target.value)}
                  placeholder="e.g., Busy moms, Tech startup founders, College students"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Describe your ideal customer in a few words
                </p>
              </div>

              {/* Brief */}
              <div>
                <label
                  htmlFor="brief"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Brief
                </label>
                <textarea
                  id="brief"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Describe your campaign brief, key messages, or any specific requirements..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 resize-none"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Provide additional details about your campaign
                </p>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Result */}
        {activeTab === 'result' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Result</h2>
            <p className="text-gray-600">Result content will go here.</p>

            {/* Back and Next Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Edit */}
        {activeTab === 'edit' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit</h2>
            <p className="text-gray-600">Edit content will go here.</p>

            {/* Back and Next Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Previews */}
        {activeTab === 'previews' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Previews</h2>
            <div className="flex flex-col items-center justify-center">
              {/* Preview Image Placeholder */}
              <div className="w-full max-w-md bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 aspect-square flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                  <p className="text-sm text-gray-500">Preview Image</p>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 mb-6"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
            </div>

            {/* Back Button */}
            <div className="mt-8 flex justify-start">
              <button
                onClick={handleBack}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

