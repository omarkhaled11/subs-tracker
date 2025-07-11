import { SubscriptionItem } from "./types";

// Helper function to convert subscription amounts to monthly equivalent for display purposes only
// NOTE: Quarterly subscriptions are NOT divided by 3 - they maintain their full amount
export const convertToMonthlyAmount = (
  amount: number,
  interval: string
): number => {
  switch (interval.toLowerCase()) {
    case "weekly":
      return amount * 4.33; // Average weeks per month
    case "monthly":
      return amount;
    case "quarterly":
      return amount; // Keep full amount, don't divide by 3
    case "yearly":
      return amount / 12;
    default:
      return amount; // Default to monthly if unknown
  }
};

// Helper function to check if a subscription is due in a specific month
export const isSubscriptionDueInMonth = (
  subscription: SubscriptionItem,
  month: number,
  year: number
): boolean => {
  if (!subscription.nextRenewal) return false;

  // Convert string to Date if necessary
  const renewalDate =
    typeof subscription.nextRenewal === "string"
      ? new Date(subscription.nextRenewal)
      : subscription.nextRenewal;

  // Check if date is valid
  if (isNaN(renewalDate.getTime())) return false;

  const renewalMonth = renewalDate.getMonth() + 1; // getMonth() returns 0-11
  const renewalYear = renewalDate.getFullYear();

  if (subscription.interval.toLowerCase() === "quarterly") {
    // For quarterly subscriptions, check if this month is a renewal month
    // Based on the renewal date, calculate all quarters for the year
    const startMonth = renewalMonth;
    const quarterMonths = [startMonth];

    // Add the other quarters
    for (let i = 1; i < 4; i++) {
      const nextQuarterMonth = ((startMonth - 1 + i * 3) % 12) + 1;
      quarterMonths.push(nextQuarterMonth);
    }

    return quarterMonths.includes(month) && renewalYear === year;
  }

  // For other intervals, use existing logic
  return renewalMonth === month && renewalYear === year;
};

// Helper function to check if renewal is upcoming
export const isUpcomingRenewal = (
  renewalDate: Date | string | undefined,
  withinDays: number
): boolean => {
  if (!renewalDate) return false;

  // Convert string to Date if necessary
  const date =
    typeof renewalDate === "string" ? new Date(renewalDate) : renewalDate;

  // Check if date is valid and exists
  if (!date || isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

  const renewalDateOnly = new Date(date);
  renewalDateOnly.setHours(0, 0, 0, 0); // Reset time to start of day

  const timeDiff = renewalDateOnly.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff >= 0 && daysDiff <= withinDays;
};

// Helper function to get days until renewal
export const getDaysUntilRenewal = (date: Date | string | undefined) => {
  if (!date) return 0;

  // Convert string to Date if necessary
  const renewalDate = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (!renewalDate || isNaN(renewalDate.getTime())) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const renewalDateOnly = new Date(renewalDate);
  renewalDateOnly.setHours(0, 0, 0, 0); // Reset time to start of day
    
  const timeDiff = renewalDateOnly.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
};