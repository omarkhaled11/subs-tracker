import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native-gesture-handler";
import { Text } from "react-native";
import { darkTheme } from "../utils/theme";

export const ActionButtons = () => {
  const handleNavigate = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed
          ]}
          onPress={() => handleNavigate("/add-subscription")}
        >
          <Ionicons name="add" size={32} color={darkTheme.colors.background} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => handleNavigate("/(tabs)/analytics")}
        >
          <Ionicons name="analytics" size={22} color={darkTheme.colors.background} />
          <Text style={styles.navButtonText}>Analysis</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => handleNavigate("/(tabs)/settings")}
        >
          <Ionicons name="settings" size={22} color={darkTheme.colors.background} />
          <Text style={styles.navButtonText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    flex: 1,
    backgroundColor: darkTheme.colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 8,
    justifyContent: "center",
    shadowColor: darkTheme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  addButton: {
    width: 64,
    height: 64,
    backgroundColor: darkTheme.colors.primary,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    shadowColor: darkTheme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  addButtonPressed: {
    transform: [{ scale: 0.96 }],
  },
  navButtonText: {
    color: darkTheme.colors.background,
    marginTop: 8,
    fontSize: 14,
    fontFamily: darkTheme.text.fontFamily,
  },
});
