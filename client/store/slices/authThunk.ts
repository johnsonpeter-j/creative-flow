import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  resetPasswordApi,
  verifyTokenApi,
  logoutApi,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
} from '@/api/auth.api';
import { setToken, logout } from './authSlice';
import { showSuccessToast, showErrorToast } from '@/hooks/useToast';

// Forgot Password Thunk
export const forgotPasswordThunk = createAsyncThunk<
  { message: string },
  ForgotPasswordRequest,
  { rejectValue: string }
>(
  'auth/forgotPassword',
  async (forgotPasswordData, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi(forgotPasswordData);
      showSuccessToast('Password reset link has been sent to your email!');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link. Please try again.';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Reset Password Thunk
export const resetPasswordThunk = createAsyncThunk<
  { message: string },
  ResetPasswordRequest,
  { rejectValue: string }
>(
  'auth/resetPassword',
  async (resetPasswordData, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(resetPasswordData);
      showSuccessToast('Password reset successfully!');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Verify Token Thunk
export const verifyTokenThunk = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>(
  'auth/verifyToken',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await verifyTokenApi();
      
      if (response.token) {
        dispatch(setToken(response.token));
      }
      
      return response;
    } catch (error: any) {
      // If verification fails, clear auth state
      dispatch(logout());
      const errorMessage = error.response?.data?.message || 'Token verification failed.';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Logout Thunk
export const logoutThunk = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await logoutApi();
      dispatch(logout());
      showSuccessToast('Logged out successfully!');
      return { message: 'Logged out successfully' };
    } catch (error: any) {
      // Even if API call fails, clear auth state
      dispatch(logout());
      const errorMessage = error.response?.data?.message || 'Logout failed.';
      // Don't show error toast on logout failure since we still clear the state
      return rejectWithValue(errorMessage);
    }
  }
);


