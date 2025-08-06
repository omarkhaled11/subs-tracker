import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";
import { convertToMonthlyAmount, isSubscriptionDueInMonth } from "../utils/helpers";

interface SpendingTrendChartProps {
  subscriptions: SubscriptionItem[];
  currency: string;
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({
  subscriptions,
  currency,
}) => {
  const screenWidth = Dimensions.get("window").width;

  // Generate last 6 months of data
  const generateMonthlyData = () => {
    const currentDate = new Date();
    const monthsData = [];
    const monthLabels = [];

    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = targetDate.getMonth() + 1;
      const year = targetDate.getFullYear();
      
      // Get month name (short format)
      const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' });
      monthLabels.push(monthName);

      // Calculate total spending for this month
      let monthlyTotal = 0;

      subscriptions.forEach(sub => {
        if (sub.interval.toLowerCase() === 'monthly') {
          // Monthly subscriptions contribute every month
          monthlyTotal += sub.amount;
        } else if (sub.interval.toLowerCase() === 'yearly') {
          // Yearly subscriptions contribute their monthly equivalent
          monthlyTotal += sub.amount / 12;
        } else if (sub.interval.toLowerCase() === 'quarterly') {
          // Quarterly subscriptions only contribute in their due months
          if (isSubscriptionDueInMonth(sub, month, year)) {
            monthlyTotal += sub.amount;
          }
        }
      });

      monthsData.push(monthlyTotal);
    }

    return { monthsData, monthLabels };
  };

  const { monthsData, monthLabels } = generateMonthlyData();

  // Calculate some statistics
  const maxSpending = Math.max(...monthsData);
  const minSpending = Math.min(...monthsData);
  const avgSpending = monthsData.reduce((sum, val) => sum + val, 0) / monthsData.length;
  const currentMonthSpending = monthsData[monthsData.length - 1];
  const previousMonthSpending = monthsData[monthsData.length - 2];
  const monthOverMonthChange = currentMonthSpending - previousMonthSpending;
  const monthOverMonthPercentage = previousMonthSpending > 0 
    ? ((monthOverMonthChange / previousMonthSpending) * 100).toFixed(1)
    : '0';

  if (subscriptions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Spending Trends</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📈</Text>
          <Text style={styles.emptyText}>No spending data to display</Text>
        </View>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(70, 130, 180, ${opacity})`, // Steel blue
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#4682B0"
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid lines
      stroke: theme.colors.border,
      strokeWidth: 1,
    },
  };

  const data = {
    labels: monthLabels,
    datasets: [
      {
        data: monthsData,
        color: (opacity = 1) => `rgba(70, 130, 180, ${opacity})`, // Steel blue
        strokeWidth: 3,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>6-Month Spending Trends</Text>
      
      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statValue}>{currency}{currentMonthSpending.toFixed(0)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>vs Last Month</Text>
          <Text style={[
            styles.statValue, 
            monthOverMonthChange > 0 ? styles.statIncrease : styles.statDecrease
          ]}>
            {monthOverMonthChange > 0 ? '+' : ''}{monthOverMonthPercentage}%
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>6-Month Avg</Text>
          <Text style={styles.statValue}>{currency}{avgSpending.toFixed(0)}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={true}
          withShadow={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          withInnerLines={true}
          withOuterLines={false}
          yAxisLabel={currency}
          yAxisSuffix=""
          fromZero={true}
        />
      </View>

      {/* Insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Insights</Text>
        <Text style={styles.insightText}>
          • Highest spending: {currency}{maxSpending.toFixed(0)} ({monthLabels[monthsData.indexOf(maxSpending)]})
        </Text>
        <Text style={styles.insightText}>
          • Lowest spending: {currency}{minSpending.toFixed(0)} ({monthLabels[monthsData.indexOf(minSpending)]})
        </Text>
        {monthOverMonthChange !== 0 && (
          <Text style={styles.insightText}>
            • {monthOverMonthChange > 0 ? 'Increased' : 'Decreased'} by {currency}{Math.abs(monthOverMonthChange).toFixed(0)} from last month
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    ...theme.borders.premium,
    borderRadius: theme.borderRadius.small,
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: theme.fonts.regular,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: theme.fonts.regular,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  statIncrease: {
    color: "#FF6B6B", // Red for increase
  },
  statDecrease: {
    color: "#4ECDC4", // Green for decrease
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  insightsContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    fontFamily: theme.fonts.regular,
  },
  insightText: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    marginBottom: 4,
    lineHeight: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: "center",
    fontFamily: theme.fonts.regular,
  },
}); 