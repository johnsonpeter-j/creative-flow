'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingNav from '@/components/onboarding/OnboardingNav';
import ProgressIndicator from '@/components/onboarding/ProgressIndicator';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import Step1BusinessInfo from '@/components/onboarding/Step1BusinessInfo';
import Step3DesignPreferences from '@/components/onboarding/Step3DesignPreferences';
import Step4Review from '@/components/onboarding/Step4Review';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { submitOnboarding, fetchOnboarding } from '@/store/slices/onboardingSlice';

export default function OnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.onboarding);
  
  // Zustand store for UI state
  const {
    formData,
    currentStep,
    errors,
    updateFormData,
    setCurrentStep,
    setErrors,
  } = useOnboardingStore();
  
  const totalSteps = 3;

  // Fetch existing onboarding data on mount
  useEffect(() => {
    dispatch(fetchOnboarding());
  }, [dispatch]);

  // Redirect on success
  useEffect(() => {
    if (success) {
      router.push('/dashboard');
    }
  }, [success, router]);

  const validateStep1 = (): boolean => {
    const stepErrors: Record<string, string> = {};
    
    // Only validate format if value is provided (all fields are optional)
    if (formData.businessName.trim() && formData.businessName.trim().length < 2) {
      stepErrors.businessName = 'Business name must be at least 2 characters';
    }

    setErrors({ ...errors, step1: stepErrors });
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const stepErrors: Record<string, string> = {};
    
    // Only validate format if value is provided (all fields are optional)
    if (formData.fontType === 'google' && formData.fontValue.trim() && 
        !formData.fontValue.includes('fonts.googleapis.com') && 
        !formData.fontValue.includes('@import')) {
      stepErrors.fontValue = 'Please provide a valid Google Fonts embedded code';
    }

    setErrors({ ...errors, step2: stepErrors });
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Build typography value based on font type
    let typography = '';
    if (formData.fontType === 'google') {
      typography = formData.fontValue;
    } else if (formData.fontType === 'dropdown') {
      typography = formData.fontValue;
    }
    // For upload, typography can be empty or contain font file name
    
    // Dispatch Redux thunk for API call
    await dispatch(submitOnboarding({
      brandName: formData.businessName,
      industry: formData.industry,
      logo: formData.logo || undefined,
      logoPosition: formData.logoPosition,
      typography: typography,
      fontType: formData.fontType,
      fontFile: formData.fontFile || undefined,
      colorPalette: [formData.colors.primary, formData.colors.secondary, formData.colors.background, formData.colors.text],
      addressLine1: formData.addressLine1 || undefined,
      addressLine2: formData.addressLine2 || undefined,
      city: formData.city || undefined,
      zip: formData.zip || undefined,
      businessAddressType: formData.businessAddressType || undefined,
      businessType: formData.businessType || undefined,
    }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Business Information';
      case 2:
        return 'Design preferences';
      case 3:
        return 'Review & complete';
      default:
        return 'Onboarding';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return 'Creative Flow collects this information to better understand and serve your business.';
      case 2:
        return 'Customize your design preferences to match your brand identity.';
      case 3:
        return 'Review all information before completing your setup.';
      default:
        return '';
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            width: '400px',
            height: '400px',
            left: '-100px',
            bottom: '-100px',
            backgroundColor: 'rgba(198, 124, 78, 0.08)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            transform: 'rotate(-45deg)',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '350px',
            height: '350px',
            right: '-80px',
            top: '-80px',
            backgroundColor: 'rgba(198, 124, 78, 0.06)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'rotate(45deg)',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '300px',
            height: '300px',
            right: '10%',
            bottom: '10%',
            backgroundColor: 'rgba(237, 214, 200, 0.4)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            transform: 'rotate(20deg)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <div className="w-full max-w-4xl mx-auto px-6 pt-8">
          <OnboardingNav />
        </div>

        {/* Progress Indicator */}
        <div className="w-full px-6">
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Form Card */}
        <div className="flex-1 flex items-start justify-center px-6 pb-12">
          <div 
            className="w-full max-w-2xl rounded-2xl p-8 relative z-10"
            style={{ 
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 24px rgba(49, 49, 49, 0.08)',
            }}
          >
            <OnboardingHeader 
              title={getStepTitle()}
              subtitle={getStepSubtitle()}
            />
            
            {/* Step Content */}
            <div style={{ marginBottom: '32px' }}>
              {currentStep === 1 && (
                <Step1BusinessInfo
                  data={{
                    businessName: formData.businessName,
                    logo: formData.logo,
                    logoPreview: formData.logoPreview,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    city: formData.city,
                    zip: formData.zip,
                    industry: formData.industry,
                    businessAddressType: formData.businessAddressType,
                    businessType: formData.businessType,
                  }}
                  onChange={(data) => updateFormData(data)}
                  errors={errors.step1}
                />
              )}
              
              {currentStep === 2 && (
                <Step3DesignPreferences
                  data={{
                    logoPosition: formData.logoPosition,
                    fontType: formData.fontType,
                    fontValue: formData.fontValue,
                    fontFile: formData.fontFile,
                    colors: formData.colors,
                  }}
                  onChange={(data) => updateFormData(data)}
                  errors={errors.step2}
                />
              )}
              
              {currentStep === 3 && (
                <Step4Review data={{
                  businessName: formData.businessName,
                  logoPreview: formData.logoPreview,
                  addressLine1: formData.addressLine1,
                  addressLine2: formData.addressLine2,
                  city: formData.city,
                  zip: formData.zip,
                  industry: formData.industry,
                  logoPosition: formData.logoPosition,
                  fontType: formData.fontType,
                  fontValue: formData.fontValue,
                  fontFile: formData.fontFile,
                  colors: formData.colors,
                }} />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="rounded-lg transition-all duration-300"
                  style={{
                    padding: '14px 24px',
                    fontSize: 'clamp(13px, 1.1vw + 0.5rem, 14px)',
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontWeight: 400,
                    backgroundColor: 'transparent',
                    color: 'rgba(49, 49, 49, 0.7)',
                    border: '2px solid rgba(198, 124, 78, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(198, 124, 78, 0.05)';
                    e.currentTarget.style.borderColor = 'var(--color-frame)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(198, 124, 78, 0.2)';
                  }}
                >
                  ← Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 ml-auto"
                  style={{
                    padding: '14px 24px',
                    fontSize: 'clamp(13px, 1.1vw + 0.5rem, 14px)',
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontWeight: 400,
                    backgroundColor: 'var(--color-frame)',
                    color: 'rgba(237, 237, 237, 0.95)',
                    boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(198, 124, 78, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(198, 124, 78, 0.25)';
                  }}
                >
                  Continue
                  <span style={{ fontSize: '16px' }}>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={loading}
                  className="rounded-lg relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 ml-auto"
                  style={{
                    padding: '14px 24px',
                    fontSize: 'clamp(13px, 1.1vw + 0.5rem, 14px)',
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontWeight: 400,
                    backgroundColor: loading ? 'rgba(198, 124, 78, 0.5)' : 'var(--color-frame)',
                    color: 'rgba(237, 237, 237, 0.95)',
                    boxShadow: '0 4px 16px rgba(198, 124, 78, 0.25)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(198, 124, 78, 0.35)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(198, 124, 78, 0.25)';
                    }
                  }}
                >
                  {loading ? 'Submitting...' : 'Complete Setup'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

