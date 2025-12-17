'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onForgotPasswordClick?: () => void;
}

export default function LoginForm({ onSubmit, onForgotPasswordClick }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({ email: '', password: '' });

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

  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }
    
    setErrors({ email: '', password: '' });
    onSubmit(email, password);
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
              errors.email 
                ? 'text-red-500' 
                : isFocused.email 
                  ? 'text-indigo-600' 
                  : 'text-gray-400 group-hover:text-gray-600'
            }`} 
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onFocus={() => setIsFocused({ ...isFocused, email: true })}
            onBlur={() => setIsFocused({ ...isFocused, email: false })}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 ${
              errors.email
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="name@example.com"
          />
        </div>
        <div className="min-h-[20px] mt-1">
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative group">
          <Lock 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
              errors.password 
                ? 'text-red-500' 
                : isFocused.password 
                  ? 'text-indigo-600' 
                  : 'text-gray-400 group-hover:text-gray-600'
            }`} 
          />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            onFocus={() => setIsFocused({ ...isFocused, password: true })}
            onBlur={() => setIsFocused({ ...isFocused, password: false })}
            className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 ${
              errors.password
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <div className="min-h-[20px] mt-1">
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </div>
      </div>

      {/* Forgot Password */}
      <div className="flex items-center justify-end pb-2">
        <button
          type="button"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors cursor-pointer"
          onClick={onForgotPasswordClick || (() => console.log('Forgot password clicked'))}
        >
          Forgot Password?
        </button>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Sign In
      </button>
    </form>
  );
}

