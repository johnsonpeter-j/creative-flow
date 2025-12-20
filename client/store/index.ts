import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer from './slices/onboardingSlice';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    auth: authReducer,
    profile: profileReducer,
  },
  // Redux Toolkit's configureStore already includes thunk middleware by default
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

