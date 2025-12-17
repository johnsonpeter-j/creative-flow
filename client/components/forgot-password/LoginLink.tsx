'use client';

import React from 'react';

interface LoginLinkProps {
  onLoginClick?: () => void;
}

export default function LoginLink({ onLoginClick }: LoginLinkProps) {
  return (
    <p className="text-center text-sm text-gray-600 mt-8">
      Remember your password?{' '}
      <button
        onClick={onLoginClick}
        className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors underline decoration-2 underline-offset-2 cursor-pointer"
      >
        Sign in
      </button>
    </p>
  );
}


