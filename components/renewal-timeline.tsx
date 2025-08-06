import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";

interface RenewalTimelineProps {
  subscriptions: SubscriptionItem[];
  currency: string;
}

interface MonthlyRenewal {
  month: string;
  year: number;
  renewals: {
    subscription: SubscriptionItem;
    daysUntilRenewal: number;
  }[];
  totalAmount: number;
}

export const RenewalTimeline: React.FC<RenewalTimelineProps> = ({
  subscriptions,
  currency,
}) => {
  const getMonthlyRenewals = (): MonthlyRenewal[] => {
    const today = new Date();
    const nextThreeMonths: MonthlyRenewal[] = [];

    // Initialize next 3 months
    for (let i = 0; i < 3; i++) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      nextThreeMonths.push({
        month: targetDate.toLocaleString("default", { month: "long" }),
        year: targetDate.getFullYear(),
        renewals: [],
        totalAmount: 0,
      });
    }

    // Filter and sort subscriptions with valid renewal dates
    const validSubscriptions = subscriptions.filter((sub) => sub.nextRenewal);

    validSubscriptions.forEach((sub) => {
      if (!sub.nextRenewal) return;

      const renewalDate = new Date(sub.nextRenewal);
      const monthIndex = renewalDate.getMonth() - today.getMonth();

      if (monthIndex >= 0 && monthIndex < 3) {
        const daysUntilRenewal = Math.ceil(
          (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        nextThreeMonths[monthIndex].renewals.push({
          subscription: sub,
          daysUntilRenewal,
        });
        nextThreeMonths[monthIndex].totalAmount += sub.amount;
      }
    });

    // Sort renewals by date within each month
    nextThreeMonths.forEach((month) => {
      month.renewals.sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);
    });

    return nextThreeMonths;
  };

  const getIntervalColor = (interval: string): string => {
    switch (interval.toLowerCase()) {
      case "monthly":
        return "#4ECDC4";
      case "quarterly":
        return "#FFB347";
      case "yearly":
        return "#FF6B6B";
      default:
        return theme.colors.text;
    }
  };

  const emptyStateMessages = [
    { icon: "checkmark-circle", text: "All clear!", subtext: "Great month for savings" },
    { icon: "wallet", text: "Budget friendly!", subtext: "No renewals scheduled" },
    { icon: "moon", text: "Quiet month", subtext: "Enjoy the break" },
    { icon: "cash", text: "Money in pocket!", subtext: "Zero renewals coming" },
    { icon: "target", text: "Savings mode on", subtext: "No bills this month" },
    { icon: "sunny", text: "Sunny skies ahead", subtext: "Free from renewals" },
  ];

  const getRandomEmptyMessage = (monthIndex: number) => {
    // Use month index + current date to create more variation
    const seed = monthIndex + new Date().getDate() + new Date().getMonth();
    return emptyStateMessages[seed % emptyStateMessages.length];
  };

  const monthlyRenewals = getMonthlyRenewals();

  if (subscriptions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Upcoming Renewals</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No upcoming renewals</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <View style={styles.titleHeader}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.title}>Upcoming Renewals</Text>
        </View>
        <Text style={styles.subtitle}>Next 3 months</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timelineContainer}
      >
        {monthlyRenewals.map((month, index) => (
          <View key={index} style={styles.monthContainer}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthTitle}>
                {month.month} {month.year}
              </Text>
              <Text style={styles.monthTotal}>
                {currency}
                {month.totalAmount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.renewalsList}>
              {month.renewals.length > 0 ? (
                month.renewals.map((renewal, rIndex) => (
                  <TouchableOpacity
                    key={rIndex}
                    style={[
                      styles.renewalItem,
                      {
                        borderLeftColor: getIntervalColor(
                          renewal.subscription.interval
                        ),
                      },
                    ]}
                    onPress={() => {
                      router.push(`/subscription-detail?id=${renewal.subscription.id}`);
                    }}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.renewalLabel}>
                      {renewal.subscription.label}
                    </Text>
                    <Text style={styles.renewalAmount}>
                      {currency}
                      {renewal.subscription.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.renewalDays}>
                      in {renewal.daysUntilRenewal} days
                    </Text>
                    {renewal.subscription.reminderDays > 0 && (
                      <View style={styles.reminderBadge}>
                        <Text style={styles.reminderText}>🔔</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyMonthState}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons 
                      name={getRandomEmptyMessage(index).icon as any} 
                      size={32} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <Text style={styles.emptyTitle}>
                    {getRandomEmptyMessage(index).text}
                  </Text>
                  <Text style={styles.emptySubtext}>
                    {getRandomEmptyMessage(index).subtext}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  titleSection: {
    marginBottom: 20,
    paddingLeft: 20,
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    fontFamily: theme.fonts.regular,
    opacity: 0.8,
    marginLeft: 36,
  },
  timelineContainer: {
    paddingBottom: 16,
    paddingLeft: 20,
  },
  monthContainer: {
    width: Dimensions.get("window").width - 80,
    marginRight: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    padding: 20,
    ...theme.shadows.subtle,
    ...theme.borders.premium,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },
  monthTotal: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
    fontFamily: theme.fonts.medium,
  },
  renewalsList: {
    gap: 12,
  },
  renewalItem: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.small,
    padding: 16,
    borderLeftWidth: 4,
    position: "relative",
  },
  renewalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
    fontFamily: theme.fonts.medium,
  },
  renewalAmount: {
    fontSize: 15,
    color: theme.colors.primary,
    marginBottom: 6,
    fontWeight: "600",
    fontFamily: theme.fonts.medium,
  },
  renewalDays: {
    fontSize: 13,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
    opacity: 0.8,
  },
  reminderBadge: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  reminderText: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
  },
  emptyMonthState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 13,
    color: theme.colors.secondaryText,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    opacity: 0.8,
  },
});
