import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import {
  SubscriptionAmountCard,
  UpcomingRenewalCard,
} from "../components/card";
import { SubList } from "../components/sub-list";
import { useSubscriptionsStore } from "../utils/store";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";
import { currencySymbols } from "../utils/constants";
import { ActionButtons } from "../components/action-buttons";
import { ProButton } from "../components/pro-button";

export default function HomeScreen() {
  const {
    subscriptions,
    getTotalMonthlyAmount,
    getUpcomingRenewals,
    deleteSubscription,
    getUser,
  } = useSubscriptionsStore();
  const user = getUser();
  const totalAmount = getTotalMonthlyAmount();
  const upcomingRenewals = getUpcomingRenewals(30); // Get renewals in the next 30 days

  const handleItemPress = (item: SubscriptionItem) => {
    router.push(`/subscription-detail?id=${item.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProButton />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SubscriptionAmountCard
          amount={totalAmount}
          currency={currencySymbols[user.defaultCurrency]}
        />
        {/* <UpcomingRenewalCard upcomingSubscriptions={upcomingRenewals} /> */}
        <ActionButtons />
        <SubList
          subscriptions={subscriptions}
          onDelete={deleteSubscription}
          onItemPress={handleItemPress}
        />
      </ScrollView>
      <StatusBar style="light" />
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
    paddingTop: 10,
    paddingBottom: 100,
  },
});
