import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { currencies, reminderOptions } from "../utils/constants";
import { theme } from "../utils/theme";

const SettingSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const SettingRow = ({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}) => (
  <TouchableOpacity
    style={styles.settingRow}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.settingLeft}>
      <Ionicons
        name={icon as any}
        size={24}
        color={theme.colors.primary}
        style={styles.settingIcon}
      />
      <View>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightComponent}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [reminderDays, setReminderDays] = useState(7);

  const showCurrencyPicker = () => {
    Alert.alert("Select Currency", "Choose your preferred currency", [
      ...currencies.map((currency) => ({
        text: currency,
        onPress: () => setSelectedCurrency(currency),
      })),
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const showReminderPicker = () => {
    Alert.alert("Reminder Days", "How many days before renewal?", [
      ...reminderOptions.map((days) => ({
        text: `${days} day${days > 1 ? "s" : ""}`,
        onPress: () => setReminderDays(days),
      })),
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleExportData = async () => {};

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your subscriptions. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => console.log("Data cleared"),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your app preferences</Text>
        </View>

        <SettingSection title="Display & Experience">
          <SettingRow
            icon="moon"
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{
                  false: theme.colors.secondary,
                  true: theme.colors.background,
                }}
                thumbColor={
                  darkMode ? theme.colors.primary : theme.colors.secondary
                }
              />
            }
          />
          <SettingRow
            icon="cash"
            title="Default Currency"
            subtitle={`Currently set to ${selectedCurrency}`}
            onPress={showCurrencyPicker}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            }
          />
        </SettingSection>

        <SettingSection title="Notifications">
          <SettingRow
            icon="notifications"
            title="Push Notifications"
            subtitle="Get notified about upcoming renewals"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: theme.colors.secondary,
                  true: theme.colors.background,
                }}
                thumbColor={
                  notifications ? theme.colors.primary : theme.colors.secondary
                }
              />
            }
          />
          <SettingRow
            icon="time"
            title="Reminder Timing"
            subtitle={`Remind me ${reminderDays} day${
              reminderDays > 1 ? "s" : ""
            } before renewal`}
            onPress={showReminderPicker}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            }
          />
        </SettingSection>

        <SettingSection title="Privacy & Security">
          <SettingRow
            icon="finger-print"
            title="Biometric Lock"
            subtitle="Require Face ID/Touch ID to open app"
            rightComponent={
              <Switch
                value={biometricLock}
                onValueChange={setBiometricLock}
                trackColor={{
                  false: theme.colors.secondary,
                  true: theme.colors.background,
                }}
                thumbColor={
                  biometricLock ? theme.colors.primary : theme.colors.secondary
                }
              />
            }
          />
          <SettingRow
            icon="shield-checkmark"
            title="Privacy Policy"
            onPress={() =>
              Alert.alert("Privacy Policy", "Privacy policy will open here")
            }
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            }
          />
          <SettingRow
            icon="document-text"
            title="Terms of Service"
            onPress={() =>
              Alert.alert("Terms of Service", "Terms of service will open here")
            }
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            }
          />
        </SettingSection>

        <SettingSection title="Data Management">
          <SettingRow
            icon="download"
            title="Export Data"
            subtitle="Download your subscription data"
            onPress={handleExportData}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            }
          />
          <SettingRow
            icon="trash"
            title="Clear All Data"
            subtitle="Permanently delete all subscriptions"
            onPress={handleClearData}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
            }
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
  },
  section: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  sectionContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontFamily: theme.fonts.regular,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    minHeight: 64,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
    width: 24,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: "400",
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  settingSubtitle: {
    fontSize: 13,
    color: theme.colors.secondary,
    marginTop: 2,
    fontFamily: theme.fonts.regular,
  },
});
