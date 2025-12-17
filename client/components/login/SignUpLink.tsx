'use client';

import React from 'react';

interface SignUpLinkProps {
  onSignUpClick?: () => void;
}

export default function SignUpLink({ onSignUpClick }: SignUpLinkProps) {
  return (
    <p className="text-center text-sm text-gray-600 mt-8">
      Don't have an account?{' '}
      <button
        onClick={onSignUpClick}
        className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors underline decoration-2 underline-offset-2 cursor-pointer"
      >
        Sign up for free
      </button>
    </p>
  );
}

