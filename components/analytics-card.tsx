import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
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
      <View style={styles.featuredCard}>
        <LinearGradient
          colors={['#2A2A2A', '#3A3A3A']}
          style={styles.featuredGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.featuredContent}>
            <Text style={styles.featuredLabel}>Total Monthly Spending</Text>
            <Text style={styles.featuredAmount}>
              {currency}{formatAmount(monthlyTotal)}
            </Text>
            <Text style={styles.featuredSubtext}>
              {currency}{formatAmount(yearlyTotal)} per year
            </Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.analyticsGrid}>
        <View style={styles.gridCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="stats-chart" size={18} color={theme.colors.primary} />
            </View>
          </View>
          <Text style={styles.gridLabel}>Average</Text>
          <Text style={styles.gridAmount}>
            {currency}{formatAmount(averageMonthly)}
          </Text>
          <Text style={styles.gridSubtext}>per service</Text>
        </View>
        
        <View style={styles.gridCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="diamond" size={18} color={theme.colors.primary} />
            </View>
          </View>
          <Text style={styles.gridLabel}>Highest</Text>
          <Text style={styles.gridAmount}>
            {mostExpensiveSubscription 
              ? `${mostExpensiveSubscription.label}`
              : 'No expenses'
            }
          </Text>
          {mostExpensiveSubscription && (
            <Text style={styles.gridSubtext}>
              {currency}{formatAmount(mostExpensiveSubscription.amount)}/{mostExpensiveSubscription.interval.slice(0, -2)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  analyticsContainer: {
    padding: 20,
    gap: 20,
  },
  featuredCard: {
    borderRadius: theme.borderRadius.small,
    overflow: 'hidden',
    ...theme.shadows.subtle,
    ...theme.borders.premium,
  },
  featuredGradient: {
    padding: 24,
    borderRadius: theme.borderRadius.small,
  },
  featuredContent: {
    alignItems: 'center',
  },
  featuredLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: theme.fonts.medium,
  },
  featuredAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
  },
  featuredSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    fontFamily: theme.fonts.regular,
  },
  analyticsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  gridCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    padding: 20,
    minHeight: 140,
    ...theme.shadows.subtle,
    ...theme.borders.premium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: theme.fonts.medium,
  },
  gridAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
    fontFamily: theme.fonts.bold,
    lineHeight: 22,
  },
  gridSubtext: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontWeight: '400',
    fontFamily: theme.fonts.regular,
    opacity: 0.8,
  },
});
