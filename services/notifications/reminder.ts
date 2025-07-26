import { SubscriptionItem } from "../../utils/types";
import { scheduleNotification, cancelNotification, getAllScheduledNotifications } from "./index";
import { checkNotificationPermissions } from "./permissions";

// Calculate the reminder date based on subscription renewal and reminder days
function calculateReminderDate(nextRenewal: Date, reminderDays: number): Date {
  const reminderDate = new Date(nextRenewal);
  reminderDate.setDate(reminderDate.getDate() - reminderDays);
  return reminderDate;
}

// Calculate days between two dates
function calculateDaysBetween(date1: Date, date2: Date): number {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Schedule a reminder notification for a subscription
export async function scheduleSubscriptionReminder(
  subscription: SubscriptionItem,
  reminderDays: number
): Promise<string | undefined> {
  try {
    const canNotify = await checkNotificationPermissions();
    if (!canNotify) {
      console.log("Notifications are not enabled or permitted");
      return undefined;
    }

    if (!subscription.nextRenewal) {
      return undefined;
    }

    const nextRenewalDate = new Date(subscription.nextRenewal);
    const now = new Date();
    
    console.log("Debug - Scheduling notification:");
    console.log("Next renewal date:", nextRenewalDate.toISOString());
    console.log("Current date:", now.toISOString());
    console.log("Reminder days:", reminderDays);
    
    // Don't schedule if renewal date is in the past
    if (nextRenewalDate.getTime() <= now.getTime()) {
      console.log("Renewal date is in the past, skipping notification");
      return undefined;
    }

    // Calculate days until renewal
    const daysUntilRenewal = calculateDaysBetween(now, nextRenewalDate);
    console.log("Days until renewal:", daysUntilRenewal);

    // Only schedule if days until renewal is greater than reminder days
    if (daysUntilRenewal <= reminderDays) {
      console.log("Renewal is too soon (within reminder days), skipping notification");
      return undefined;
    }

    const reminderDate = calculateReminderDate(nextRenewalDate, reminderDays);
    console.log("Calculated reminder date:", reminderDate.toISOString());

    // Calculate actual days until renewal from the reminder date
    const daysUntilRenewalFromReminder = calculateDaysBetween(reminderDate, nextRenewalDate);
    console.log("Days until renewal from reminder date:", daysUntilRenewalFromReminder);

    const notificationId = await scheduleNotification(
      {
        title: "Subscription Renewal Reminder",
        body: `Your subscription for ${subscription.label} will renew in ${daysUntilRenewalFromReminder} days`,
        data: { subscriptionId: subscription.id },
      },
      reminderDate
    );
    
    console.log("Notification scheduled with ID:", notificationId);

    // Show all scheduled notifications
    await getAllScheduledNotifications();
    
    return notificationId;
  } catch (error) {
    console.error("Error scheduling subscription reminder:", error);
    return undefined;
  }
}

// Reschedule a reminder notification for a subscription
export async function rescheduleSubscriptionReminder(
  subscription: SubscriptionItem,
  reminderDays: number
): Promise<string | undefined> {
  try {
    const canNotify = await checkNotificationPermissions();
    if (!canNotify) {
      console.log("Notifications are not enabled or permitted");
      return undefined;
    }

    // Cancel existing notification if it exists
    if (subscription.notificationId) {
      await cancelNotification(subscription.notificationId);
    }

    // Schedule new notification
    return await scheduleSubscriptionReminder(subscription, reminderDays);
  } catch (error) {
    console.error("Error rescheduling subscription reminder:", error);
    return undefined;
  }
}

// Schedule reminders for multiple subscriptions
export async function scheduleAllSubscriptionReminders(
  subscriptions: SubscriptionItem[],
  reminderDays: number
): Promise<void> {
  try {
    const canNotify = await checkNotificationPermissions();
    if (!canNotify) {
      console.log("Notifications are not enabled or permitted");
      return;
    }

    for (const subscription of subscriptions) {
      await scheduleSubscriptionReminder(subscription, reminderDays);
    }
  } catch (error) {
    console.error("Error scheduling all subscription reminders:", error);
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
