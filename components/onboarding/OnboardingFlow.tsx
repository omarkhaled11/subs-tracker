import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { WelcomeScreen } from "./WelcomeScreen";
import { CurrencySetupScreen } from "./CurrencySetupScreen";
import { NotificationSetupScreen } from "./NotificationSetupScreen";
import { ReadyScreen } from "./ReadyScreen";
import { Currency } from "../../utils/types";

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingFlowProps {
  onComplete: (data: {
    currency: Currency;
    notificationsEnabled: boolean;
    reminderDays?: number;
  }) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  const [onboardingData, setOnboardingData] = useState({
    currency: "USD" as Currency,
    notificationsEnabled: false,
    reminderDays: undefined as number | undefined,
  });

  const animateToNext = () => {
    const nextScreen = currentScreen + 1;
    
    Animated.timing(slideAnim, {
      toValue: -nextScreen * screenWidth,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreen(nextScreen);
    });
  };

  const handleWelcomeContinue = () => {
    animateToNext();
  };

  const handleCurrencySetup = (currency: Currency) => {
    setOnboardingData(prev => ({ ...prev, currency }));
    animateToNext();
  };

  const handleNotificationSetup = (notificationsEnabled: boolean, reminderDays?: number) => {
    setOnboardingData(prev => ({ 
      ...prev, 
      notificationsEnabled, 
      reminderDays 
    }));
    animateToNext();
  };

  const handleFinish = () => {
    onComplete(onboardingData);
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.screensContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.screen}>
          <WelcomeScreen onContinue={handleWelcomeContinue} />
        </View>
        <View style={styles.screen}>
          <CurrencySetupScreen onContinue={handleCurrencySetup} />
        </View>
        <View style={styles.screen}>
          <NotificationSetupScreen onContinue={handleNotificationSetup} />
        </View>
        <View style={styles.screen}>
          <ReadyScreen onFinish={handleFinish} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  screensContainer: {
    flex: 1,
    flexDirection: 'row',
    width: screenWidth * 4, // 4 screens total
  },
  screen: {
    width: screenWidth,
    flex: 1,
  },
});