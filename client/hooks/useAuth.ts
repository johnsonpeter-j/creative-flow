import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth, logout as logoutAction } from '@/store/slices/authSlice';
import { getAuthToken } from '@/lib/cookies';
import { useRouter } from 'next/navigation';

/**
 * Hook to manage authentication state
 * Automatically checks auth status on mount
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status on mount
    if (typeof window !== 'undefined') {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  const logout = () => {
    if (typeof window !== 'undefined') {
      dispatch(logoutAction());
      router.push('/');
    }
  };

  return {
    token,
    isAuthenticated,
    logout,
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
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      if (token && !isAuthenticated) {
        dispatch(checkAuth());
      }
    }
  }, [dispatch, isAuthenticated]);

  return isAuthenticated;
};
