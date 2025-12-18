import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingFormData {
  // Step 1 - Business Information
  businessName: string;
  logo: File | null;
  logoPreview: string | null;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zip: string;
  industry: string;
  businessAddressType: string; // 'registered' | 'operating'
  businessType: string; // 'sole' | 'partnership' | 'llc' | 'corporation'
  
  // Step 2 - Design Preferences
  logoPosition: string;
  fontType: 'dropdown' | 'google' | 'upload';
  fontValue: string;
  fontFile: File | null;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

interface OnboardingStore {
  formData: OnboardingFormData;
  currentStep: number;
  errors: Record<string, Record<string, string>>;
  
  // Actions
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  setCurrentStep: (step: number) => void;
  setErrors: (errors: Record<string, Record<string, string>>) => void;
  resetForm: () => void;
}

const initialFormData: OnboardingFormData = {
  businessName: '',
  logo: null,
  logoPreview: null,
  addressLine1: '',
  addressLine2: '',
  city: '',
  zip: '',
  industry: '',
  businessAddressType: '',
  businessType: '',
  logoPosition: 'Top Left',
  fontType: 'dropdown',
  fontValue: '',
  fontFile: null,
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#111827',
  },
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      currentStep: 1,
      errors: {
        step1: {},
        step2: {},
      },
      
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      
      setCurrentStep: (step) =>
        set({ currentStep: step }),
      
      setErrors: (errors) =>
        set({ errors }),
      
      resetForm: () =>
        set({
          formData: initialFormData,
          currentStep: 1,
          errors: {
            step1: {},
            step2: {},
          },
        }),
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        formData: {
          ...state.formData,
          logo: null, // Don't persist File objects
          fontFile: null, // Don't persist File objects
        },
        currentStep: state.currentStep,
      }),
    }
  )
);

