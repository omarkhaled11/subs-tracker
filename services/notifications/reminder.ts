import { SubscriptionItem } from "../../utils/types";
import { scheduleNotification, cancelNotification } from "./index";

// Calculate the reminder date based on subscription renewal and reminder days
function calculateReminderDate(nextRenewal: Date, reminderDays: number): Date {
  const reminderDate = new Date(nextRenewal);
  reminderDate.setDate(reminderDate.getDate() - reminderDays);
  return reminderDate;
}

// Schedule a reminder notification for a subscription
export async function scheduleSubscriptionReminder(
  subscription: SubscriptionItem,
  reminderDays: number
): Promise<string | undefined> {
  if (!subscription.nextRenewal) {
    return undefined;
  }

  const reminderDate = calculateReminderDate(
    new Date(subscription.nextRenewal),
    reminderDays
  );

  return await scheduleNotification(
    {
      title: "Subscription Renewal Reminder",
      body: `Your subscription for ${subscription.label} will renew in ${reminderDays} days`,
      data: { subscriptionId: subscription.id },
    },
    reminderDate
  );
}

// Reschedule a reminder notification for a subscription
export async function rescheduleSubscriptionReminder(
  subscription: SubscriptionItem,
  reminderDays: number
): Promise<string | undefined> {
  // Cancel existing notification if it exists
  if (subscription.notificationId) {
    await cancelNotification(subscription.notificationId);
  }

  // Schedule new notification
  return await scheduleSubscriptionReminder(subscription, reminderDays);
}

// Schedule reminders for multiple subscriptions
export async function scheduleAllSubscriptionReminders(
  subscriptions: SubscriptionItem[],
  reminderDays: number
): Promise<void> {
  for (const subscription of subscriptions) {
    await scheduleSubscriptionReminder(subscription, reminderDays);
  }
}

// Handle notification response
export function handleReminderNotificationResponse(
  subscriptionId: string,
  onSubscriptionSelect: (id: string) => void
) {
  if (subscriptionId) {
    onSubscriptionSelect(subscriptionId);
  }
}
