import * as StoreReview from "expo-store-review";
import { Platform, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
  // Basic usage 
  import { storeRating } from './utils/storeRating';
  await storeRating.promptForRating();

  // Advanced usage with custom config
  import { StoreRatingManager } from './utils/storeRating';

  const customRating = new StoreRatingManager({
    iosAppId: "1234567890",
    androidPackageName: "com.mycompany.myapp",
    minimumUsageTime: 7, // 7 days before first prompt
    maxRatingPrompts: 5, // Allow up to 5 prompts
    daysBeforeRetry: 60, // 60 days between prompts
  });
*/

interface StoreRatingConfig {
  // App Store URLs for fallback
  iosAppId?: string; // e.g., "1234567890"
  androidPackageName?: string; // e.g., "com.yourcompany.yourapp"

  // Rating frequency controls
  minimumUsageTime?: number; // Minimum app usage time in days before showing rating
  maxRatingPrompts?: number; // Maximum times to show rating prompt
  daysBeforeRetry?: number; // Days to wait before showing again after dismissal
}

interface RatingState {
  hasRated: boolean;
  promptCount: number;
  lastPromptDate: string | null;
  installDate: string;
}

const STORAGE_KEY = "@app_rating_state";

class StoreRatingManager {
  private config: StoreRatingConfig;

  constructor(config: StoreRatingConfig = {}) {
    this.config = {
      minimumUsageTime: 3, // Default: 3 days
      maxRatingPrompts: 3, // Default: max 3 prompts
      daysBeforeRetry: 30, // Default: wait 30 days before retry
      ...config,
    };
  }

  /**
   * Initialize the rating state (call this when app starts)
   */
  async initialize(): Promise<void> {
    try {
      const state = await this.getRatingState();
      if (!state.installDate) {
        // First time - set install date
        await this.updateRatingState({
          ...state,
          installDate: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to initialize store rating:", error);
    }
  }

  /**
   * Check if the native store rating is available
   */
  async isNativeRatingAvailable(): Promise<boolean> {
    try {
      return await StoreReview.hasAction();
    } catch (error) {
      console.error("Error checking store review availability:", error);
      return false;
    }
  }

  /**
   * Show the native in-app rating dialog (iOS 10.3+ / Android 5.0+)
   */
  async showNativeRating(): Promise<boolean> {
    try {
      const isAvailable = await this.isNativeRatingAvailable();

      if (isAvailable) {
        await StoreReview.requestReview();
        // Mark as rated to prevent future prompts
        await this.markAsRated();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to show native rating:", error);
      return false;
    }
  }

  /**
   * Open the app store page directly
   */
  async openStoreReview(): Promise<boolean> {
    try {
      if (Platform.OS === "ios") {
        const storeUrl = await StoreReview.storeUrl();
        if (storeUrl) {
          await Linking.openURL(storeUrl);
          await this.markAsRated();
          return true;
        }

        // Fallback to manual URL if configured
        if (this.config.iosAppId) {
          const fallbackUrl = `https://apps.apple.com/app/id${this.config.iosAppId}?action=write-review`;
          await Linking.openURL(fallbackUrl);
          await this.markAsRated();
          return true;
        }
      } else if (Platform.OS === "android") {
        const storeUrl = await StoreReview.storeUrl();
        if (storeUrl) {
          await Linking.openURL(storeUrl);
          await this.markAsRated();
          return true;
        }

        // Fallback to manual URL if configured
        if (this.config.androidPackageName) {
          const fallbackUrl = `https://play.google.com/store/apps/details?id=${this.config.androidPackageName}`;
          await Linking.openURL(fallbackUrl);
          await this.markAsRated();
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Failed to open store review:", error);
      return false;
    }
  }

  /**
   * Smart rating prompt that tries native first, falls back to store
   */
  async promptForRating(): Promise<boolean> {
    try {
      // Try native rating first
      const nativeSuccess = await this.showNativeRating();
      if (nativeSuccess) {
        return true;
      }

      // Fallback to opening store directly
      return await this.openStoreReview();
    } catch (error) {
      console.error("Failed to prompt for rating:", error);
      return false;
    }
  }

  /**
   * Check if user should be prompted for rating based on usage patterns
   */
  async shouldPromptForRating(): Promise<boolean> {
    try {
      const state = await this.getRatingState();

      // Already rated - don't prompt again
      if (state.hasRated) {
        return false;
      }

      // Reached maximum prompts
      if (state.promptCount >= (this.config.maxRatingPrompts || 3)) {
        return false;
      }

      // Check minimum usage time
      const installDate = new Date(state.installDate);
      const now = new Date();
      const daysSinceInstall = Math.floor(
        (now.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceInstall < (this.config.minimumUsageTime || 3)) {
        return false;
      }

      // Check if enough time has passed since last prompt
      if (state.lastPromptDate) {
        const lastPrompt = new Date(state.lastPromptDate);
        const daysSinceLastPrompt = Math.floor(
          (now.getTime() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastPrompt < (this.config.daysBeforeRetry || 30)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error checking if should prompt for rating:", error);
      return false;
    }
  }

  /**
   * Record that user was prompted (call this when showing confirmation dialog)
   */
  async recordPrompt(): Promise<void> {
    try {
      const state = await this.getRatingState();
      await this.updateRatingState({
        ...state,
        promptCount: state.promptCount + 1,
        lastPromptDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to record prompt:", error);
    }
  }

  /**
   * Mark that user has rated the app
   */
  async markAsRated(): Promise<void> {
    try {
      const state = await this.getRatingState();
      await this.updateRatingState({
        ...state,
        hasRated: true,
      });
    } catch (error) {
      console.error("Failed to mark as rated:", error);
    }
  }

  /**
   * Reset rating state (useful for testing)
   */
  async resetRatingState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to reset rating state:", error);
    }
  }

  /**
   * Get current rating state
   */
  private async getRatingState(): Promise<RatingState> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to get rating state:", error);
    }

    // Default state
    return {
      hasRated: false,
      promptCount: 0,
      lastPromptDate: null,
      installDate: new Date().toISOString(),
    };
  }

  /**
   * Update rating state
   */
  private async updateRatingState(state: RatingState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to update rating state:", error);
    }
  }
}

// Export a default instance for easy use
export const storeRating = new StoreRatingManager();

// Export class for custom configurations
export { StoreRatingManager };

// Export types for TypeScript users
export type { StoreRatingConfig, RatingState };
