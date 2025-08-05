import React from "react";
import { OnboardingFlow } from "../components/onboarding/OnboardingFlow";
import { router } from "expo-router";
import { useSubscriptionsStore } from "../utils/store";

export default function OnboardingPage() {
  const { updateUser } = useSubscriptionsStore();

  const handleOnboardingComplete = () => {
    console.log("Onboarding completed");
    
    // Mark onboarding as completed in the store
    updateUser({ hasOnboarded: true });
    
    // Navigate to home screen
    router.replace("/");
  };

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}