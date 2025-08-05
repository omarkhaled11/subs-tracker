import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { OnboardingButton } from "./OnboardingButton";
import { theme } from "../../utils/theme";

interface ReadyScreenProps {
  onFinish: () => void;
}

export const ReadyScreen: React.FC<ReadyScreenProps> = ({ onFinish }) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            You're all set!
          </Text>
        </View>
        
        <View style={styles.body}>
          <View style={styles.celebrationContainer}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={[styles.celebrationText, { color: theme.colors.text }]}>
              Start adding your subscriptions and take control of your spending.
            </Text>
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: theme.colors.secondaryText }]}>
              You can update your settings anytime in the app.
            </Text>
          </View>
          
        </View>
        <View style={styles.buttonContainer}>
          <OnboardingButton
            title="Start Adding Subscriptions"
            onPress={onFinish}
          />
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
  celebrationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  celebrationText: {
    fontSize: 20,
    fontFamily: theme.fonts.medium,
    textAlign: "center",
    lineHeight: 28,
  },
  messageContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    marginBottom: 30,
  },
  message: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
});