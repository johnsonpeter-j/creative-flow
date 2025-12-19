'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CampaignIdeasProps {
  selectedIdea: number | null;
  setSelectedIdea: (id: number | null) => void;
}

const campaignIdeas = [
  {
    id: 1,
    title: 'Eco-Warriors Unite',
    description: 'A campaign focused on sustainability and the eco-friendly aspects of your sneakers. Highlight the recycled materials and your commitment to the planet.',
  },
  {
    id: 2,
    title: 'Urban Explorer',
    description: 'A campaign targeting city dwellers who value both style and comfort. Showcase the sneakers in various urban settings, from commuting to a night out.',
  },
  {
    id: 3,
    title: 'The Minimalist\'s Choice',
    description: 'A campaign that emphasizes the clean design and versatility of the sneakers. Perfect for those who appreciate a minimalist aesthetic and a "buy less, buy better" philosophy.',
  },
];

const CampaignIdeas: React.FC<CampaignIdeasProps> = ({ selectedIdea, setSelectedIdea }) => {
  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Campaign Idea</h2>
        <p className="text-gray-500">Select one of the three campaign ideas generated for you.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {campaignIdeas.map((idea) => (
          <div
            key={idea.id}
            onClick={() => setSelectedIdea(idea.id)}
            className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
              selectedIdea === idea.id
                ? 'bg-white shadow-2xl transform -translate-y-2 border-2 border-[var(--color-frame)]'
                : 'bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 border-2 border-transparent'
            }`}
          >
            {selectedIdea === idea.id && (
              <div className="absolute top-4 right-4 bg-[var(--color-frame)] text-white rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 mb-3">{idea.title}</h3>
            <p className="text-sm text-gray-600">{idea.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignIdeas;
