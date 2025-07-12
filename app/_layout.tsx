import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import { theme } from "../utils/theme";
import { useEffect, useState } from "react";
import { loadFonts } from "../utils/fonts";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadAppFonts = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Still render the app even if fonts fail to load
      }
    };

    loadAppFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // You can add a loading screen here if desired
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen 
            name="analytics" 
            options={{
              headerShown: true,
              headerTitle: "Analytics",
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          />
          <Stack.Screen 
            name="settings"
            options={{
              headerShown: true,
              headerTitle: "Settings",
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          />
          <Stack.Screen
            name="add-subscription"
            options={{
              presentation: "modal",
              headerShown: true,
              headerTitle: "Add Subscription",
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: "600",
              },
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="subscription-detail"
            options={{
              presentation: "modal",
              headerShown: true,
              headerTitle: "",
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerRight: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={{ color: theme.colors.text }}>Close</Text>
                </TouchableOpacity>
              ),
              gestureEnabled: true,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
