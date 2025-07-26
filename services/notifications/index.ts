import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    severity: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

// Configure notification behavior
export async function configureNotifications() {
  // Set default behavior for how notifications should be handled when the app is running
  await Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const trigger = notification.request.trigger as any;
      const isScheduledNotification = trigger && 
                                    (trigger.type === 'timeInterval' || trigger.type === 'date');
      const notificationDate = new Date(notification.date);
      const isInFuture = notificationDate.getTime() > Date.now();

      return {
        shouldShowAlert: !isScheduledNotification || !isInFuture,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        severity: Notifications.AndroidNotificationPriority.HIGH,
      };
    },
  });
}

export type NotificationContent = {
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

// Initialize notifications and request permissions
export async function initializeNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  if (Platform.OS === "android") {
    await setupAndroidChannel();
  }

  // Configure notification behavior
  await configureNotifications();

  return true;
}

// Set up Android notification channel
export async function setupAndroidChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}

// Schedule a notification
export async function scheduleNotification(
  content: NotificationContent,
  date: Date
): Promise<string | undefined> {
  try {
    // Don't schedule if the date is in the past
    if (date.getTime() <= Date.now()) {
      return undefined;
    }

    // Set the time to 6 PM UTC
    const notificationDate = new Date(date);
    notificationDate.setUTCHours(16, 0, 0, 0);

    console.log('Notification will be scheduled for:', notificationDate.toISOString());

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        data: content.data || {},
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationDate,
      },
    });

    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return undefined;
  }
}

// Cancel a specific notification
export async function cancelNotification(
  notificationId: string
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
}

// Cancel all scheduled notifications
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error canceling all notifications:", error);
  }
}

// Get all scheduled notifications - for debugging only
export async function getAllScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Debug - All scheduled notifications:');
    notifications.forEach(notification => {
      console.log('Full trigger object:', notification.trigger);
      
      // Convert seconds to readable time
      const trigger = notification.trigger as any;
      if (trigger.type === 'timeInterval') {
        const seconds = trigger.seconds;
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((seconds % (60 * 60)) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        const scheduledDate = new Date(Date.now() + (seconds * 1000));
        
        console.log(`- "${notification.content.title}":`);
        console.log(`  Will fire in: ${days}d ${hours}h ${minutes}m ${remainingSeconds}s`);
        console.log(`  Scheduled for: ${scheduledDate.toLocaleString()}`);
      }
      
      console.log('  Body:', notification.content.body);
      console.log('  Data:', notification.content.data);
    });
    return notifications;
  } catch (error) {
    console.error("Error getting scheduled notifications:", error);
    return [];
  }
}

// Add notification response handler
export function addNotificationResponseHandler(
  handler: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(handler);
}

// Add notification received handler
export function addNotificationReceivedHandler(
  handler: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(handler);
}
