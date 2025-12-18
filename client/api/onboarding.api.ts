import axiosInstance from './axios';
import { showSuccessToast, showErrorToast } from '@/hooks/useToast';

export interface OnboardingRequest {
  brandName: string;
  industry: string;
  logo?: File;
  logoPosition: string;
  typography: string;
  colorPalette: string[];
}

export interface OnboardingResponse {
  message?: string;
  data?: {
    id: string;
    brandName: string;
    industry: string;
    logoUrl?: string;
    logoPosition: string;
    typography: string;
    colorPalette: string[];
  };
}

// Onboarding API
export const onboardingApi = async (data: OnboardingRequest): Promise<OnboardingResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('brandName', data.brandName);
    formData.append('industry', data.industry);
    formData.append('logoPosition', data.logoPosition);
    formData.append('typography', data.typography);
    formData.append('colorPalette', JSON.stringify(data.colorPalette));
    
    if (data.logo) {
      formData.append('logo', data.logo);
    }

    const response = await axiosInstance.post<OnboardingResponse>('/onboarding', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    showSuccessToast('Brand setup completed successfully!');
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to save brand information. Please try again.';
    showErrorToast(errorMessage);
    throw error;
  }
};

// Get onboarding data API
export const getOnboardingApi = async (): Promise<OnboardingResponse> => {
  try {
    const response = await axiosInstance.get<OnboardingResponse>('/onboarding');
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to load brand information.';
    showErrorToast(errorMessage);
    throw error;
  }
};

