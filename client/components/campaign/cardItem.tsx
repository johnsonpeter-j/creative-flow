'use client';

import { useState } from 'react';

interface CampaignCardProps {
    title: string;
    description: string;
    imagePath: string;
}

export default function CampaignCard({title,description,imagePath}:CampaignCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div 
        className="relative rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all duration-300 ease-in-out"
        style={{ 
          backgroundColor: '#f5e6dc',
          transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: isHovered ? '0 20px 40px rgba(198, 124, 78, 0.3)' : '0 10px 25px rgba(198, 124, 78, 0.15)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header Image */}
        <div className="relative h-48 overflow-hidden" style={{ backgroundColor: '#cd8b5c' }}>
          {imagePath ? (
            <img 
              src={imagePath} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
              style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
            />
          ) : (
            /* Decorative circle - mimicking the curved shape from the login */
            <div 
              className="absolute -left-32 -top-32 w-80 h-80 rounded-full transition-transform duration-500 ease-in-out" 
              style={{ 
                backgroundColor: '#b87547', 
                transform: isHovered ? 'scale(1.1)' : 'scale(1)' 
              }}
            ></div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-6 transition-colors duration-300">
          <h2 
            className="text-2xl font-semibold mb-2 transition-colors duration-300 truncate" 
            style={{ 
              color: isHovered ? '#b87547' : '#cd8b5c',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {title}
          </h2>
          <p 
            className="text-sm leading-relaxed line-clamp-2" 
            style={{ 
              color: '#a0826d',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}