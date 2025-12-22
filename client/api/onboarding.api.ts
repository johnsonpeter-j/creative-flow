import axiosInstance from './axios';
import { showSuccessToast, showErrorToast } from '@/hooks/useToast';

export interface OnboardingRequest {
  brandName: string;
  industry: string;
  logo?: File;
  logoPosition: string;
  typography: string;
  fontType?: 'dropdown' | 'google' | 'upload';
  fontFile?: File;
  colorPalette: string[];
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  zip?: string;
  businessAddressType?: string;
  businessType?: string;
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
    fontType?: string;
    fontFileUrl?: string;
    colorPalette: string[];
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    zip?: string;
    businessAddressType?: string;
    businessType?: string;
  };
}

// Onboarding API
export const onboardingApi = async (data: OnboardingRequest): Promise<OnboardingResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('brand_name', data.brandName);
    formData.append('industry', data.industry);
    formData.append('logo_position', data.logoPosition);
    formData.append('typography', data.typography);
    formData.append('color_palette', JSON.stringify(data.colorPalette));
    
    if (data.fontType) {
      formData.append('font_type', data.fontType);
    }
    
    if (data.addressLine1) {
      formData.append('address_line1', data.addressLine1);
    }
    if (data.addressLine2) {
      formData.append('address_line2', data.addressLine2);
    }
    if (data.city) {
      formData.append('city', data.city);
    }
    if (data.zip) {
      formData.append('zip', data.zip);
    }
    if (data.businessAddressType) {
      formData.append('business_address_type', data.businessAddressType);
    }
    if (data.businessType) {
      formData.append('business_type', data.businessType);
    }
    
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    
    if (data.fontFile) {
      formData.append('font_file', data.fontFile);
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


