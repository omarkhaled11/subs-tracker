import { StyleSheet, Text, View, Image } from "react-native";
import Constants from "expo-constants";
import { theme } from "../../utils/theme";

export default function AppInfo() {
  return (
    <View style={styles.appInfo}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.appName}>Chrima App</Text>
      <Text style={styles.version}>
        v{Constants.expoConfig?.version}.
        {Constants.expoConfig?.ios?.buildNumber ||
          Constants.expoConfig?.android?.versionCode ||
          "1"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appInfo: {
    alignItems: "center",
    padding: 24,
    marginTop: 8,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  appName: {
    fontSize: 15,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.medium,
    marginBottom: 4,
  },
  version: {
    fontSize: 13,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
  },
});
