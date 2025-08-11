import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { theme } from "../utils/theme";

export const ActionButtons = () => {
  const handleNavigate = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      {/* Primary Action - Add Subscription */}
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => handleNavigate("/add-subscription")}
      >
        <View style={styles.primaryButtonContent}>
          <Ionicons name="add-circle" size={24} color="#1A1A1A" />
          <Text style={styles.primaryButtonText}>Add Subscription</Text>
        </View>
      </Pressable>

      {/* Secondary Actions */}
      <View style={styles.secondaryContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.premiumButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleNavigate("/analytics")}
        >
          <View style={styles.buttonIconContainer}>
            <Ionicons name="analytics" size={20} color="#FFD700" />
          </View>
          <Text style={styles.premiumButtonText}>Analytics</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>PRO</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.utilityButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleNavigate("/settings")}
        >
          <View style={styles.buttonIconContainer}>
            <Ionicons name="settings-outline" size={20} color={theme.colors.secondary} />
          </View>
          <Text style={styles.utilityButtonText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  // Primary Action Button
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    paddingVertical: 18,
    paddingHorizontal: 24,
    ...theme.shadows.subtle,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: theme.fonts.bold,
  },
  // Secondary Actions Container
  secondaryContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  // Premium Button (Analytics)
  premiumButton: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    ...theme.shadows.subtle,
    position: 'relative',
  },
  premiumButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    fontFamily: theme.fonts.bold,
    letterSpacing: 0.5,
  },
  // Utility Button (Settings)
  utilityButton: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
    ...theme.shadows.subtle,
  },
  utilityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },
  // Shared Icon Container
  buttonIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Shared Animation
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.8,
  },
});
