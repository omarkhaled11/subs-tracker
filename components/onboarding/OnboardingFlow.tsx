import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { WelcomeScreen } from "./WelcomeScreen";
import { CurrencySetupScreen } from "./CurrencySetupScreen";
import { NotificationSetupScreen } from "./NotificationSetupScreen";
import { ReadyScreen } from "./ReadyScreen";

const { width: screenWidth } = Dimensions.get("window");

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
}) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

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

  const handleContinue = () => {
    animateToNext();
  };

  const handleFinish = () => {
    onComplete();
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
          <WelcomeScreen onContinue={handleContinue} />
        </View>
        <View style={styles.screen}>
          <CurrencySetupScreen onContinue={handleContinue} />
        </View>
        <View style={styles.screen}>
          <NotificationSetupScreen onContinue={handleContinue} />
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
    overflow: "hidden",
  },
  screensContainer: {
    flex: 1,
    flexDirection: "row",
    width: screenWidth * 4, // 4 screens total
  },
  screen: {
    width: screenWidth,
    flex: 1,
  },
});
