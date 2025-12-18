'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface SignupFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ 
    name: false, 
    email: false, 
    password: false, 
    confirmPassword: false 
  });
  const [errors, setErrors] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const validateName = (name: string): string => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return '';
  };

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

  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors({ ...errors, name: '' });
    }
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
    // Also clear confirm password error if passwords now match
    if (confirmPassword && value === confirmPassword && errors.confirmPassword) {
      setErrors({ ...errors, password: '', confirmPassword: '' });
    } else if (confirmPassword && value !== confirmPassword && !errors.confirmPassword) {
      setErrors({ ...errors, password: '', confirmPassword: 'Passwords do not match' });
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: '' });
    }
    // Show error if passwords don't match
    if (password && value && password !== value) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
    } else if (password && value === password) {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
    
    if (nameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }
    
    setErrors({ name: '', email: '', password: '', confirmPassword: '' });
    onSubmit(name, email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
          Full Name
        </label>
        <div className="relative group">
          <User 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10"
            style={errors.name ? { color: '#ef4444' } : isFocused.name ? { color: 'var(--color-frame)', transform: 'translateY(-50%) scale(1.1)' } : { color: 'var(--color-text)', opacity: 0.5 }}
          />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onFocus={() => setIsFocused({ ...isFocused, name: true })}
            onBlur={() => setIsFocused({ ...isFocused, name: false })}
            className={`input-elegant w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-300 ${
              errors.name
                ? 'border-red-300 focus:border-red-500'
                : 'border-transparent'
            }`}
            style={errors.name ? {
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderColor: '#fca5a5',
              color: 'var(--color-text)',
            } : {
              backgroundColor: 'rgba(237, 237, 237, 0.6)',
              borderColor: isFocused.name ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)',
              color: 'var(--color-text)',
              boxShadow: isFocused.name ? '0 4px 20px rgba(198, 124, 78, 0.12)' : '0 2px 8px rgba(49, 49, 49, 0.05)',
            }}
            placeholder="John Doe"
          />
        </div>
        <div className="min-h-[20px] mt-1">
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name}</p>
          )}
        </div>
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
            placeholder="Create a password"
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
        <div className="min-h-[20px] mt-1">
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </div>
      </div>

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative group">
          <Lock 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10"
            style={errors.confirmPassword ? { color: '#ef4444' } : isFocused.confirmPassword ? { color: 'var(--color-frame)', transform: 'translateY(-50%) scale(1.1)' } : { color: 'var(--color-text)', opacity: 0.5 }}
          />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
            onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
            className={`input-elegant w-full pl-12 pr-12 py-3.5 rounded-xl border-2 outline-none transition-all duration-300 ${
              errors.confirmPassword 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-transparent'
            }`}
            style={errors.confirmPassword ? {
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderColor: '#fca5a5',
              color: 'var(--color-text)',
            } : {
              backgroundColor: 'rgba(237, 237, 237, 0.6)',
              borderColor: isFocused.confirmPassword ? 'var(--color-frame)' : 'rgba(198, 124, 78, 0.2)',
              color: 'var(--color-text)',
              boxShadow: isFocused.confirmPassword ? '0 4px 20px rgba(198, 124, 78, 0.12)' : '0 2px 8px rgba(49, 49, 49, 0.05)',
            }}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <div className="min-h-[20px] mt-1">
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Sign Up Button */}
      <button
        type="submit"
        className="btn-elegant w-full py-3.5 rounded-xl font-semibold text-base tracking-wide relative overflow-hidden"
        style={{
          backgroundColor: 'var(--color-frame)',
          color: 'var(--color-background)',
          boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
        }}
      >
        Create Account
      </button>
    </form>
  );
}


