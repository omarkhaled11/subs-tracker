export type SubscriptionItem = {
  id: string;
  label: string;
  amount: number;
  interval: SubscriptionInterval;
  currency: Currency;
  nextRenewal: Date | undefined;
  reminderDays: number;
  notificationId: string | undefined;
}

export type UserData = {
  id: string;
  darkMode: boolean;
  defaultCurrency: Currency;
  notifications: boolean;
  reminderDays: number;
};

export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

export type SubscriptionInterval = "monthly" | "quarterly" | "yearly";
