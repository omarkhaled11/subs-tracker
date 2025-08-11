import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SubscriptionItem } from "../utils/types";
import { theme } from "../utils/theme";
import { UpcomingRenewalContent } from "./upcoming-renewal-content";
import { RenewalTimelineContent } from "./renewal-timeline-content";

interface UnifiedRenewalsProps {
  upcomingSubscriptions: SubscriptionItem[];
  allSubscriptions: SubscriptionItem[];
  currency: string;
}

export const UnifiedRenewals: React.FC<UnifiedRenewalsProps> = ({
  upcomingSubscriptions,
  allSubscriptions,
  currency,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Main Title Section */}
      {/* <View style={styles.titleSection}>
        <View style={styles.titleHeader}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.title}>Renewal Calendar</Text>
        </View>
        <Text style={styles.subtitle}>Your upcoming subscription renewals</Text>
      </View> */}

      {/* Due Soon Section (30 days) */}
      <View style={styles.subsectionContainer}>
        <View style={styles.subsectionHeader}>
          <View style={styles.subsectionIconContainer}>
            <Ionicons name="alarm" size={16} color={theme.colors.primary} />
          </View>
          <Text style={styles.subsectionTitle}>Due Soon</Text>
          <Text style={styles.subsectionSubtitle}>Next 30 days</Text>
        </View>
        <UpcomingRenewalContent upcomingSubscriptions={upcomingSubscriptions} />
      </View>

      {/* Timeline Section (3 months) */}
      <View style={styles.subsectionContainer}>
        <View style={styles.subsectionHeader}>
          <View style={styles.subsectionIconContainer}>
            <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
          </View>
          <Text style={styles.subsectionTitle}>3 Month Overview</Text>
          <Text style={styles.subsectionSubtitle}>Extended timeline</Text>
        </View>
        <RenewalTimelineContent subscriptions={allSubscriptions} currency={currency} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  titleSection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  titleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    fontFamily: theme.fonts.regular,
    opacity: 0.8,
    marginLeft: 36,
  },
  subsectionContainer: {
    marginBottom: 16,
    // marginTop: 12,
  },
  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 8,
  },
  subsectionIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(132, 204, 22, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },
  subsectionSubtitle: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    fontFamily: theme.fonts.regular,
    opacity: 0.7,
    marginLeft: 4,
  },
});