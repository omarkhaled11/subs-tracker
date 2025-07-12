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
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={() => handleNavigate("/add-subscription")}
      >
        <Ionicons name="add" size={24} color={darkTheme.colors.background} />
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={() => handleNavigate("/(tabs)/analytics")}
      >
        <Ionicons name="analytics" size={24} color={darkTheme.colors.background} />
        <Text style={styles.buttonText}>Analysis</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={() => handleNavigate("/(tabs)/settings")}
      >
        <Ionicons name="settings" size={24} color={darkTheme.colors.background} />
        <Text style={styles.buttonText}>Settings</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  button: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    justifyContent: "center",
    shadowColor: darkTheme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: darkTheme.colors.background,
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Sora-Regular",
  },
});
