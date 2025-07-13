import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  Alert,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { currencies, reminderOptions } from "../utils/constants";
import { theme } from "../utils/theme";
import { useSubscriptionsStore } from "../utils/store";
import { Currency } from "../utils/types";
import AppInfo from "../components/settings/app-info";
import SettingsRow from "../components/settings/settings-row";
import SettingsSection from "../components/settings/settings-section";

export default function SettingsScreen() {
  const [biometricLock, setBiometricLock] = useState(false);
  const user = useSubscriptionsStore((state) => state.getUser());
  const updateUser = useSubscriptionsStore((state) => state.updateUser);

  const showCurrencyPicker = () => {
    Alert.alert("Select Currency", "Choose your preferred currency", [
      ...currencies.map((currency: Currency) => ({
        text: currency,
        onPress: () => updateUser({ defaultCurrency: currency }),
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
        onPress: () => updateUser({ reminderDays: days }),
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

        <SettingsSection title="Display & Experience">
          <SettingsRow
            icon="moon"
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightComponent={
              <Switch
                value={user.darkMode}
                onValueChange={(value) => updateUser({ darkMode: value })}
                trackColor={{
                  false: theme.colors.secondary,
                  true: theme.colors.background,
                }}
                thumbColor={
                  user.darkMode ? theme.colors.primary : theme.colors.secondary
                }
              />
            }
          />
          <SettingsRow
            icon="credit-card"
            title="Default Currency"
            subtitle={`Currently set to ${user.defaultCurrency}`}
            onPress={showCurrencyPicker}
            rightComponent={
              <Octicons name="chevron-right" size={20} color="#C7C7CC" />
            }
          />
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingsRow
            icon="bell"
            title="Push Notifications"
            subtitle="Get notified about upcoming renewals"
            rightComponent={
              <Switch
                value={user.notifications}
                onValueChange={(value) => updateUser({ notifications: value })}
                trackColor={{
                  false: theme.colors.secondary,
                  true: theme.colors.background,
                }}
                thumbColor={
                  user.notifications
                    ? theme.colors.primary
                    : theme.colors.secondary
                }
              />
            }
          />
          <SettingsRow
            icon="clock"
            title="Reminder Timing"
            subtitle={`Remind me ${user.reminderDays} day${
              user.reminderDays > 1 ? "s" : ""
            } before renewal`}
            onPress={showReminderPicker}
            rightComponent={
              <Octicons name="chevron-right" size={20} color="#C7C7CC" />
            }
          />
        </SettingsSection>

        <SettingsSection title="Privacy & Security">
          <SettingsRow
            icon="key"
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
          <SettingsRow
            icon="shield-check"
            title="Privacy Policy"
            onPress={() =>
              Alert.alert("Privacy Policy", "Privacy policy will open here")
            }
            rightComponent={
              <Octicons name="chevron-right" size={20} color="#C7C7CC" />
            }
          />
          <SettingsRow
            icon="file"
            title="Terms of Service"
            onPress={() =>
              Alert.alert("Terms of Service", "Terms of service will open here")
            }
            rightComponent={
              <Octicons name="chevron-right" size={20} color="#C7C7CC" />
            }
          />
        </SettingsSection>

        <SettingsSection title="Data Management">
          <SettingsRow
            icon="download"
            title="Export Data"
            subtitle="Download your subscription data"
            onPress={handleExportData}
            rightComponent={
              <Octicons name="chevron-right" size={20} color="#C7C7CC" />
            }
          />
          <SettingsRow
            icon="trash"
            title="Clear All Data"
            subtitle="Permanently delete all subscriptions"
            onPress={handleClearData}
            rightComponent={
              <Octicons name="chevron-right" size={20} color="#FF3B30" />
            }
          />
        </SettingsSection>

        <AppInfo />
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
});
