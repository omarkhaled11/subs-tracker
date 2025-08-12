import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Octicons from "@expo/vector-icons/Octicons";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";
import { currencySymbols, intervalLabels } from "../utils/constants";
import { SortPicker } from "./sort-picker";
import { useConfirmationDialogStore } from "../utils/confirmation-dialog-store";

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
  const [sortPickerVisible, setSortPickerVisible] = useState(false);
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const currentlyOpenSwipeable = useRef<string | null>(null);
  const { showConfirmDialog } = useConfirmationDialogStore();
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({});

  const closeCurrentSwipeable = () => {
    if (currentlyOpenSwipeable.current) {
      swipeableRefs.current[currentlyOpenSwipeable.current]?.close();
      currentlyOpenSwipeable.current = null;
    }
  };

  const handleDelete = (item: SubscriptionItem) => {
    closeCurrentSwipeable();
    showConfirmDialog({
      title: "Delete Subscription",
      subtitle: `Are you sure you want to delete ${item.label}?`,
      confirmText: "Delete",
      destructive: true,
      onConfirm: () => onDelete?.(item.id),
    });
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

  const sortedSubscriptions = useMemo(() => {
    return sortBy ? sortSubscriptions(subscriptions, sortBy) : subscriptions;
  }, [subscriptions, sortBy]);

  // Animate items when list changes
  useEffect(() => {
    // Reset all animations to 0 first
    sortedSubscriptions.forEach((item) => {
      if (!animatedValues.current[item.id]) {
        animatedValues.current[item.id] = new Animated.Value(0);
      } else {
        animatedValues.current[item.id].setValue(0);
      }
    });

    // Then animate them in with staggered delays
    sortedSubscriptions.forEach((item, index) => {
      Animated.timing(animatedValues.current[item.id], {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }).start();
    });

    // Clean up removed items
    Object.keys(animatedValues.current).forEach((id) => {
      if (!sortedSubscriptions.find((item) => item.id === id)) {
        delete animatedValues.current[id];
      }
    });
  }, [sortedSubscriptions]);

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
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={closeCurrentSwipeable}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Expenses</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            // closeCurrentSwipeable();
            setSortPickerVisible(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.sortButtonText}>Sort</Text>
          <Octicons name="sort-desc" size={18} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {sortedSubscriptions.map((item) => {
          const animatedValue =
            animatedValues.current[item.id] || new Animated.Value(1);

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.swipeContainer,
                {
                  opacity: animatedValue,
                  transform: [
                    {
                      translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Swipeable
                ref={(ref) => {
                  if (ref) {
                    swipeableRefs.current[item.id] = ref;
                  }
                }}
                renderRightActions={() => renderRightActions(item)}
                rightThreshold={40}
                friction={2}
                onSwipeableWillOpen={() => {
                  // Close previously opened swipeable
                  if (
                    currentlyOpenSwipeable.current &&
                    currentlyOpenSwipeable.current !== item.id
                  ) {
                    swipeableRefs.current[
                      currentlyOpenSwipeable.current
                    ]?.close();
                  }
                  currentlyOpenSwipeable.current = item.id;
                }}
              >
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => {
                    closeCurrentSwipeable();
                    onItemPress?.(item);
                  }}
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
                  <View style={styles.amountSection}>
                    <Text style={styles.amount}>
                      {currencySymbols[item.currency]}
                      {item.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.interval}>
                      {intervalLabels[item.interval]}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            </Animated.View>
          );
        })}
      </View>

      <SortPicker
        visible={sortPickerVisible}
        onClose={() => setSortPickerVisible(false)}
        onSelect={setSortBy}
      />
    </TouchableOpacity>
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
    fontFamily: theme.fonts.bold,
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
    fontFamily: theme.fonts.medium,
    fontWeight: "500",
  },
  listContainer: {},
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
    fontFamily: theme.fonts.bold,
  },
  emptyDescription: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: theme.fonts.medium,
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
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    color: "#1A1A1A",
    fontFamily: theme.fonts.regular,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
    flex: 1,
    fontFamily: theme.fonts.medium,
  },
  amountSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },
  interval: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    fontFamily: theme.fonts.medium,
    marginTop: 2,
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
