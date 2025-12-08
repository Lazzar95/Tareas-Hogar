import React, { createContext, useContext, useState } from 'react';

interface OnboardingData {
  childrenAges: number[];
  workSituation: string;
  mentalLoadLevel: number;
  mainStressors: string[];
  supportNetwork: string;
  preferredCopingMethods: string[];
  currentMood: string;
  timeForSelf: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  totalSteps: number;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;
  
  const [data, setData] = useState<OnboardingData>({
    childrenAges: [],
    workSituation: '',
    mentalLoadLevel: 0,
    mainStressors: [],
    supportNetwork: '',
    preferredCopingMethods: [],
    currentMood: '',
    timeForSelf: ''
  });

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <OnboardingContext.Provider value={{
      data,
      updateData,
      currentStep,
      nextStep,
      prevStep,
      totalSteps
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};