import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { onboardingApi, getOnboardingApi, OnboardingRequest, OnboardingResponse } from '@/api/onboarding.api';

interface OnboardingState {
  data: OnboardingResponse['data'] | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OnboardingState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunk for submitting onboarding data
export const submitOnboarding = createAsyncThunk(
  'onboarding/submit',
  async (data: OnboardingRequest, { rejectWithValue }) => {
    try {
      const response = await onboardingApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit onboarding data');
    }
  }
);

// Async thunk for fetching onboarding data
export const fetchOnboarding = createAsyncThunk(
  'onboarding/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOnboardingApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch onboarding data');
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetOnboarding: (state) => {
      state.data = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit onboarding
      .addCase(submitOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload.data || null;
        state.error = null;
      })
      .addCase(submitOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Fetch onboarding
      .addCase(fetchOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || null;
        state.error = null;
      })
      .addCase(fetchOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;

