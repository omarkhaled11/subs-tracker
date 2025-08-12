import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { theme } from "../../utils/theme";
import { useConfirmationDialogStore } from "../../utils/confirmation-dialog-store";

export const ConfirmationDialog: React.FC = () => {
  const {
    visible,
    title,
    subtitle,
    cancelText,
    confirmText,
    destructive,
    handleConfirm,
    handleCancel,
  } = useConfirmationDialogStore();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
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

          <View
            style={[styles.buttonRow, { borderTopColor: theme.colors.border }]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCancel}
              style={[
                styles.button,
                styles.cancelButton,
                { borderRightColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.cancelText, { color: theme.colors.secondaryText }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConfirm}
              style={[styles.button, styles.confirmButton]}
            >
              <Text
                style={[
                  styles.confirmText,
                  {
                    color: destructive
                      ? theme.colors.error
                      : theme.colors.primary,
                  },
                ]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
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
    maxWidth: 280,
    borderRadius: theme.borderRadius.medium,
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 22,
    marginBottom: 6,
    paddingHorizontal: 16,
    fontFamily: theme.fonts.bold,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
    fontFamily: theme.fonts.regular,
    lineHeight: 20,
    opacity: 0.9,
  },
  buttonRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    minHeight: 44,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelButton: {
    borderRightWidth: 0.5,
  },
  confirmButton: {},
  cancelText: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: theme.fonts.regular,
    fontWeight: "500",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: theme.fonts.bold,
    letterSpacing: 0.2,
  },
});
