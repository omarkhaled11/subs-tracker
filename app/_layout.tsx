import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import { theme } from "../utils/theme";
import { useEffect, useState } from "react";
import { loadFonts } from "../utils/fonts";
import { Ionicons } from '@expo/vector-icons';

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
              headerTitle: "",
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity 
                  onPress={() => router.back()}
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
            name="settings"
            options={{
              headerShown: true,
              headerTitle: "",
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity 
                  onPress={() => router.back()}
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
            name="add-subscription"
            options={{
              presentation: "modal",
              headerShown: true,
              headerShadowVisible: false,
              headerTitle: "Add Subscription",
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: "600",
                fontFamily: theme.fonts.regular,
              },
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
              headerRight: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons 
                    name="chevron-down" 
                    size={24} 
                    color={theme.colors.text} 
                  />
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
