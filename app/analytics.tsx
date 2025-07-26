import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { theme } from "../utils/theme";
import { AnalyticsSummaryCards } from "../components/analytics-card";
import { SpendingPieChart } from "../components/spending-pie-chart";
import { SpendingTrendChart } from "../components/spending-trend-chart";
import { RenewalTimeline } from "../components/renewal-timeline";
import { useSubscriptionsStore } from "../utils/store";
import { currencySymbols } from "../utils/constants";

export default function AnalyticsScreen() {
  const {
    subscriptions,
    getTotalMonthlyAmount,
    getTotalYearlyAmount,
    getMostExpensiveSubscription,
    getAverageMonthlyAmount,
    getUser,
  } = useSubscriptionsStore();

  const user = getUser();
  const monthlyTotal = getTotalMonthlyAmount();
  const yearlyTotal = getTotalYearlyAmount();
  const mostExpensiveSubscription = getMostExpensiveSubscription();
  const averageMonthly = getAverageMonthlyAmount();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Your spending insights</Text>
        </View>

        <AnalyticsSummaryCards
          monthlyTotal={monthlyTotal}
          yearlyTotal={yearlyTotal}
          mostExpensiveSubscription={mostExpensiveSubscription}
          averageMonthly={averageMonthly}
          currency={currencySymbols[user.defaultCurrency]}
        />

        <RenewalTimeline
          subscriptions={subscriptions}
          currency={currencySymbols[user.defaultCurrency]}
        />

        <SpendingPieChart
          subscriptions={subscriptions}
          currency={currencySymbols[user.defaultCurrency]}
        />

        <SpendingTrendChart
          subscriptions={subscriptions}
          currency={currencySymbols[user.defaultCurrency]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
  },
});
