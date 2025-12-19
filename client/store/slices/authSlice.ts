import { createSlice } from '@reduxjs/toolkit';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/cookies';
import {
  forgotPasswordThunk,
  resetPasswordThunk,
  verifyTokenThunk,
  logoutThunk,
} from './authThunk';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? getAuthToken() || null : null,
  isAuthenticated: typeof window !== 'undefined' ? !!getAuthToken() : false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      
      if (typeof window !== 'undefined') {
        if (action.payload) {
          setAuthToken(action.payload);
        } else {
          removeAuthToken();
        }
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      
      if (typeof window !== 'undefined') {
        removeAuthToken();
      }
    },
    checkAuth: (state) => {
      // Check if token exists in cookies and update state
      if (typeof window !== 'undefined') {
        const token = getAuthToken();
        state.token = token || null;
        state.isAuthenticated = !!token;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    // Forgot Password
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send reset link';
      });

    // Reset Password
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reset password';
      });

    // Verify Token
    builder
      .addCase(verifyTokenThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTokenThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(verifyTokenThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload || 'Token verification failed';
      });

    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.loading = false;
        // Even if logout fails, clear the state
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { setToken, logout, checkAuth, clearError } = authSlice.actions;
export default authSlice.reducer;

