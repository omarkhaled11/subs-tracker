import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";
import { isSubscriptionDueInMonth } from "../utils/helpers";

interface RenewalTimelineContentProps {
  subscriptions: SubscriptionItem[];
  currency: string;
}

export const RenewalTimelineContent: React.FC<RenewalTimelineContentProps> = ({
  subscriptions,
  currency,
}) => {
  const getUpcomingMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 3; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      );
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();

      const monthlySubscriptions = subscriptions.filter((sub) => {
        return isSubscriptionDueInMonth(sub, date.getMonth() + 1, year);
      });

      months.push({
        month,
        year: year.toString(),
        subscriptions: monthlySubscriptions,
      });
    }

    return months;
  };

  const getRandomEmptyMessage = (index: number) => {
    const messages = [
      { icon: "checkmark-circle", text: "All clear!", subtext: "Great month for savings" },
      { icon: "happy", text: "No renewals", subtext: "Enjoy the break" },
      { icon: "leaf", text: "Light month", subtext: "Budget breathing room" },
      { icon: "sunny", text: "Free & clear", subtext: "Money stays in pocket" },
      { icon: "heart", text: "Peaceful month", subtext: "No subscription stress" },
      { icon: "sparkles", text: "Clean slate", subtext: "Zero renewals due" },
    ];
    
    // Use index to ensure consistency but add some variety
    return messages[index % messages.length];
  };

  const months = getUpcomingMonths();

  if (subscriptions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>
            No subscriptions to track renewals for
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timelineContainer}
        style={styles.scrollView}
      >
        {months.map((month, index) => (
          <View key={index} style={styles.monthContainer}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthTitle}>
                {month.month} {month.year}
              </Text>
            </View>
            <View style={styles.monthContent}>
              {month.subscriptions.length > 0 ? (
                month.subscriptions.map((sub, subIndex) => (
                  <View key={subIndex} style={styles.subscriptionItem}>
                    <View style={styles.subscriptionInfo}>
                      <Text style={styles.subscriptionName}>{sub.label}</Text>
                      <Text style={styles.subscriptionAmount}>
                        {currency}
                        {sub.amount.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.subscriptionRight}>
                      <Text style={styles.subscriptionInterval}>
                        {sub.interval}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyMonth}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons 
                      name={getRandomEmptyMessage(index).icon as any} 
                      size={20} 
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
    marginTop: 12,
  },
  timelineContainer: {
    paddingLeft: 20,
  },
  scrollView: {
    overflow: "visible",
  },
  monthContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    marginRight: 16,
    width: Dimensions.get("window").width * 0.7,
    overflow: "hidden",
    ...theme.shadows.subtle,
  },
  monthHeader: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: theme.fonts.bold,
    letterSpacing: 0.5,
  },
  monthContent: {
    padding: 16,
    minHeight: 120,
  },
  subscriptionItem: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.small,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subscriptionInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  subscriptionName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
    fontFamily: theme.fonts.medium,
  },
  subscriptionAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    marginBottom: 4,
  },
  subscriptionRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 60,
  },
  subscriptionInterval: {
    fontSize: 10,
    color: theme.colors.secondary,
    textTransform: "uppercase",
    fontFamily: theme.fonts.medium,
    letterSpacing: 0.8,
    backgroundColor: theme.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: "center",
    minWidth: 50,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: "center",
    fontFamily: theme.fonts.regular,
  },
  emptyMonth: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
    minHeight: 120,
    justifyContent: "center",
  },
  emptyIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(132, 204, 22, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    fontFamily: theme.fonts.medium,
  },
  emptySubtext: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
    opacity: 0.8,
  },
});