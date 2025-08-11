import React from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "../utils/theme";

export const ProButton = () => {
  const handlePress = () => {
    router.push("/analytics");
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.buttonPressed,
      ]}
      onPress={handlePress}
    >
      <LinearGradient
        colors={["#FFD700", "#FFA500", "#FF8C00"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Ionicons name="diamond" size={16} color="#000" />
        <Text style={styles.buttonText}>Unlock Analytics</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    // position: "absolute",
    // top: 65,
    marginHorizontal: 'auto',
    alignSelf: "center",
    maxWidth: 200,
    zIndex: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#FFD700",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000",
    fontFamily: theme.fonts.bold,
    letterSpacing: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});