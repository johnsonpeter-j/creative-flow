import { createSlice } from '@reduxjs/toolkit';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/cookies';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? getAuthToken() || null : null,
  isAuthenticated: typeof window !== 'undefined' ? !!getAuthToken() : false,
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
  },
});

export const { setToken, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;

