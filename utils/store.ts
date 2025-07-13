import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { SubscriptionItem, UserData } from "./types";
import {
  isSubscriptionDueInMonth,
  convertToMonthlyAmount,
  isUpcomingRenewal,
} from "./helpers";

interface SubscriptionsStore {
  // State
  subscriptions: SubscriptionItem[];
  user: UserData;

  // Actions
  addSubscription: (subscription: Omit<SubscriptionItem, "id">) => void;
  updateSubscription: (id: string, updates: Partial<SubscriptionItem>) => void;
  deleteSubscription: (id: string) => void;
  updateUser: (updates: Partial<UserData>) => void;

  // Getters
  getSubscription: (id: string) => SubscriptionItem | undefined;
  getUser: () => UserData;
  getTotalMonthlyAmount: () => number;
  getUpcomingRenewals: (days?: number) => SubscriptionItem[];
  getMonthlyDueSubscriptions: (
    month: number,
    year: number
  ) => SubscriptionItem[];

  // Analytics Getters
  getTotalYearlyAmount: () => number;
  getMostExpensiveSubscription: () => SubscriptionItem | null;
  getAverageMonthlyAmount: () => number;
  getSubscriptionsByInterval: () => { monthly: number; quarterly: number; yearly: number };

  // Utility
  clearAllSubscriptions: () => void;
}

export const useSubscriptionsStore = create<SubscriptionsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      subscriptions: [],
      user: {
        id: uuid.v4() as string,
        darkMode: false,
        defaultCurrency: "EUR",
        notifications: false,
        reminderDays: 7,
      },

      // Add new subscription
      addSubscription: (subscription) => {
        const newSubscription: SubscriptionItem = {
          ...subscription,
          id: uuid.v4() as string,
        };

        set((state) => ({
          subscriptions: [newSubscription, ...state.subscriptions],
        }));
      },

      // Update user data
      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },

      // Update existing subscription
      updateSubscription: (id, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updates } : sub
          ),
        }));
      },

      // Delete subscription
      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        }));
      },

      // Get single subscription by ID
      getSubscription: (id) => {
        return get().subscriptions.find((sub) => sub.id === id);
      },

      // Get user
      getUser: () => {
        return get().user;
      },

      // Calculate total monthly amount - this now represents actual monthly spending
      getTotalMonthlyAmount: () => {
        const subscriptions = get().subscriptions;
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        return subscriptions.reduce((total, sub) => {
          if (sub.interval.toLowerCase() === "quarterly") {
            // Only include quarterly subscriptions if they're due this month
            if (isSubscriptionDueInMonth(sub, currentMonth, currentYear)) {
              return total + sub.amount;
            }
            return total;
          } else {
            // For other intervals, use the converted amount
            return total + convertToMonthlyAmount(sub.amount, sub.interval);
          }
        }, 0);
      },

      // Get subscriptions with upcoming renewals
      getUpcomingRenewals: (days = 7) => {
        const subscriptions = get().subscriptions;
        return subscriptions
          .filter(
            (sub) => sub.nextRenewal && isUpcomingRenewal(sub.nextRenewal, days)
          )
          .sort((a, b) => {
            // Sort by renewal date, earliest first
            if (!a.nextRenewal || !b.nextRenewal) return 0;

            // Convert strings to Date if necessary
            const dateA =
              typeof a.nextRenewal === "string"
                ? new Date(a.nextRenewal)
                : a.nextRenewal;
            const dateB =
              typeof b.nextRenewal === "string"
                ? new Date(b.nextRenewal)
                : b.nextRenewal;

            // Additional safety check for valid dates
            if (
              !dateA ||
              !dateB ||
              isNaN(dateA.getTime()) ||
              isNaN(dateB.getTime())
            )
              return 0;

            return dateA.getTime() - dateB.getTime();
          });
      },

      // Get subscriptions due in a specific month
      getMonthlyDueSubscriptions: (month, year) => {
        const subscriptions = get().subscriptions;
        return subscriptions.filter((sub) =>
          isSubscriptionDueInMonth(sub, month, year)
        );
      },

      // Analytics Getters
      getTotalYearlyAmount: () => {
        const subscriptions = get().subscriptions;
        return subscriptions.reduce((total, sub) => {
          switch (sub.interval.toLowerCase()) {
            case "monthly":
              return total + (sub.amount * 12);
            case "quarterly":
              return total + (sub.amount * 4);
            case "yearly":
              return total + sub.amount;
            default:
              return total + (sub.amount * 12); // Default to monthly
          }
        }, 0);
      },

      getMostExpensiveSubscription: () => {
        const subscriptions = get().subscriptions;
        if (subscriptions.length === 0) return null;
        
        return subscriptions.reduce((mostExpensive, current) => {
          const currentMonthlyAmount = convertToMonthlyAmount(current.amount, current.interval);
          const mostExpensiveMonthlyAmount = convertToMonthlyAmount(mostExpensive.amount, mostExpensive.interval);
          
          return currentMonthlyAmount > mostExpensiveMonthlyAmount ? current : mostExpensive;
        });
      },

      getAverageMonthlyAmount: () => {
        const subscriptions = get().subscriptions;
        if (subscriptions.length === 0) return 0;
        
        const totalMonthly = subscriptions.reduce((total, sub) => {
          return total + convertToMonthlyAmount(sub.amount, sub.interval);
        }, 0);
        
        return totalMonthly / subscriptions.length;
      },

      getSubscriptionsByInterval: () => {
        const subscriptions = get().subscriptions;
        return subscriptions.reduce(
          (acc, sub) => {
            acc[sub.interval]++;
            return acc;
          },
          { monthly: 0, quarterly: 0, yearly: 0 }
        );
      },

      // Clear all subscriptions (useful for testing/reset)
      clearAllSubscriptions: () => {
        set({ subscriptions: [] });
      },
    }),
    {
      name: "subscriptions-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
