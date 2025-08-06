import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";
import { convertToMonthlyAmount } from "../utils/helpers";

interface SpendingPieChartProps {
  subscriptions: SubscriptionItem[];
  currency: string;
}

export const SpendingPieChart: React.FC<SpendingPieChartProps> = ({
  subscriptions,
  currency,
}) => {
  const screenWidth = Dimensions.get("window").width;

  // Generate colors for the pie chart
  const generateColors = (count: number) => {
    const colors = [
      "#84CC16", // Primary green
      "#06B6D4", // Cyan
      "#8B5CF6", // Violet
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#EC4899", // Pink
      "#10B981", // Emerald
      "#3B82F6", // Blue
      "#F97316", // Orange
      "#8B5A2B", // Brown
      "#6B7280", // Gray
      "#14B8A6", // Teal
    ];
    return colors.slice(0, count);
  };

  // Prepare data for the pie chart
  const prepareChartData = () => {
    if (subscriptions.length === 0) {
      return [];
    }

    // Convert all subscriptions to monthly amounts for fair comparison
    const subscriptionData = subscriptions.map((sub) => ({
      name: sub.label,
      amount: convertToMonthlyAmount(sub.amount, sub.interval),
      color: "#FF6B6B", // Will be overridden
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    }));

    // Sort by amount (highest first) and take top 8 to avoid cluttering
    const sortedData = subscriptionData
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    // If there are more than 8 subscriptions, group the rest as "Others"
    if (subscriptions.length > 8) {
      const othersAmount = subscriptionData
        .slice(8)
        .reduce((sum, item) => sum + item.amount, 0);
      
      if (othersAmount > 0) {
        sortedData.push({
          name: "Others",
          amount: othersAmount,
          color: "#95A5A6",
          legendFontColor: theme.colors.text,
          legendFontSize: 12,
        });
      }
    }

    // Assign colors
    const colors = generateColors(sortedData.length);
    return sortedData.map((item, index) => ({
      ...item,
      color: colors[index] || "#95A5A6",
    }));
  };

  const chartData = prepareChartData();

  if (subscriptions.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.titleSection}>
          <View style={styles.titleHeader}>
            <Ionicons name="pie-chart" size={24} color={theme.colors.primary} />
            <Text style={styles.title}>Spending Breakdown</Text>
          </View>
          <Text style={styles.subtitle}>Monthly comparison</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.emptyState}>
            <Ionicons name="analytics" size={48} color={theme.colors.secondary} />
            <Text style={styles.emptyText}>No expenses to display</Text>
          </View>
        </View>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.titleSection}>
        <View style={styles.titleHeader}>
          <Ionicons name="pie-chart" size={24} color={theme.colors.primary} />
          <Text style={styles.title}>Spending Breakdown</Text>
        </View>
        <Text style={styles.subtitle}>Monthly comparison</Text>
      </View>
      
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth - 80}
            height={200}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[0, 0]}
            absolute={false}
          />
        </View>
        
        <View style={styles.legendContainer}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendContent}>
                <Text style={styles.legendName}>{item.name}</Text>
                <Text style={styles.legendAmount}>
                  {currency}{item.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
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
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: 20,
    padding: 24,
    ...theme.shadows.subtle,
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
  chartContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.small,
    padding: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendName: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontWeight: '600',
    flex: 1,
  },
  legendAmount: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontWeight: '600',
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