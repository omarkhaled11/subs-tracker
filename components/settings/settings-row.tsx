import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { theme } from "../../utils/theme";

interface SettingsRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

export default function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Octicons
          name={icon as any}
          size={24}
          color={theme.colors.primary}
          style={styles.settingIcon}
        />
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    minHeight: 64,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
    width: 24,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  settingSubtitle: {
    fontSize: 13,
    color: theme.colors.secondary,
    marginTop: 2,
    fontFamily: theme.fonts.regular,
  },
});
