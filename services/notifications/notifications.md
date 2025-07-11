Setup Expo Notifications
Install and configure the expo-notifications package
Request notification permissions from the user
Set up notification handlers
Create Notification Service
Create functions to schedule notifications
Create functions to cancel existing notifications
Handle notification scheduling based on nextRenewal date and reminderDays
Implement Notification Logic
When a subscription is added/updated:
Calculate notification date (nextRenewal - reminderDays)
Cancel any existing notification for that subscription
Schedule new notification
When a subscription is deleted:
Cancel its notification
When user changes global reminderDays:
Reschedule all existing subscription notifications
Update UI Components
Add notification permission request in app startup
Add notification toggle in settings
Show notification status for each subscription