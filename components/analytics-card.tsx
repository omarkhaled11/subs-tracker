import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";

interface AnalyticsSummaryCardsProps {
  monthlyTotal: number;
  yearlyTotal: number;
  mostExpensiveSubscription: SubscriptionItem | null;
  averageMonthly: number;
  currency: string;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({
  monthlyTotal,
  yearlyTotal,
  mostExpensiveSubscription,
  averageMonthly,
  currency,
}) => {
  const formatAmount = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <View style={styles.analyticsContainer}>
      <View style={styles.analyticsRow}>
        <View style={[styles.analyticsCard, styles.secondaryCard]}>
          <Text style={styles.analyticsLabel}>This Month</Text>
          <Text style={styles.analyticsAmount}>
            {currency}{formatAmount(monthlyTotal)}
          </Text>
        </View>
        
        <View style={[styles.analyticsCard, styles.secondaryCard]}>
          <Text style={styles.analyticsLabel}>This Year</Text>
          <Text style={styles.analyticsAmount}>
            {currency}{formatAmount(yearlyTotal)}
          </Text>
        </View>
      </View>

      <View style={styles.analyticsRow}>
        <View style={[styles.analyticsCard, styles.secondaryCard]}>
          <Text style={styles.analyticsLabel}>Most Expensive</Text>
          <Text style={styles.analyticsAmount}>
            {mostExpensiveSubscription 
              ? `${mostExpensiveSubscription.label}`
              : 'No subscriptions'
            }
          </Text>
          {mostExpensiveSubscription && (
            <Text style={styles.analyticsSubtext}>
              {currency}{formatAmount(mostExpensiveSubscription.amount)}/{mostExpensiveSubscription.interval.slice(0, -2)}
            </Text>
          )}
        </View>
        
        <View style={[styles.analyticsCard, styles.secondaryCard]}>
          <Text style={styles.analyticsLabel}>Avg Monthly</Text>
          <Text style={styles.analyticsAmount}>
            {currency}{formatAmount(averageMonthly)}
          </Text>
          <Text style={styles.analyticsSubtext}>per service</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  analyticsContainer: {
    padding: 16,
  },
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  analyticsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minHeight: 100,
    justifyContent: "center",
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCard: {
    backgroundColor: theme.colors.primary,
  },
  secondaryCard: {
    backgroundColor: theme.colors.card,
  },
  analyticsLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: theme.text.fontFamily,
  },
  analyticsAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 2,
    fontFamily: theme.text.fontFamily,
  },
  analyticsSubtext: {
    fontSize: 11,
    color: theme.colors.secondary,
    fontWeight: "400",
    fontFamily: theme.text.fontFamily,
  },
});
