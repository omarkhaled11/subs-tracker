import { useSubscriptionsStore } from "../../utils/store";
import { checkNotificationPermissions } from "./permissions";
import { scheduleAllSubscriptionReminders } from "./reminder";
import { cancelAllNotifications } from "./index";

/**
 * Handles changes to the notification enabled/disabled state
 */
export async function handleNotificationStateChange(enabled: boolean): Promise<void> {
  try {
    if (!enabled) {
      await cancelAllNotifications();
      return;
    }

    const canNotify = await checkNotificationPermissions();
    if (!canNotify) {
      console.log("Cannot schedule notifications: permissions not granted");
      return;
    }

    const store = useSubscriptionsStore.getState();
    const subscriptions = store.subscriptions;
    const { reminderDays } = store.user;

    // Reschedule all notifications with current settings
    await scheduleAllSubscriptionReminders(subscriptions, reminderDays);
  } catch (error) {
    console.error("Error handling notification state change:", error);
  }
}

/**
 * Handles changes to the reminder days setting
 */
export async function handleReminderDaysChange(days: number): Promise<void> {
  try {
    const canNotify = await checkNotificationPermissions();
    if (!canNotify) {
      console.log("Cannot update notifications: permissions not granted");
      return;
    }

    // Cancel all existing notifications
    await cancelAllNotifications();

    // Reschedule all notifications with new reminder days
    const subscriptions = useSubscriptionsStore.getState().subscriptions;
    await scheduleAllSubscriptionReminders(subscriptions, days);
  } catch (error) {
    console.error("Error handling reminder days change:", error);
  }
}

/**
 * Reschedules all notifications with current settings
 * Useful when system permissions change or app is restarted
 */
export async function rescheduleAllNotifications(): Promise<void> {
  try {
    const canNotify = await checkNotificationPermissions();
    if (!canNotify) {
      console.log("Cannot reschedule notifications: permissions not granted");
      return;
    }

    const store = useSubscriptionsStore.getState();
    const subscriptions = store.subscriptions;
    const { reminderDays } = store.user;

    // Cancel existing notifications before rescheduling
    await cancelAllNotifications();
    await scheduleAllSubscriptionReminders(subscriptions, reminderDays);
  } catch (error) {
    console.error("Error rescheduling all notifications:", error);
  }
} 