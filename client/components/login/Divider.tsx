import React from 'react';

export default function Divider({ text = 'OR' }: { text?: string }) {
  return (
    <div className="flex items-center my-8">
      <div className="flex-1 border-t border-gray-200"></div>
      <span className="px-4 text-sm font-medium text-gray-500 bg-white">{text}</span>
      <div className="flex-1 border-t border-gray-200"></div>
    </div>
  );
}


