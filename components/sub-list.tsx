import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Octicons from "@expo/vector-icons/Octicons";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";
import { currencySymbols } from "../utils/constants";

type SortOption = "highest" | "lowest" | "nearest";

interface SubListProps {
  subscriptions?: SubscriptionItem[];
  onDelete?: (id: string) => void;
  onItemPress?: (item: SubscriptionItem) => void;
}

const sortSubscriptions = (
  items: SubscriptionItem[],
  sortBy: SortOption
): SubscriptionItem[] => {
  const sortedItems = [...items];

  switch (sortBy) {
    case "highest":
      return sortedItems.sort((a, b) => b.amount - a.amount);
    case "lowest":
      return sortedItems.sort((a, b) => a.amount - b.amount);
    case "nearest":
      return sortedItems.sort((a, b) => {
        const dateA = new Date(a.nextRenewal || new Date());
        const dateB = new Date(b.nextRenewal || new Date());
        return dateA.getTime() - dateB.getTime();
      });
    default:
      return sortedItems;
  }
};

export function SubList({
  subscriptions = [],
  onDelete,
  onItemPress,
}: SubListProps) {
  const [sortBy, setSortBy] = useState<SortOption | null>(null);

  const handleDelete = (item: SubscriptionItem) => {
    Alert.alert(
      "Delete Subscription",
      `Are you sure you want to delete ${item.label}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete?.(item.id),
        },
      ]
    );
  };

  const handleSort = () => {
    Alert.alert("Sort Expenses", "Choose a sorting option", [
      {
        text: "Highest Expense",
        onPress: () => setSortBy("highest"),
      },
      {
        text: "Lowest Expense",
        onPress: () => setSortBy("lowest"),
      },
      {
        text: "Nearest Renewal",
        onPress: () => setSortBy("nearest"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const renderRightActions = (item: SubscriptionItem) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDelete(item)}
        activeOpacity={0.8}
      >
        <Octicons name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  const sortedSubscriptions = sortBy
    ? sortSubscriptions(subscriptions, sortBy)
    : subscriptions;

  // Show empty state if no subscriptions
  if (subscriptions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Expenses</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💸</Text>
          <Text style={styles.emptyTitle}>No expenses yet</Text>
          <Text style={styles.emptyDescription}>
            Tap the + button to add your first expense
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Expenses</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={handleSort}
          activeOpacity={0.8}
        >
          <Text style={styles.sortButtonText}>Sort</Text>
          <Octicons name="sort-desc" size={18} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {sortedSubscriptions.map((item) => (
          <View key={item.id} style={styles.swipeContainer}>
            <Swipeable
              renderRightActions={() => renderRightActions(item)}
              rightThreshold={40}
              friction={2}
            >
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => onItemPress?.(item)}
                activeOpacity={1}
              >
                <View style={styles.leftSection}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>
                      {currencySymbols[item.currency]}
                    </Text>
                  </View>
                  <Text style={styles.label}>{item.label}</Text>
                </View>
                <Text style={styles.amount}>
                  {currencySymbols[item.currency]}
                  {item.amount.toFixed(2)}
                </Text>
              </TouchableOpacity>
            </Swipeable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  sortButtonText: {
    marginRight: 8,
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  listContainer: {
    // Removed flex: 1 and replaced ScrollView with View
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    fontFamily: theme.fonts.regular,
  },
  emptyDescription: {
    fontSize: 14,
    color: theme.colors.secondary,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: theme.fonts.regular,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.small,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    fontFamily: theme.fonts.regular,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
    flex: 1,
    fontFamily: theme.fonts.regular,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
  },
  deleteAction: {
    backgroundColor: theme.colors.error,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  swipeContainer: {
    backgroundColor: theme.colors.error,
    marginBottom: 8,
    borderRadius: 14,
  },
});
