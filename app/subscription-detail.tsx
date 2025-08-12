import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useSubscriptionsStore } from "../utils/store";
import { theme } from "../utils/theme";
import { currencySymbols } from "../utils/constants";
import { Octicons } from "@expo/vector-icons";
import { useConfirmationDialogStore } from "../utils/confirmation-dialog-store";
import { ConfirmationDialog } from "../components/ui/confirmation-dialog";

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const getSubscription = useSubscriptionsStore(
    (state: any) => state.getSubscription
  );
  const { showConfirmDialog } = useConfirmationDialogStore();
  const subscription = id ? getSubscription(id) : null;

  if (!subscription) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Subscription not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not set";
    const renewalDate = typeof date === "string" ? new Date(date) : date;
    if (!renewalDate || isNaN(renewalDate.getTime())) return "Not set";

    const day = renewalDate.getDate().toString().padStart(2, "0");
    const month = (renewalDate.getMonth() + 1).toString().padStart(2, "0");
    const year = renewalDate.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const formatInterval = (interval: string) => {
    return interval.charAt(0).toUpperCase() + interval.slice(1);
  };

  const getDaysUntilRenewal = () => {
    if (!subscription.nextRenewal) return null;

    const renewalDate =
      typeof subscription.nextRenewal === "string"
        ? new Date(subscription.nextRenewal)
        : subscription.nextRenewal;

    if (!renewalDate || isNaN(renewalDate.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewalDateOnly = new Date(renewalDate);
    renewalDateOnly.setHours(0, 0, 0, 0);

    const timeDiff = renewalDateOnly.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
  };

  const daysUntilRenewal = getDaysUntilRenewal();

  const handleEdit = () => {
    router.push({
      pathname: "/edit-subscription",
      params: { id },
    });
  };

  const handleDelete = () => {
    showConfirmDialog({
      title: "Delete Subscription",
      subtitle: `Are you sure you want to delete ${subscription.label}?`,
      confirmText: "Delete",
      destructive: true,
      onConfirm: () => {
        const deleteSubscription =
          useSubscriptionsStore.getState().deleteSubscription;
        deleteSubscription(id);
        router.back();
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>
                {
                  currencySymbols[
                    subscription.currency as keyof typeof currencySymbols
                  ]
                }
              </Text>
            </View>
            <Text style={styles.serviceName}>{subscription.label}</Text>
            <Text style={styles.amount}>
              {
                currencySymbols[
                  subscription.currency as keyof typeof currencySymbols
                ]
              }
              {subscription.amount.toFixed(2)}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEdit}
            >
              <Octicons
                name="pencil"
                size={24}
                color={theme.colors.background}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Octicons
                name="trash"
                size={24}
                color={theme.colors.background}
              />
            </TouchableOpacity>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Billing Cycle</Text>
              <Text style={styles.detailValue}>
                {formatInterval(subscription.interval)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next Renewal</Text>
              <Text style={styles.detailValue}>
                {formatDate(subscription.nextRenewal)}
              </Text>
            </View>

            {daysUntilRenewal !== null && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Days Until Renewal</Text>
                <Text
                  style={[
                    styles.detailValue,
                    daysUntilRenewal <= 3 && styles.urgentText,
                    daysUntilRenewal === 0 && styles.todayText,
                  ]}
                >
                  {daysUntilRenewal === 0
                    ? "Today"
                    : daysUntilRenewal === 1
                    ? "Tomorrow"
                    : daysUntilRenewal < 0
                    ? `${Math.abs(daysUntilRenewal)} days overdue`
                    : `${daysUntilRenewal} days`}
                </Text>
              </View>
            )}

            <View style={[styles.detailRow, styles.lastDetailRow]}>
              <Text style={styles.detailLabel}>Reminder</Text>
              <Text style={styles.detailValue}>
                {subscription.reminderDays} day
                {subscription.reminderDays !== 1 ? "s" : ""} before renewal
              </Text>
            </View>
          </View>

          {/* Cost Breakdown Section */}
          <View style={styles.breakdownSection}>
            <Text style={styles.sectionTitle}>Cost Breakdown</Text>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Per {subscription.interval.toLowerCase().slice(0, -2)}
              </Text>
              <Text style={styles.breakdownValue}>
                {
                  currencySymbols[
                    subscription.currency as keyof typeof currencySymbols
                  ]
                }
                {subscription.amount.toFixed(2)}
              </Text>
            </View>

            {subscription.interval !== "monthly" && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Monthly equivalent</Text>
                <Text style={styles.breakdownValue}>
                  {
                    currencySymbols[
                      subscription.currency as keyof typeof currencySymbols
                    ]
                  }
                  {subscription.interval === "yearly"
                    ? (subscription.amount / 12).toFixed(2)
                    : subscription.interval === "quarterly"
                    ? (subscription.amount / 3).toFixed(2)
                    : subscription.amount.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Yearly cost</Text>
              <Text style={styles.breakdownValue}>
                {
                  currencySymbols[
                    subscription.currency as keyof typeof currencySymbols
                  ]
                }
                {subscription.interval === "monthly"
                  ? (subscription.amount * 12).toFixed(2)
                  : subscription.interval === "quarterly"
                  ? (subscription.amount * 4).toFixed(2)
                  : subscription.amount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <ConfirmationDialog />
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
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 4,
    paddingTop: 0,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
    color: "#1A1A1A",
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: theme.fonts.bold,
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.primary,
    textAlign: "center",
    fontFamily: theme.fonts.bold,
  },
  detailsSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
    ...theme.shadows.subtle,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: theme.colors.secondaryText,
    fontWeight: "500",
    fontFamily: theme.fonts.medium,
  },
  detailValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
    fontFamily: theme.fonts.medium,
  },
  urgentText: {
    color: "#F59E0B",
  },
  todayText: {
    color: "#EF4444",
  },
  breakdownSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    padding: 16,
    ...theme.shadows.subtle,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 16,
    fontFamily: theme.fonts.bold,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  breakdownLabel: {
    fontSize: 16,
    color: theme.colors.secondaryText,
    fontWeight: "500",
    fontFamily: theme.fonts.medium,
  },
  breakdownValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "600",
    fontFamily: theme.fonts.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.secondaryText,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: theme.fonts.medium,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: theme.fonts.medium,
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
});
