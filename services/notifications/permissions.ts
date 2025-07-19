import { initializeNotifications } from "./index";
import { useSubscriptionsStore } from "../../utils/store";

/**
 * Checks both system permissions and user preferences for notifications
 * @returns Promise<boolean> - true if both system permissions and user preferences allow notifications
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  try {
    const systemPermission = await initializeNotifications();
    const userPreference = useSubscriptionsStore.getState().user.notifications;
    return systemPermission && userPreference;
  } catch (error) {
    console.error("Error checking notification permissions:", error);
    return false;
  }
}

/**
 * Validates if notifications can be scheduled based on permissions and preferences
 * @returns Promise<{ canNotify: boolean; reason?: string }> - Object containing permission status and optional reason if denied
 */
export async function validateNotificationStatus(): Promise<{
  canNotify: boolean;
  reason?: string;
}> {
  const systemPermission = await initializeNotifications();
  const userPreference = useSubscriptionsStore.getState().user.notifications;

  if (!systemPermission) {
    return {
      canNotify: false,
      reason: "System notifications permission not granted",
    };
  }

  if (!userPreference) {
    return {
      canNotify: false,
      reason: "Notifications are disabled in app settings",
    };
  }

  return { canNotify: true };
}

/**
 * Gets the current notification permission status
 * @returns Promise<{ systemPermission: boolean; userPreference: boolean }>
 */
export async function getNotificationStatus(): Promise<{
  systemPermission: boolean;
  userPreference: boolean;
}> {
  const systemPermission = await initializeNotifications();
  const userPreference = useSubscriptionsStore.getState().user.notifications;

  return {
    systemPermission,
    userPreference,
  };
} 