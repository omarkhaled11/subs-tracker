import { storeRating } from './storeRating';
import { useConfirmationDialogStore } from './confirmation-dialog-store';

interface RatingTriggerConfig {
  // Milestone triggers
  subscriptionMilestone?: number; // Trigger after N subscriptions
  
  // Callback for when rating should be shown
  onShouldShowRating?: () => void;
}

class SmartRatingTrigger {
  private config: RatingTriggerConfig;

  constructor(config: RatingTriggerConfig = {}) {
    this.config = {
      subscriptionMilestone: 3, // Default: after 3rd subscription
      ...config,
    };
  }

  /**
   * Check if rating should be triggered after adding subscription
   */
  async checkSubscriptionMilestone(subscriptionCount: number): Promise<void> {
    try {
      console.log('checkSubscriptionMilestone', subscriptionCount);
      // Only check if we've hit the milestone
      if (subscriptionCount !== this.config.subscriptionMilestone) {
        return;
      }

      // Check if user should be prompted based on timing/usage rules
      const shouldPrompt = await storeRating.shouldPromptForRating();
      if (!shouldPrompt) {
        return;
      }

      // Initialize store rating if needed
      await storeRating.initialize();

      // Trigger the rating prompt
      if (this.config.onShouldShowRating) {
        this.config.onShouldShowRating();
      } else {
        // Default behavior - show confirmation dialog
        this.showDefaultRatingDialog();
      }
    } catch (error) {
      console.error('Error checking subscription milestone for rating:', error);
    }
  }

  /**
   * Default rating dialog implementation
   */
  private showDefaultRatingDialog(): void {
    const { showConfirmDialog } = useConfirmationDialogStore.getState();
    
    showConfirmDialog({
      title: "You're on a roll! 🎉",
      subtitle: "You've added 3 subscriptions! Enjoying Chrima so far? A quick rating would help us a lot.",
      confirmText: "Rate Chrima",
      cancelText: "Maybe Later",
      onConfirm: async () => {
        try {
          const success = await storeRating.promptForRating();
          if (!success) {
            // Could add fallback UI here if needed
            console.log("Store rating failed - could show fallback message");
          }
        } catch (error) {
          console.error("Store rating error:", error);
        }
      },
      onCancel: async () => {
        // Record that user was prompted (for frequency control)
        await storeRating.recordPrompt();
      },
    });
  }

  /**
   * Check other potential trigger points (can be expanded)
   */
  async checkOtherTriggers(): Promise<void> {
    // Future triggers can be added here:
    // - After successful data export
    // - After 7 days of usage
    // - After completing certain actions
  }
}

// Export default instance
export const smartRatingTrigger = new SmartRatingTrigger();

// Export class for custom configurations
export { SmartRatingTrigger };

// Export types
export type { RatingTriggerConfig };