import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";
import { getDaysUntilRenewal } from "../utils/helpers";

interface UpcomingRenewalContentProps {
  upcomingSubscriptions: SubscriptionItem[];
}

export const UpcomingRenewalContent: React.FC<UpcomingRenewalContentProps> = ({
  upcomingSubscriptions,
}) => {
  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil === 0) return "#EF4444"; // Red for today
    if (daysUntil === 1) return "#F59E0B"; // Amber for tomorrow
    if (daysUntil <= 7) return "#8B5CF6"; // Purple for this week
    return theme.colors.primary; // Green for later
  };

  const getUrgencyIcon = (daysUntil: number) => {
    if (daysUntil === 0) return "alert-circle";
    if (daysUntil === 1) return "warning";
    if (daysUntil <= 7) return "time";
    return "calendar";
  };

  if (upcomingSubscriptions.length === 0) {
    return (
      <View style={styles.renewalCard}>
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle" size={32} color={theme.colors.primary} />
          <Text style={styles.emptyStateText}>All clear for the next 30 days!</Text>
        </View>
      </View>
    );
  }

  // Show up to 3 upcoming renewals
  const renewalsToShow = upcomingSubscriptions.slice(0, 3);
  const remainingCount = upcomingSubscriptions.length - renewalsToShow.length;

  return (
    <View style={styles.renewalCard}>
      <View style={styles.renewalsList}>
        {renewalsToShow.map((subscription, index) => {
          const daysUntil = getDaysUntilRenewal(subscription.nextRenewal);
          const urgencyColor = getUrgencyColor(daysUntil);
          const urgencyIcon = getUrgencyIcon(daysUntil);
          
          return (
            <View key={subscription.id} style={styles.renewalItem}>
              <View style={styles.renewalLeft}>
                <View style={[styles.renewalIconContainer, { backgroundColor: `${urgencyColor}20` }]}>
                  <Ionicons name={urgencyIcon as any} size={16} color={urgencyColor} />
                </View>
                <View style={styles.renewalInfo}>
                  <Text style={styles.serviceName}>{subscription.label}</Text>
                  <Text style={styles.renewalAmount}>
                    {subscription.currency}{subscription.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={[styles.renewalDateContainer, { borderColor: urgencyColor }]}>
                <Text style={[styles.renewalDate, { color: urgencyColor }]}>
                  {daysUntil === 0
                    ? "Today"
                    : daysUntil === 1
                    ? "Tomorrow"
                    : `${daysUntil}d`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      
      {remainingCount > 0 && (
        <View style={styles.moreRenewals}>
          <Ionicons name="ellipsis-horizontal" size={16} color={theme.colors.secondary} />
          <Text style={styles.moreRenewalsText}>
            +{remainingCount} more renewal{remainingCount > 1 ? "s" : ""}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  renewalCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 12,
    ...theme.shadows.subtle,
  },
  renewalsList: {
    gap: 12,
  },
  renewalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.small,
    padding: 12,
  },
  renewalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  renewalIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renewalInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    marginBottom: 2,
  },
  renewalAmount: {
    fontSize: 13,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
  },
  renewalDateContainer: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  renewalDate: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
  },
  moreRenewals: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  moreRenewalsText: {
    fontSize: 13,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    textAlign: 'center',
  },
});