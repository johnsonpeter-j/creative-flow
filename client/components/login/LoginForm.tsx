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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className="block font-semibold tracking-wide" 
          style={{ 
            color: 'var(--color-text)', 
            opacity: 0.85,
            fontSize: 'clamp(11px, 1vw + 0.5rem, 13px)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          Email Address
        </label>
        <div className="relative group">
          <Mail 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10"
            style={errors.email ? { color: '#ef4444' } : isFocused.email ? { color: 'var(--color-frame)', transform: 'translateY(-50%) scale(1.1)' } : { color: 'var(--color-text)', opacity: 0.5 }}
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onFocus={() => setIsFocused({ ...isFocused, email: true })}
            onBlur={() => setIsFocused({ ...isFocused, email: false })}
            className={`input-elegant w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-300 ${
              errors.email
                ? 'border-red-300 focus:border-red-500'
                : 'border-transparent'
            }`}
            style={errors.email ? {
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderColor: '#fca5a5',
              color: 'var(--color-text)',
            } : {
              backgroundColor: 'rgba(237, 237, 237, 0.6)',
              borderColor: isFocused.email ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)',
              color: 'var(--color-text)',
              boxShadow: isFocused.email ? '0 4px 20px rgba(198, 124, 78, 0.12)' : '0 2px 8px rgba(49, 49, 49, 0.05)',
            }}
            placeholder="name@example.com"
          />
        </div>
        <div className="min-h-[20px] mt-1.5">
          {errors.email && (
            <p className="text-red-500 animate-slide-in" style={{ 
              fontWeight: 500,
              fontSize: 'clamp(11px, 1vw + 0.5rem, 12px)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label 
          htmlFor="password" 
          className="block text-sm font-semibold tracking-wide" 
          style={{ color: 'var(--color-text)', opacity: 0.85 }}
        >
          Password
        </label>
        <div className="relative group">
          <Lock 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10"
            style={errors.password ? { color: '#ef4444' } : isFocused.password ? { color: 'var(--color-frame)', transform: 'translateY(-50%) scale(1.1)' } : { color: 'var(--color-text)', opacity: 0.5 }}
          />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            onFocus={() => setIsFocused({ ...isFocused, password: true })}
            onBlur={() => setIsFocused({ ...isFocused, password: false })}
            className={`input-elegant w-full pl-12 pr-12 py-3.5 rounded-xl border-2 outline-none transition-all duration-300 ${
              errors.password
                ? 'border-red-300 focus:border-red-500'
                : 'border-transparent'
            }`}
            style={errors.password ? {
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderColor: '#fca5a5',
              color: 'var(--color-text)',
            } : {
              backgroundColor: 'rgba(237, 237, 237, 0.6)',
              borderColor: isFocused.password ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)',
              color: 'var(--color-text)',
              boxShadow: isFocused.password ? '0 4px 20px rgba(198, 124, 78, 0.12)' : '0 2px 8px rgba(49, 49, 49, 0.05)',
            }}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 p-1 rounded-lg hover:bg-white/50"
            style={{ color: 'var(--color-text)', opacity: 0.5 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.5';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <div className="min-h-[20px] mt-1.5">
          {errors.password && (
            <p className="text-red-500 animate-slide-in" style={{ 
              fontWeight: 500,
              fontSize: 'clamp(11px, 1vw + 0.5rem, 12px)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}>
              {errors.password}
            </p>
          )}
        </div>
      </div>

      {/* Forgot Password */}
      <div className="flex items-center justify-end -mt-2">
        <button
          type="button"
          className="font-semibold transition-all duration-200 cursor-pointer hover:underline"
          style={{ color: 'var(--color-frame)' }}
          onClick={onForgotPasswordClick || (() => console.log('Forgot password clicked'))}
        >
          Forgot Password?
        </button>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        className="btn-elegant w-full py-3.5 rounded-xl font-semibold text-base tracking-wide relative overflow-hidden"
        style={{ 
          backgroundColor: 'var(--color-frame)',
          color: 'var(--color-background)',
          boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
        }}
      >
        <span className="relative z-10">Sign In</span>
      </button>
    </form>
  );
}

