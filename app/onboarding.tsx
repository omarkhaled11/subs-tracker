import React from "react";
import { OnboardingFlow } from "../components/onboarding/OnboardingFlow";
import { router } from "expo-router";
import { Currency } from "../utils/types";

export default function OnboardingPage() {
  const handleOnboardingComplete = (data: {
    currency: Currency;
    notificationsEnabled: boolean;
    reminderDays?: number;
  }) => {
    console.log("Onboarding completed with data:", data);
    // For now, just navigate to home
    router.replace("/");
  };

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}