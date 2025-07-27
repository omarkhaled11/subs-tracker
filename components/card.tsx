import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";
import { getDaysUntilRenewal } from "../utils/helpers";

interface SubscriptionAmountCardProps {
  amount: number;
  currency: string;
}

export const SubscriptionAmountCard: React.FC<SubscriptionAmountCardProps> = ({
  amount,
  currency,
}) => {
  const formatAmount = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>What you owe this month</Text>
      <Text style={styles.amount}>
        {currency}
        {formatAmount(amount)}
      </Text>
    </View>
  );
};

interface UpcomingRenewalCardProps {
  upcomingSubscriptions: SubscriptionItem[];
}

export const UpcomingRenewalCard: React.FC<UpcomingRenewalCardProps> = ({
  upcomingSubscriptions,
}) => {
  if (upcomingSubscriptions.length === 0) {
    return (
      <View style={styles.smallCard}>
        <Text style={styles.smallLabel}>Upcoming Renewals</Text>
        <Text style={styles.noRenewalsText}>
          No renewals in the next 30 days
        </Text>
      </View>
    );
  }

  // Show up to 3 upcoming renewals
  const renewalsToShow = upcomingSubscriptions.slice(0, 3);
  const remainingCount = upcomingSubscriptions.length - renewalsToShow.length;

  return (
    <View style={styles.smallCard}>
      <Text style={styles.smallLabel}>
        Upcoming Renewals ({upcomingSubscriptions.length})
      </Text>
      {renewalsToShow.map((subscription, index) => {
        const daysUntil = getDaysUntilRenewal(subscription.nextRenewal);
        return (
          <View
            key={subscription.id}
            style={[styles.renewalInfo, index > 0 && styles.renewalInfoSpacing]}
          >
            <Text style={styles.serviceName}>{subscription.label}</Text>
            <Text style={styles.renewalDate}>
              {daysUntil === 0
                ? "Today"
                : daysUntil === 1
                ? "Tomorrow"
                : `in ${daysUntil} days`}
            </Text>
          </View>
        );
      })}
      {remainingCount > 0 && (
        <Text style={styles.additionalRenewals}>
          +{remainingCount} more renewal{remainingCount > 1 ? "s" : ""} coming
          up
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.small,
    padding: 16,
    marginVertical: 8,
    marginTop: Platform.OS === "android" ? 16 : 8,
    height: 160, // Takes about 1/3 of screen height
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "400",
    fontFamily: theme.fonts.regular,
  },
  amount: {
    fontSize: 48,
    fontWeight: "bold",
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: "center",
  },
  // upcoming renewals
  smallCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    alignSelf: "stretch",
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  smallLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontWeight: "500",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: theme.fonts.regular,
  },
  renewalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    fontFamily: theme.fonts.regular,
  },
  renewalDate: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "500",
    fontFamily: theme.fonts.regular,
  },
  additionalRenewals: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 4,
    fontFamily: theme.fonts.regular,
  },
  noRenewalsText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: theme.fonts.regular,
  },
  renewalInfoSpacing: {
    marginTop: 8,
  },
});
