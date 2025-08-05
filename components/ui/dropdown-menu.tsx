import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View, Keyboard } from "react-native";
import { theme } from "../../utils/theme";
import { PickerList } from "./picker";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownMenuProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function DropdownMenu({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  error,
  required = false,
}: DropdownMenuProps) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.dropdown, error && styles.dropdownError]}
        onPress={() => {
          Keyboard.dismiss();
          setIsPickerVisible(true);
        }}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <PickerList
        visible={isPickerVisible}
        title={label}
        subtitle={"Choose an option"}
        options={options}
        onClose={() => setIsPickerVisible(false)}
        onOptionPress={(option) => {
          onValueChange(option.value as string);
          setIsPickerVisible(false);
        }}
      />
    </View>
  );
}

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
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.small,
    padding: 12,
    backgroundColor: theme.colors.card,
  },
  dropdownError: {
    borderColor: theme.colors.primary,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.colors.secondary,
    flex: 1,
    fontFamily: theme.fonts.regular,
  },
  placeholderText: {
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
  },
  arrow: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
  },
  errorText: {
    color: theme.colors.primary,
    fontSize: 14,
    marginTop: 4,
    fontFamily: theme.fonts.regular,
  },
});
