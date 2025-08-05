# Onboarding Implementation Steps

## 4-Screen Onboarding Flow

### Screen 1: Welcome & Value Proposition
- Hero visual of the app
- "Welcome to Chrima - Simple Expense Tracking"
- SubText: "A simple, minimal subscription tracker."
- Message: "All your data stays on your device. No account, no ads, works offline."
- CTA: "Get Started"

### Screen 2: Currency Setup
- "Choose Your Currency"
- SubText: "This is used to display subscription costs."
- Currency selector from components
- CTA: "Continue"

### Screen 3: Notifications (Optional)
- "Enable Notifications? 🔔" 
- SubText: "We can remind you before subscriptions renew. Totally optional."
- Toggle: "Enable renewal reminders"
- renewalTime picker for preferred notification time like the one in settings
- CTA: "Continue"

### Screen 4: Ready to Start
- Celebration visual
- "You're all set!"
- SubText: "Start adding your subscriptions and take control of your spending.
You can update your settings anytime in the app."
- CTA: "Start Adding Subscriptions"

## Why This Flow Works:
- **Front-loads value proposition** - users know what they're getting
- **Respects user choice** - notifications clearly optional
- **Immediate utility** - ends with actionable step
- **Builds confidence** - emphasizes privacy/offline benefits
- **Low friction** - only essential setup, everything else can be configured later

## Implementation Notes:
- Use existing components where possible (currency-picker, reminder-time-picker)
- Store onboarding completion status in utils/store.ts
- Integrate with existing notification permissions system to enable notifications in store
- Ensure smooth transition to main app after completion


### Architecture & Components
**Main Onboarding Container:**
- `OnboardingFlow.tsx` - Main container component that manages the flow
- Uses React state to track current screen (0-3)
- Handles navigation between screens with smooth transitions

**Individual Screen Components:**
- `WelcomeScreen.tsx` - Screen 1
- `CurrencySetupScreen.tsx` - Screen 2 (reuses existing `currency-picker`)
- `NotificationSetupScreen.tsx` - Screen 3 (reuses `reminder-time-picker`)
- `ReadyScreen.tsx` - Screen 4

### State Management
**Store Integration (`utils/store.ts`):**
- Add `hasCompletedOnboarding: boolean` flag
- Store selected currency and notification preferences during onboarding
- Use existing store patterns for persistence

**Local Component State:**
- Track current screen index
- Temporary storage for user selections before committing to store
- Animation/transition states

### Navigation & Flow Control
**Screen Transitions:**
- Use React Native Animated API or similar for smooth slide transitions
- "Continue" buttons advance to next screen
- Final screen routes to main app (likely `router.replace('/')`)

**Entry Point:**
- Check `hasCompletedOnboarding` in your main `_layout.tsx`
- If false, show onboarding; if true, show normal app flow

### Reusable Components
**Leverage Existing:**
- `currency-picker.tsx` for currency selection
- `reminder-time-picker.tsx` for notification timing
- Existing UI components from `components/ui/`
- Same fonts, colors, and theming from `utils/theme.ts`

**New Shared Components:**
- `OnboardingScreen.tsx` - Base wrapper with consistent styling
- `OnboardingButton.tsx` - Styled CTA buttons
