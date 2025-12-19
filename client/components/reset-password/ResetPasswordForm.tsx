'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface ResetPasswordFormProps {
  onSubmit: (password: string) => void;
  loading?: boolean;
}

export default function ResetPasswordForm({ onSubmit, loading = false }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ password: false, confirmPassword: false });
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });

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
    
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
    
    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }
    
    setErrors({ password: '', confirmPassword: '' });
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Password Input */}
      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-semibold tracking-wide" 
          style={{ color: 'var(--color-text)', opacity: 0.85 }}
        >
          New Password
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
            placeholder="Enter new password"
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
      <div >
        <label 
          htmlFor="confirmPassword" 
          className="block text-sm font-semibold tracking-wide mb-2" 
          style={{ color: 'var(--color-text)', opacity: 0.85 }}
        >
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
            placeholder="Confirm new password"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-elegant w-full py-3.5 rounded-xl font-semibold text-base tracking-wide relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-frame)',
          color: 'var(--color-background)',
          boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
        }}
      >
        {loading ? 'Resetting Password...' : 'Reset Password'}
      </button>
    </form>
  );
}

