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
import { Currency, SubscriptionItem } from "../utils/types";
import AppInfo from "../components/settings/app-info";
import SettingsRow from "../components/settings/settings-row";
import SettingsSection from "../components/settings/settings-section";
import { router } from "expo-router";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

export default function SettingsScreen() {
  const [biometricLock, setBiometricLock] = useState(false);
  const user = useSubscriptionsStore((state) => state.getUser());
  const updateUser = useSubscriptionsStore((state) => state.updateUser);
  const subscriptions = useSubscriptionsStore((state) => state.subscriptions);

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

  const handleExportData = async () => {
    try {
      // Create the export data
      const exportData = {
        subscriptions,
        exportDate: new Date().toISOString(),
        version: "1.0.0" // Adding version for future compatibility
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create filename with current date
      const date = new Date().toISOString().split('T')[0];
      const fileName = `subscriptions_backup_${date}.json`;
      
      // Get the file path in temp directory
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;

      // Write the file
      await FileSystem.writeAsStringAsync(filePath, jsonString);

      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        // Share the file
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          dialogTitle: 'Export Subscriptions Data',
          UTI: 'public.json' // for iOS
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
      console.error('Export error:', error);
    }
  };

  const handleImportData = async () => {
    try {
      // Pick a JSON file
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (result.canceled) {
        return;
      }

      // Read the file content
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      
      // Parse and validate the data
      const importedData = JSON.parse(fileContent);
      
      // Basic validation
      if (!importedData.subscriptions || !Array.isArray(importedData.subscriptions)) {
        throw new Error('Invalid file format: Missing subscriptions array');
      }

      // Validate each subscription has required fields
      const isValidSubscription = (sub: any): sub is SubscriptionItem => {
        return (
          typeof sub.id === 'string' &&
          typeof sub.label === 'string' &&
          typeof sub.amount === 'number' &&
          typeof sub.interval === 'string' &&
          ['monthly', 'quarterly', 'yearly'].includes(sub.interval.toLowerCase()) &&
          (sub.nextRenewal ? !isNaN(new Date(sub.nextRenewal).getTime()) : true)
        );
      };

      if (!importedData.subscriptions.every(isValidSubscription)) {
        throw new Error('Invalid subscription data in file');
      }

      // Show confirmation dialog
      Alert.alert(
        'Import Data',
        subscriptions.length === 0
          ? `Import ${importedData.subscriptions.length} subscription(s)?`
          : `This will replace your existing ${subscriptions.length} subscription(s) with ${importedData.subscriptions.length} imported subscription(s). Continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'default',
            onPress: () => {
              // Replace subscriptions in store
              useSubscriptionsStore.setState({ subscriptions: importedData.subscriptions });
              Alert.alert('Success', 'Subscriptions imported successfully');
            },
          },
        ]
      );
    } catch (error) {
      let errorMessage = 'Failed to import data';
      if (error instanceof Error) {
        errorMessage = error.message.includes('Invalid') 
          ? error.message 
          : 'Failed to read or parse the file';
      }
      Alert.alert('Error', errorMessage);
      console.error('Import error:', error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your expenses. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            useSubscriptionsStore.getState().clearAllSubscriptions();
            router.back();
          },
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
            icon="upload"
            title="Import Data"
            subtitle="Import subscriptions from backup"
            onPress={handleImportData}
            rightComponent={
              <Octicons name="chevron-right" size={20} color="#C7C7CC" />
            }
          />
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
