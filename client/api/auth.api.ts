import axiosInstance from './axios';
import { showSuccessToast, showErrorToast } from '@/hooks/useToast';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  message?: string;
}

// Login API
export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
    
    if (response.data.token) {
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
      }
      showSuccessToast('Login successful!');
    }
    
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
    showErrorToast(errorMessage);
    throw error;
  }
};

// Signup API
export const signupApi = async (data: SignupRequest): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/signup', data);
    showSuccessToast('Account created successfully!');
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
    showErrorToast(errorMessage);
    throw error;
  }
};

// Forgot Password API
export const forgotPasswordApi = async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post<{ message: string }>('/auth/forgot-password', data);
    showSuccessToast('Password reset link has been sent to your email!');
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to send reset link. Please try again.';
    showErrorToast(errorMessage);
    throw error;
  }
};

// Reset Password API
export const resetPasswordApi = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post<{ message: string }>('/auth/reset-password', data);
    showSuccessToast('Password reset successfully!');
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
    showErrorToast(errorMessage);
    throw error;
  }
};

// Logout API
export const logoutApi = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    showSuccessToast('Logged out successfully!');
  } catch (error: any) {
    // Even if API call fails, clear local token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    const errorMessage = error.response?.data?.message || 'Logout failed.';
    showErrorToast(errorMessage);
    throw error;
  }
};

// Verify Token API
export const verifyTokenApi = async (): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.get<AuthResponse>('/auth/verify');
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Token verification failed.';
    showErrorToast(errorMessage);
    throw error;
  }
};

