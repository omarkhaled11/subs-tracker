import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router, useLocalSearchParams } from "expo-router";
import { TextInput } from "../components/ui/text-input";
import { NumberInput } from "../components/ui/number-input";
import { DatePicker } from "../components/ui/date-picker";
import { DropdownMenu, DropdownOption } from "../components/ui/dropdown-menu";
import { useSubscriptionsStore } from "../utils/store";
import { SubscriptionInterval } from "../utils/types";
import { theme } from "../utils/theme";
import { currencySymbols } from "../utils/constants";

// Validation schema
const subscriptionSchema = z.object({
  label: z.string().min(1, "Name is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Amount must be a valid number greater than 0"
    ),
  interval: z.string().min(1, "Billing cycle is required"),
  nextRenewal: z.date().optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

const billingCycleOptions: DropdownOption[] = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

export default function EditSubscriptionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getUser, getSubscription, updateSubscription } = useSubscriptionsStore();
  const user = getUser();
  const subscription = id ? getSubscription(id) : null;

  // Create refs for form inputs
  const nameInputRef = useRef<RNTextInput>(null);
  const amountInputRef = useRef<RNTextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      label: subscription?.label || "",
      amount: subscription?.amount.toString() || "",
      interval: subscription?.interval || "",
      nextRenewal: subscription?.nextRenewal ? new Date(subscription.nextRenewal) : undefined,
    },
  });

  const onSubmit = async (data: SubscriptionFormData) => {
    if (!subscription) return;
    
    try {
      updateSubscription(id, {
        ...subscription,
        label: data.label,
        amount: Number(data.amount),
        interval: data.interval as SubscriptionInterval,
        nextRenewal: data.nextRenewal,
      });

      // Navigate back to detail screen
      router.back();
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!subscription) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Subscription not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.form}>
            <Controller
              control={control}
              name="label"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  ref={nameInputRef}
                  label="Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., Netflix, Spotify"
                  error={errors.label?.message}
                  required
                  returnKeyType="next"
                  onSubmitEditing={() => amountInputRef.current?.focus()}
                  autoFocus
                />
              )}
            />

            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  ref={amountInputRef}
                  label="Cost"
                  value={value}
                  onChangeText={onChange}
                  placeholder="0.00"
                  error={errors.amount?.message}
                  required
                  currency={currencySymbols[user.defaultCurrency as keyof typeof currencySymbols]}
                  returnKeyType="done"
                />
              )}
            />

            <Controller
              control={control}
              name="interval"
              render={({ field: { onChange, value } }) => (
                <DropdownMenu
                  label="Billing Cycle"
                  value={value}
                  onValueChange={onChange}
                  options={billingCycleOptions}
                  placeholder="Select billing cycle"
                  error={errors.interval?.message}
                  required
                />
              )}
            />

            <Controller
              control={control}
              name="nextRenewal"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Next Renewal Date"
                  value={value || null}
                  onDateChange={onChange}
                  error={errors.nextRenewal?.message}
                  minimumDate={new Date()}
                />
              )}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  form: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 10,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },
  saveButtonText: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.secondary,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: theme.fonts.regular,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: theme.fonts.regular,
  },
}); 