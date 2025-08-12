import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { theme } from "../../utils/theme";

interface PickerOption {
  label: string;
  value: string | number;
}

interface PickerListProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  options: PickerOption[];
  onClose: () => void;
  onOptionPress: (option: PickerOption) => void;
}

export const PickerList: React.FC<PickerListProps> = ({
  visible,
  title,
  subtitle,
  options,
  onClose,
  onOptionPress,
}) => {

  const handleOptionPress = (option: PickerOption) => {
    onOptionPress(option);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={[
          styles.overlay,
          { backgroundColor: theme.colors.overlay + "99" },
        ]}
      >
        <View
          style={[styles.container, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>

          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
              {subtitle}
            </Text>
          )}

          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={option.value}
                onPress={() => handleOptionPress(option)}
                style={[
                  styles.option,
                  { borderBottomColor: theme.colors.border },
                  index === options.length - 1 && styles.lastOption,
                ]}
              >
                <Text style={[styles.optionText, { color: theme.colors.text }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            style={[
              styles.cancelButton,
              { borderTopColor: theme.colors.border },
            ]}
          >
            <Text
              style={[styles.cancelText, { color: theme.colors.error }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 320,
    borderRadius: theme.borderRadius.medium,
    overflow: "hidden",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 6,
    paddingHorizontal: 16,
    fontFamily: theme.fonts.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
    fontFamily: theme.fonts.regular,
    opacity: 0.8,
    lineHeight: 20,
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderTopWidth: 1,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: theme.fonts.medium,
  },
  cancelButton: {
    paddingVertical: 18,
    borderTopWidth: 1,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
  cancelText: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: theme.fonts.medium,
    letterSpacing: 0.3,
  },
});
