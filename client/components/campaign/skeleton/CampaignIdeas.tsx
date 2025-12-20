'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { CampaignIdea } from '@/api/campaign.api';

interface CampaignIdeasProps {
  selectedIdea: number | null;
  setSelectedIdea: (id: number | null) => void;
  campaignIdeas: CampaignIdea[];
  loading: boolean;
}

const CampaignIdeas: React.FC<CampaignIdeasProps> = ({ 
  selectedIdea, 
  setSelectedIdea, 
  campaignIdeas,
  loading 
}) => {
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-frame)] mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Campaign Ideas...</h2>
          <p className="text-gray-500">Our Creative Team and Creative Director are working on your campaign ideas.</p>
          <p className="text-sm text-gray-400 mt-2">This may take up to 2 minutes...</p>
        </div>
      </div>
    );
  }

  if (!campaignIdeas || campaignIdeas.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Ideas Generated</h2>
          <p className="text-gray-500">Failed to generate campaign ideas. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Campaign Idea</h2>
        <p className="text-gray-500">Select one of the top 3 campaign ideas generated for you by our AI agents.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {campaignIdeas.map((idea, index) => (
          <div
            key={index}
            onClick={() => setSelectedIdea(index)}
            className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
              selectedIdea === index
                ? 'bg-white shadow-2xl transform -translate-y-2 border-2 border-[var(--color-frame)]'
                : 'bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 border-2 border-transparent'
            }`}
          >
            {selectedIdea === index && (
              <div className="absolute top-4 right-4 bg-[var(--color-frame)] text-white rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">Score: {idea.score.toFixed(1)}/10</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{idea.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
            {idea.reasoning && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">{idea.reasoning}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignIdeas;
