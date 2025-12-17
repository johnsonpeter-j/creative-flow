import { useCallback } from 'react';
import { toast, ToastOptions } from 'react-toastify';

interface ToastHook {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
}

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Standalone toast functions that can be used in API files
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

export const showWarningToast = (message: string, options?: ToastOptions) => {
  toast.warning(message, { ...defaultOptions, ...options });
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...defaultOptions, ...options });
};

// Custom hook that uses the same toast functions
export const useToast = (): ToastHook => {
  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    showSuccessToast(message, options);
  }, []);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    showErrorToast(message, options);
  }, []);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    showWarningToast(message, options);
  }, []);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    showInfoToast(message, options);
  }, []);

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  };
};

