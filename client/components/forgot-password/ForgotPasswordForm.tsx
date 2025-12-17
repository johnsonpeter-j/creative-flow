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
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
          Email Address
        </label>
        <div className="relative group">
          <Mail 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
              error 
                ? 'text-red-500' 
                : isFocused 
                  ? 'text-indigo-600' 
                  : 'text-gray-400 group-hover:text-gray-600'
            }`} 
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 ${
              error
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
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
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Send Reset Link
      </button>
    </form>
  );
}


