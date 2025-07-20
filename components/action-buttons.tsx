import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { Pressable } from "react-native-gesture-handler";
import { Text } from "react-native";
import { theme } from "../utils/theme";

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
            pressed && styles.addButtonPressed,
          ]}
          onPress={() => handleNavigate("/add-subscription")}
        >
          <Ionicons name="add" size={32} color={theme.colors.background} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleNavigate("/analytics")}
        >
          <Ionicons
            name="analytics-sharp"
            size={22}
            color={theme.colors.background}
          />
          <Text style={styles.navButtonText}>Analysis</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleNavigate("/settings")}
        >
          <Octicons name="gear" size={22} color={theme.colors.background} />
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
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
  addButton: {
    width: 64,
    height: 64,
    backgroundColor: theme.colors.primary,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  addButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  navButtonText: {
    color: theme.colors.background,
    marginLeft: 8,
    fontSize: 15,
    fontFamily: theme.fonts.medium,
  },
});
