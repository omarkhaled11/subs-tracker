import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, SafeAreaView, TouchableOpacity } from "react-native";
import { OnboardingButton } from "./OnboardingButton";
import { StepIndicator } from "./StepIndicator";
import { theme } from "../../utils/theme";

interface NotificationSetupScreenProps {
  onContinue: (notificationsEnabled: boolean, reminderDays?: number) => void;
}

export const NotificationSetupScreen: React.FC<NotificationSetupScreenProps> = ({ 
  onContinue 
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedReminderDays, setSelectedReminderDays] = useState(7);

  const reminderOptions = [1, 3, 7, 14, 30];

  const handleContinue = () => {
    onContinue(notificationsEnabled, notificationsEnabled ? selectedReminderDays : undefined);
  };

  const ReminderDayOption = ({ days }: { days: number }) => (
    <TouchableOpacity
      onPress={() => setSelectedReminderDays(days)}
      style={[
        styles.reminderOption,
        {
          backgroundColor: selectedReminderDays === days ? theme.colors.primary : theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.reminderText,
          {
            color: selectedReminderDays === days ? theme.colors.background : theme.colors.text,
          },
        ]}
      >
        {days} day{days > 1 ? "s" : ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Enable Notifications? 🔔
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
            We can remind you before subscriptions renew. Totally optional.
          </Text>
        </View>
        
        <View style={styles.body}>
          <View style={styles.toggleContainer}>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
                Enable renewal reminders
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary + "40",
                }}
                thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.secondary}
              />
            </View>
          </View>

          {notificationsEnabled && (
            <View style={styles.reminderSection}>
              <Text style={[styles.reminderTitle, { color: theme.colors.text }]}>
                Remind me
              </Text>
              <View style={styles.reminderOptions}>
                {reminderOptions.map((days) => (
                  <ReminderDayOption key={days} days={days} />
                ))}
              </View>
              <Text style={[styles.reminderSubtext, { color: theme.colors.secondaryText }]}>
                before subscriptions renew
              </Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <OnboardingButton
              title="Continue"
              onPress={handleContinue}
            />
            <StepIndicator currentStep={2} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    textAlign: "center",
    lineHeight: 24,
  },
  body: {
    flex: 4,
    justifyContent: "flex-start",
  },
  toggleContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 30,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
    borderColor: theme.colors.border,
    width: "100%",
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    flex: 1,
  },
  reminderSection: {
    flex: 3,
    paddingTop: 30,
    alignItems: "center",
  },
  reminderTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    marginBottom: 16,
  },
  reminderOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginBottom: 8,
  },
  reminderOption: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
  },
  reminderText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
  },
  reminderSubtext: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
});