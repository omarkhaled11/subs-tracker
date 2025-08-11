import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
    <View style={styles.heroCard}>
      <View style={styles.heroContent}>
        <View style={styles.labelContainer}>
          <Ionicons name="wallet-outline" size={18} color={theme.colors.secondaryText} />
          <Text style={styles.heroLabel}>Monthly Total</Text>
        </View>
        <Text style={styles.heroAmount}>
          {currency}{formatAmount(amount)}
        </Text>
        <Text style={styles.heroSubtext}>Total subscription costs this month</Text>
      </View>
    </View>
  );
};

interface UpcomingRenewalCardProps {
  upcomingSubscriptions: SubscriptionItem[];
}

export const UpcomingRenewalCard: React.FC<UpcomingRenewalCardProps> = ({
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
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Upcoming Renewals</Text>
          </View>
        </View>
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
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>Upcoming Renewals</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{upcomingSubscriptions.length}</Text>
        </View>
      </View>
      
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
  // Legacy card styles (keeping for compatibility)
  card: {
    borderRadius: theme.borderRadius.small,
    padding: 16,
    marginVertical: 8,
    marginTop: Platform.OS === "android" ? 16 : 8,
    height: 160,
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
  // New hero card design
  heroCard: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    gap: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroLabel: {
    fontSize: 16,
    color: theme.colors.secondaryText,
    fontWeight: '500',
    fontFamily: theme.fonts.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroAmount: {
    fontSize: 56,
    fontWeight: '900',
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    letterSpacing: -2,
    lineHeight: 64,
  },
  heroSubtext: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 4,
  },
  // Redesigned upcoming renewals card
  renewalCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 12,
    ...theme.shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  countBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: theme.fonts.bold,
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
