import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Modal,
  Platform,
  Animated,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "../../utils/theme";
interface DatePickerProps {
  label: string;
  value: Date | null;
  onDateChange: (date: Date) => void;
  error?: string;
  required?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function DatePickerComponent({
  label,
  value,
  onDateChange,
  error,
  required = false,
  minimumDate,
  maximumDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));

  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setOpen(false);
      if (selectedDate && event.type === "set") {
        onDateChange(selectedDate);
      }
    } else {
      // For iOS, store the temporary date
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const showDatePicker = () => {
    Keyboard.dismiss();
    setTempDate(value || new Date());
    setOpen(true);
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleConfirm = () => {
    if (tempDate) {
      onDateChange(tempDate);
    }
    hideModal();
  };

  const handleCancel = () => {
    setTempDate(null);
    hideModal();
  };

  const hideModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOpen(false);
    });
  };

  const renderIOSPicker = () => (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={handleCancel}
    >
      <Animated.View 
        style={[
          styles.modalOverlay,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleCancel}
        />

        <Animated.View 
          style={[
            styles.pickerContainer,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            }
          ]}
        >
          <View style={styles.pickerHeader}>
            <Text style={styles.headerTitle}>Select date</Text>
          </View>

          <View style={styles.pickerWrapper}>
            <DateTimePicker
              value={tempDate || value || new Date()}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              style={styles.picker}
              textColor={theme.colors.text}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConfirm}
              style={styles.confirmButtonFull}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCancel}
              style={styles.cancelButtonFull}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  const renderAndroidPicker = () =>
    open && (
      <DateTimePicker
        value={value || new Date()}
        mode="date"
        display="default"
        onChange={handleDateChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity
        style={[styles.dateButton, error && styles.dateButtonError]}
        onPress={showDatePicker}
        activeOpacity={0.7}
      >
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {formatDate(value)}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {Platform.OS === "ios" ? renderIOSPicker() : renderAndroidPicker()}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Export with the original name for backward compatibility
export { DatePickerComponent as DatePicker };

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    fontFamily: theme.fonts.regular,
  },
  required: {
    color: theme.colors.error,
    fontFamily: theme.fonts.regular,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.small,
    padding: 12,
    backgroundColor: theme.colors.card,
    minHeight: 48,
  },
  dateButtonError: {
    borderColor: "#FF3B30",
  },
  dateText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
    fontFamily: theme.fonts.regular,
  },
  placeholderText: {
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
  },
  chevron: {
    fontSize: 18,
    color: theme.colors.secondary,
    fontWeight: "300",
    transform: [{ rotate: "90deg" }],
    fontFamily: theme.fonts.regular,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  pickerWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  picker: {
    height: 200,
    width: "100%",
    alignSelf: "center",
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  confirmButtonFull: {
    width: "100%",
    padding: 15,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    marginBottom: 8,
  },
  confirmButtonText: {
    color: theme.colors.text,
    textAlign: "center",
    fontFamily: theme.fonts.medium,
  },
  cancelButtonFull: {
    width: "100%",
    padding: 15,
    borderRadius: 24,
    backgroundColor: theme.colors.secondary,
  },
  cancelButtonText: {
    color: theme.colors.text,
    textAlign: "center",
    fontFamily: theme.fonts.medium,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: 4,
    fontFamily: theme.fonts.regular,
  },
});
