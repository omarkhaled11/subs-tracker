import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../utils/theme";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  totalSteps = 3
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentStep 
                ? theme.colors.primary 
                : theme.colors.border,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});