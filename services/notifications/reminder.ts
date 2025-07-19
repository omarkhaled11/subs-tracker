import { SubscriptionItem } from "../../utils/types";
import { scheduleNotification, cancelNotification } from "./index";
import { checkNotificationPermissions } from "./permissions";

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
  try {
    const canNotify = await checkNotificationPermissions();
    if (!canNotify) {
      console.log("Notifications are not enabled or permitted");
      return undefined;
    }

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
