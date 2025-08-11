import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";
import {
  convertToMonthlyAmount,
  isSubscriptionDueInMonth,
} from "../utils/helpers";

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
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const month = targetDate.getMonth() + 1;
      const year = targetDate.getFullYear();

      // Get month name (short format)
      const monthName = targetDate.toLocaleDateString("en-US", {
        month: "short",
      });
      monthLabels.push(monthName);

      // Calculate total spending for this month
      let monthlyTotal = 0;

      subscriptions.forEach((sub) => {
        if (sub.interval.toLowerCase() === "monthly") {
          // Monthly subscriptions contribute every month
          monthlyTotal += sub.amount;
        } else if (sub.interval.toLowerCase() === "yearly") {
          // Yearly subscriptions contribute their monthly equivalent
          monthlyTotal += sub.amount / 12;
        } else if (sub.interval.toLowerCase() === "quarterly") {
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
  const avgSpending =
    monthsData.reduce((sum, val) => sum + val, 0) / monthsData.length;
  const currentMonthSpending = monthsData[monthsData.length - 1];
  const previousMonthSpending = monthsData[monthsData.length - 2];
  const monthOverMonthChange = currentMonthSpending - previousMonthSpending;
  const monthOverMonthPercentage =
    previousMonthSpending > 0
      ? ((monthOverMonthChange / previousMonthSpending) * 100).toFixed(1)
      : "0";

  if (subscriptions.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.titleSection}>
          <View style={styles.titleHeader}>
            <Ionicons
              name="trending-up"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.title}>Spending Trends</Text>
          </View>
          <Text style={styles.subtitle}>Last 6 months</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.emptyState}>
            <Ionicons
              name="analytics-outline"
              size={48}
              color={theme.colors.secondary}
            />
            <Text style={styles.emptyText}>No spending data to display</Text>
          </View>
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
      stroke: "#4682B0",
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
    <View style={styles.wrapper}>
      <View style={styles.titleSection}>
        <View style={styles.titleHeader}>
          <Ionicons name="trending-up" size={24} color={theme.colors.primary} />
          <Text style={styles.title}>Spending Trends</Text>
        </View>
        <Text style={styles.subtitle}>Last 6 months</Text>
      </View>

      <View style={styles.container}>
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons
                name="calendar"
                size={16}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>
              {currency}
              {currentMonthSpending.toFixed(0)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons
                name="trending-up"
                size={16}
                color={monthOverMonthChange > 0 ? "#EF4444" : "#10B981"}
              />
            </View>
            <Text style={styles.statLabel}>vs Last Month</Text>
            <Text
              style={[
                styles.statValue,
                monthOverMonthChange > 0
                  ? styles.statIncrease
                  : styles.statDecrease,
              ]}
            >
              {monthOverMonthChange > 0 ? "+" : ""}
              {monthOverMonthPercentage}%
            </Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons
                name="bar-chart"
                size={16}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.statLabel}>6-Month Avg</Text>
            <Text style={styles.statValue}>
              {currency}
              {avgSpending.toFixed(0)}
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={data}
            width={screenWidth - 80}
            height={200}
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
          <View style={styles.insightsHeader}>
            <Ionicons name="bulb" size={16} color={theme.colors.primary} />
            <Text style={styles.insightsTitle}>Key Insights</Text>
          </View>
          <View style={styles.insightItem}>
            <Ionicons
              name="arrow-up"
              size={12}
              color={theme.colors.secondary}
            />
            <Text style={styles.insightText}>
              Highest: {currency}
              {maxSpending.toFixed(0)} in{" "}
              {monthLabels[monthsData.indexOf(maxSpending)]}
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Ionicons
              name="arrow-down"
              size={12}
              color={theme.colors.secondary}
            />
            <Text style={styles.insightText}>
              Lowest: {currency}
              {minSpending.toFixed(0)} in{" "}
              {monthLabels[monthsData.indexOf(minSpending)]}
            </Text>
          </View>
          {monthOverMonthChange !== 0 && (
            <View style={styles.insightItem}>
              <Ionicons
                name="swap-horizontal"
                size={12}
                color={theme.colors.secondary}
              />
              <Text style={styles.insightText}>
                {monthOverMonthChange > 0 ? "Increased" : "Decreased"} by{" "}
                {currency}
                {Math.abs(monthOverMonthChange).toFixed(0)} from last month
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  titleSection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  titleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    fontFamily: theme.fonts.regular,
    opacity: 0.8,
    marginLeft: 36,
  },
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: 20,
    overflow: "hidden",
    ...theme.shadows.subtle,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
    gap: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  statIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(132, 204, 22, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.secondaryText,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: theme.fonts.medium,
    textAlign: "center",
    height: 28,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  statIncrease: {
    color: "#EF4444", // Red for increase
  },
  statDecrease: {
    color: "#10B981", // Green for decrease
  },
  chartContainer: {
    paddingVertical: 16,
  },
  chart: {
    borderRadius: theme.borderRadius.small,
  },
  insightsContainer: {
    backgroundColor: theme.colors.background,
    padding: 20,
    gap: 12,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  insightText: {
    fontSize: 13,
    color: theme.colors.secondaryText,
    lineHeight: 18,
    fontFamily: theme.fonts.regular,
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: "center",
    fontFamily: theme.fonts.regular,
    opacity: 0.8,
  },
});
