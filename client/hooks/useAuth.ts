import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth, logout } from '@/store/slices/authSlice';
import { getAuthToken } from '@/lib/cookies';

/**
 * Hook to manage authentication state
 * Automatically checks auth status on mount
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status on mount
    dispatch(checkAuth());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    token,
    isAuthenticated,
    logout: handleLogout,
  };
};

/**
 * Hook to check if user is authenticated
 * Returns true if token exists in cookies
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Verify auth status on mount
    const token = getAuthToken();
    if (token && !isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  return isAuthenticated;
};

