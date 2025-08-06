import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../utils/theme";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    marginHorizontal: 16,
    ...theme.shadows.subtle,
  },
  sectionContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.small,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontFamily: theme.fonts.regular,
  },
});
