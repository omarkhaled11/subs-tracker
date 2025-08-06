import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
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
      <Text style={styles.title}>Upcoming Renewals</Text>
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
              {month.renewals.map((renewal, rIndex) => (
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
              ))}
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
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  timelineContainer: {
    paddingBottom: 10,
  },
  monthContainer: {
    width: Dimensions.get("window").width - 80,
    marginRight: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    padding: 16,
    ...theme.borders.premium
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
    gap: 8,
  },
  renewalItem: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    position: "relative",
  },
  renewalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: 4,
    fontFamily: theme.fonts.regular,
  },
  renewalAmount: {
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 4,
    fontFamily: theme.fonts.regular,
  },
  renewalDays: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
  },
  reminderBadge: {
    position: "absolute",
    top: 12,
    right: 12,
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
});
