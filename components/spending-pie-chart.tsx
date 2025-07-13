import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
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
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
      "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
      "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D2B4DE"
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
      <View style={styles.container}>
        <Text style={styles.title}>Spending Breakdown</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>No expenses to display</Text>
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
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Spending Breakdown</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute={false}
        />
      </View>
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.name}: {currency}{item.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    margin: 16,
    marginTop: 0,
    padding: 16,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: theme.fonts.regular,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "48%",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.text,
    flex: 1,
    fontFamily: theme.fonts.regular,
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