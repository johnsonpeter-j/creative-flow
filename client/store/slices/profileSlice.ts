import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfileApi, updateProfileApi, ProfileRequest, ProfileResponse } from '@/api/profile.api';
import { showSuccessToast, showErrorToast } from '@/hooks/useToast';

interface ProfileState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunk for fetching profile data
export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileApi();
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile data';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating profile data
export const updateProfile = createAsyncThunk(
  'profile/update',
  async (data: ProfileRequest, { rejectWithValue }) => {
    try {
      const response = await updateProfileApi(data);
      showSuccessToast('Profile updated successfully!');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess } = profileSlice.actions;
export default profileSlice.reducer;

