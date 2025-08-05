import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import { OnboardingButton } from "./OnboardingButton";
import { StepIndicator } from "./StepIndicator";
import { theme } from "../../utils/theme";

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome to <Text style={{ color: theme.colors.primary }}>Chrima</Text>
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
            A simple, minimal subscription tracker.
          </Text>
        </View>
        
        <View style={styles.body}>
          <View style={styles.logoContainer}>
            <Image 
              source={require("../../assets/logo.png")} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: theme.colors.text }]}>
              All your data stays on your device. No account, no ads, works offline.
            </Text>
          </View>
          
        </View>
        <View style={styles.buttonContainer}>
          <OnboardingButton
            title="Get Started"
            onPress={onContinue}
          />
          <StepIndicator currentStep={0} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    textAlign: "center",
    lineHeight: 24,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  messageContainer: {
    paddingTop: 24,
    marginBottom: 60,
  },
  message: {
    fontSize: 20,
    fontFamily: theme.fonts.medium,
    textAlign: "center",
    lineHeight: 35,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
});