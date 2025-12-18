'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginApi, signupApi, LoginRequest, SignupRequest } from '@/api/auth.api';
import '@/components/ui/Loading.css';
import './SlidingAuthForm.css';

interface SlidingAuthFormProps {
  initialActive?: boolean;
}

export default function SlidingAuthForm({ initialActive = false }: SlidingAuthFormProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(initialActive);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });
  const [isLoginFocused, setIsLoginFocused] = useState({ email: false, password: false });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupErrors, setSignupErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isSignupFocused, setIsSignupFocused] = useState({ name: false, email: false, password: false, confirmPassword: false });
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password.length > 72) return 'Password must be less than 72 characters';
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const validateName = (name: string): string => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(loginEmail);
    const passwordError = validatePassword(loginPassword);
    
    if (emailError || passwordError) {
      setLoginErrors({ email: emailError, password: passwordError });
      return;
    }
    
    setLoginErrors({ email: '', password: '' });
    setIsLoginLoading(true);
    try {
      await loginApi({ email: loginEmail, password: loginPassword } as LoginRequest);
      router.push('/onboarding');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateName(signupName);
    const emailError = validateEmail(signupEmail);
    const passwordError = validatePassword(signupPassword);
    const confirmPasswordError = validateConfirmPassword(signupPassword, signupConfirmPassword);
    
    if (nameError || emailError || passwordError || confirmPasswordError) {
      setSignupErrors({ 
        name: nameError, 
        email: emailError, 
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      return;
    }
    
    setSignupErrors({ name: '', email: '', password: '', confirmPassword: '' });
    setIsSignupLoading(true);
    try {
      await signupApi({ name: signupName, email: signupEmail, password: signupPassword } as SignupRequest);
      router.push('/onboarding');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsSignupLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'transparent' }}>
      <div className={`auth-container ${isActive ? 'active' : ''}`}>
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
            <h1>Login</h1>
            <div className="input-box" style={{ marginTop: '0' }}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  if (loginErrors.email) setLoginErrors({ ...loginErrors, email: '' });
                }}
                onFocus={() => setIsLoginFocused({ ...isLoginFocused, email: true })}
                onBlur={() => setIsLoginFocused({ ...isLoginFocused, email: false })}
                required
              />
              <Mail className="input-icon" />
            </div>
            {loginErrors.email && <span className="error-text">{loginErrors.email}</span>}
            
            <div className="input-box">
              <input
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  if (loginErrors.password) setLoginErrors({ ...loginErrors, password: '' });
                }}
                onFocus={() => setIsLoginFocused({ ...isLoginFocused, password: true })}
                onBlur={() => setIsLoginFocused({ ...isLoginFocused, password: false })}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? <EyeOff className="input-icon" /> : <Eye className="input-icon" />}
              </button>
            </div>
            {loginErrors.password && <span className="error-text">{loginErrors.password}</span>}
            
            <div className="forgot-link">
              <a href="#" onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                Forgot Password?
              </a>
            </div>
            <div style={{ marginTop: '38px' }}>
              <button type="submit" className="btn" disabled={isLoginLoading}>
              {isLoginLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
                  <div className="ai-processing-loader" style={{ width: '20px', height: '20px', margin: 0 }}>
                    <div className="inner one"></div>
                    <div className="inner two"></div>
                    <div className="inner three"></div>
                  </div>
                        <span style={{ fontSize: 'clamp(11px, 0.95vw + 0.5rem, 12px)' }}>Processing...</span>
                </div>
              ) : (
                'Login'
              )}
              </button>
            </div>
          </form>
        </div>

        {/* Signup Form */}
        <div className="form-box register">
          <form onSubmit={handleSignupSubmit} style={{ width: '100%' }}>
            <h1>Registration</h1>
            <div className="input-box" style={{ marginTop: '0' }}>
              <input
                type="text"
                placeholder="Name"
                value={signupName}
                onChange={(e) => {
                  setSignupName(e.target.value);
                  if (signupErrors.name) setSignupErrors({ ...signupErrors, name: '' });
                }}
                onFocus={() => setIsSignupFocused({ ...isSignupFocused, name: true })}
                onBlur={() => setIsSignupFocused({ ...isSignupFocused, name: false })}
                required
              />
              <User className="input-icon" />
            </div>
            {signupErrors.name && <span className="error-text">{signupErrors.name}</span>}
            
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => {
                  setSignupEmail(e.target.value);
                  if (signupErrors.email) setSignupErrors({ ...signupErrors, email: '' });
                }}
                onFocus={() => setIsSignupFocused({ ...isSignupFocused, email: true })}
                onBlur={() => setIsSignupFocused({ ...isSignupFocused, email: false })}
                required
              />
              <Mail className="input-icon" />
            </div>
            {signupErrors.email && <span className="error-text">{signupErrors.email}</span>}
            
            <div className="input-box">
              <input
                type={showSignupPassword ? 'text' : 'password'}
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => {
                  setSignupPassword(e.target.value);
                  if (signupErrors.password) setSignupErrors({ ...signupErrors, password: '' });
                  // Clear confirm password error if passwords match
                  if (signupErrors.confirmPassword && e.target.value === signupConfirmPassword) {
                    setSignupErrors({ ...signupErrors, confirmPassword: '' });
                  }
                }}
                onFocus={() => setIsSignupFocused({ ...isSignupFocused, password: true })}
                onBlur={() => setIsSignupFocused({ ...isSignupFocused, password: false })}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              >
                {showSignupPassword ? <EyeOff className="input-icon" /> : <Eye className="input-icon" />}
              </button>
            </div>
            {signupErrors.password && <span className="error-text">{signupErrors.password}</span>}
            
            <div className="input-box">
              <input
                type={showSignupConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={signupConfirmPassword}
                onChange={(e) => {
                  setSignupConfirmPassword(e.target.value);
                  if (signupErrors.confirmPassword) setSignupErrors({ ...signupErrors, confirmPassword: '' });
                }}
                onFocus={() => setIsSignupFocused({ ...isSignupFocused, confirmPassword: true })}
                onBlur={() => setIsSignupFocused({ ...isSignupFocused, confirmPassword: false })}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
              >
                {showSignupConfirmPassword ? <EyeOff className="input-icon" /> : <Eye className="input-icon" />}
              </button>
            </div>
            {signupErrors.confirmPassword && <span className="error-text">{signupErrors.confirmPassword}</span>}
            
            <div style={{ marginTop: '38px' }}>
              <button type="submit" className="btn" disabled={isSignupLoading}>
              {isSignupLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
                  <div className="ai-processing-loader" style={{ width: '20px', height: '20px', margin: 0 }}>
                    <div className="inner one"></div>
                    <div className="inner two"></div>
                    <div className="inner three"></div>
                  </div>
                        <span style={{ fontSize: 'clamp(11px, 0.95vw + 0.5rem, 12px)' }}>Processing...</span>
                </div>
              ) : (
                'Register'
              )}
              </button>
            </div>
          </form>
        </div>

        {/* Toggle Box */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="btn register-btn" onClick={() => setIsActive(true)}>
              Register
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="btn login-btn" onClick={() => setIsActive(false)}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


