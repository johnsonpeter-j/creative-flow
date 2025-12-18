'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
}

export default function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setError('');
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email Input */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-semibold tracking-wide" 
          style={{ color: 'var(--color-text)', opacity: 0.85 }}
        >
          Email Address
        </label>
        <div className="relative group">
          <Mail 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10"
            style={error ? { color: '#ef4444' } : isFocused ? { color: 'var(--color-frame)', transform: 'translateY(-50%) scale(1.1)' } : { color: 'var(--color-text)', opacity: 0.5 }}
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`input-elegant w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-300 ${
              error
                ? 'border-red-300 focus:border-red-500'
                : 'border-transparent'
            }`}
            style={error ? {
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderColor: '#fca5a5',
              color: 'var(--color-text)',
            } : {
              backgroundColor: 'rgba(237, 237, 237, 0.6)',
              borderColor: isFocused ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)',
              color: 'var(--color-text)',
              boxShadow: isFocused ? '0 4px 20px rgba(198, 124, 78, 0.12)' : '0 2px 8px rgba(49, 49, 49, 0.05)',
            }}
            placeholder="name@example.com"
          />
        </div>
        <div className="min-h-[20px] mt-1">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-elegant w-full py-3.5 rounded-xl font-semibold text-base tracking-wide relative overflow-hidden"
        style={{
          backgroundColor: 'var(--color-frame)',
          color: 'var(--color-background)',
          boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
        }}
      >
        Send Reset Link
      </button>
    </form>
  );
}


