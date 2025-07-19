import { SubscriptionItem } from "../../utils/types";
import { useSubscriptionsStore } from "../../utils/store";
import { checkNotificationPermissions } from "./permissions";
import {
  scheduleSubscriptionReminder,
  rescheduleSubscriptionReminder,
} from "./reminder";
import { cancelNotification } from "./index";

/**
 * Handles notification scheduling for a new subscription
 */
export async function handleNewSubscriptionNotification(
  subscription: SubscriptionItem
): Promise<string | undefined> {
  try {
    const canNotify = await checkNotificationPermissions();
    if (!canNotify) return undefined;

    const { reminderDays } = useSubscriptionsStore.getState().user;
    return await scheduleSubscriptionReminder(subscription, reminderDays);
  } catch (error) {
    console.error("Error handling new subscription notification:", error);
    return undefined;
  }
}

/**
 * Handles notification updates when a subscription is modified
 */
export async function handleSubscriptionUpdateNotification(
  subscription: SubscriptionItem,
  previousNextRenewal?: Date | null
): Promise<string | undefined> {
  try {
    const canNotify = await checkNotificationPermissions();
    if (!canNotify) return undefined;

    // If the renewal date hasn't changed, no need to reschedule
    if (
      previousNextRenewal &&
      subscription.nextRenewal &&
      new Date(previousNextRenewal).getTime() === new Date(subscription.nextRenewal).getTime()
    ) {
      return subscription.notificationId;
    }

    const { reminderDays } = useSubscriptionsStore.getState().user;
    return await rescheduleSubscriptionReminder(subscription, reminderDays);
  } catch (error) {
    console.error("Error handling subscription update notification:", error);
    return undefined;
  }
}

/**
 * Handles notification cleanup when a subscription is deleted
 */
export async function handleSubscriptionDeleteNotification(
  subscription: SubscriptionItem
): Promise<void> {
  try {
    if (subscription.notificationId) {
      await cancelNotification(subscription.notificationId);
    }
  } catch (error) {
    console.error("Error handling subscription deletion notification:", error);
  }
}

/**
 * Updates the notification ID in the subscription store
 */
export function updateSubscriptionNotificationId(
  subscriptionId: string,
  notificationId: string | undefined
): void {
  useSubscriptionsStore.getState().updateSubscription(subscriptionId, {
    notificationId,
  });
} 