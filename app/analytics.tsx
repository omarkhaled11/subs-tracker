import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A0826', 'black']}
        // colors={['blue', 'red']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.title}>Analytics</Text>
                <Text style={styles.subtitle}>Your spending insights</Text>
              </View>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>PRO</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <AnalyticsSummaryCards
              monthlyTotal={monthlyTotal}
              yearlyTotal={yearlyTotal}
              mostExpensiveSubscription={mostExpensiveSubscription}
              averageMonthly={averageMonthly}
              currency={currencySymbols[user.defaultCurrency]}
            />
          </View>

          <View style={styles.section}>
            <RenewalTimeline
              subscriptions={subscriptions}
              currency={currencySymbols[user.defaultCurrency]}
            />
          </View>

          <View style={styles.section}>
            <SpendingPieChart
              subscriptions={subscriptions}
              currency={currencySymbols[user.defaultCurrency]}
            />
          </View>

          <View style={styles.section}>
            <SpendingTrendChart
              subscriptions={subscriptions}
              currency={currencySymbols[user.defaultCurrency]}
            />
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 100,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: theme.colors.secondaryText,
    fontFamily: theme.fonts.regular,
    opacity: 0.8,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: theme.fonts.medium,
    letterSpacing: 1,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 4,
    ...theme.shadows.subtle,
  },
  bottomPadding: {
    height: 40,
  },
});
