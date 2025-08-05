import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../utils/theme";

interface OnboardingButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
}) => {
  const isPrimary = variant === "primary";
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
  },
  primaryButtonText: {
    color: theme.colors.background,
  },
  secondaryButtonText: {
    color: theme.colors.text,
  },
});