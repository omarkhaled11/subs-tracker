import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity, Platform } from "react-native";
import { router } from "expo-router";
import { theme } from "../utils/theme";
import { useEffect, useState } from "react";
import { loadFonts } from "../utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { errorLogger } from "../utils/errorLogger";
import { ConfirmationDialog } from "../components/ui/confirmation-dialog";
import { useSubscriptionsStore } from "../utils/store";
import OnboardingPage from "./onboarding";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { getUser } = useSubscriptionsStore();
  const user = getUser();

  useEffect(() => {
    const loadAppFonts = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
        setFontsLoaded(true); // Still render the app even if fonts fail to load
      }
    };

    loadAppFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // You can add a loading screen here if desired
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => errorLogger.logError(error, errorInfo)}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider
          style={{
            paddingBottom: Platform.OS === "ios" ? 0 : 24,
            backgroundColor: theme.colors.background,
          }}
        >
          {!user.hasOnboarded ? (
            <OnboardingPage />
          ) : (
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="index" />
              <Stack.Screen
                name="analytics"
                options={{
                  headerShown: false,
                  headerTitle: "",
                  headerStyle: {
                    backgroundColor: theme.colors.background,
                  },
                  headerShadowVisible: false,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                      <Ionicons
                        name="arrow-back"
                        size={24}
                        color={theme.colors.text}
                      />
                    </TouchableOpacity>
                  ),
                }}
              />
              <Stack.Screen
                name="settings"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerStyle: {
                    backgroundColor: theme.colors.background,
                  },
                  headerShadowVisible: false,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                      <Ionicons
                        name="arrow-back"
                        size={24}
                        color={theme.colors.text}
                      />
                    </TouchableOpacity>
                  ),
                }}
              />
              <Stack.Screen
                name="add-subscription"
                options={{
                  presentation: "modal",
                  headerShown: true,
                  headerShadowVisible: false,
                  headerTitle: "Add Expense",
                  headerStyle: {
                    backgroundColor: theme.colors.background,
                  },
                  headerTintColor: theme.colors.text,
                  headerTitleStyle: {
                    fontWeight: "600",
                    fontFamily: theme.fonts.regular,
                  },
                  ...(Platform.OS === "android"
                    ? {
                        headerLeft: () => (
                          <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ paddingRight: 10 }}
                          >
                            <Ionicons
                              name="arrow-back"
                              size={24}
                              color={theme.colors.text}
                            />
                          </TouchableOpacity>
                        ),
                      }
                    : {
                        headerRight: () => (
                          <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons
                              name="chevron-down"
                              size={24}
                              color={theme.colors.text}
                            />
                          </TouchableOpacity>
                        ),
                      }),
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="subscription-detail"
                options={{
                  presentation: "modal",
                  headerShown: true,
                  headerShadowVisible: false,
                  headerTitle: "",
                  headerStyle: {
                    backgroundColor: theme.colors.background,
                  },
                  ...(Platform.OS === "android"
                    ? {
                        headerLeft: () => (
                          <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ paddingRight: 10 }}
                          >
                            <Ionicons
                              name="arrow-back"
                              size={24}
                              color={theme.colors.text}
                            />
                          </TouchableOpacity>
                        ),
                      }
                    : {
                        headerRight: () => (
                          <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons
                              name="chevron-down"
                              size={24}
                              color={theme.colors.text}
                            />
                          </TouchableOpacity>
                        ),
                      }),
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="edit-subscription"
                options={{
                  presentation: "modal",
                  headerShown: true,
                  headerShadowVisible: false,
                  headerTitle: "Edit Expense",
                  headerStyle: {
                    backgroundColor: theme.colors.background,
                  },
                  headerTintColor: theme.colors.text,
                  headerTitleStyle: {
                    fontWeight: "600",
                    fontFamily: theme.fonts.regular,
                  },
                  ...(Platform.OS === "android"
                    ? {
                        headerLeft: () => (
                          <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ paddingRight: 10 }}
                          >
                            <Ionicons
                              name="arrow-back"
                              size={24}
                              color={theme.colors.text}
                            />
                          </TouchableOpacity>
                        ),
                      }
                    : {
                        headerRight: () => (
                          <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons
                              name="chevron-down"
                              size={24}
                              color={theme.colors.text}
                            />
                          </TouchableOpacity>
                        ),
                      }),
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="privacy-policy"
                options={{
                  headerShown: true,
                  headerTitle: "Privacy Policy",
                  headerStyle: {
                    backgroundColor: theme.colors.background,
                  },
                  headerTintColor: theme.colors.text,
                  headerShadowVisible: false,
                  headerTitleStyle: {
                    fontWeight: "600",
                    fontFamily: theme.fonts.regular,
                  },
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => router.back()}
                      style={{ paddingRight: Platform.OS === "ios" ? 0 : 10 }}
                    >
                      <Ionicons
                        name="arrow-back"
                        size={24}
                        color={theme.colors.text}
                      />
                    </TouchableOpacity>
                  ),
                }}
              />
              <Stack.Screen
                name="terms-of-service"
                options={{
                  headerShown: true,
                  headerTitle: "Terms of Service",
                  headerStyle: {
                    backgroundColor: theme.colors.background,
                  },
                  headerTintColor: theme.colors.text,
                  headerShadowVisible: false,
                  headerTitleStyle: {
                    fontWeight: "600",
                    fontFamily: theme.fonts.regular,
                  },
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => router.back()}
                      style={{ paddingRight: Platform.OS === "ios" ? 0 : 10 }}
                    >
                      <Ionicons
                        name="arrow-back"
                        size={24}
                        color={theme.colors.text}
                      />
                    </TouchableOpacity>
                  ),
                }}
              />
            </Stack>
          )}
          <ConfirmationDialog />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
