import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View, Keyboard } from 'react-native';
import { theme } from '../../utils/theme';
interface NumberInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  currency?: string;
  returnKeyType?: 'default' | 'done' | 'go' | 'next' | 'search' | 'send';
  blurOnSubmit?: boolean;
  onSubmitEditing?: () => void;
  keyboardAppearance?: 'default' | 'light' | 'dark';
}

export const NumberInput = forwardRef<RNTextInput, NumberInputProps>(({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  error,
  required = false,
  currency = '$',
  returnKeyType = 'next',
  blurOnSubmit = false,
  onSubmitEditing,
  keyboardAppearance = 'dark'
}, ref) => {
  const handleTextChange = (text: string) => {
    // Only allow numbers and decimal point
    const numericText = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = numericText.split('.');
    if (parts.length > 2) {
      return;
    }
    onChangeText(numericText);
  };

  const handleSubmitEditing = () => {
    if (returnKeyType === 'done') {
      Keyboard.dismiss();
    }
    onSubmitEditing?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        <Text style={styles.currency}>{currency}</Text>
        <RNTextInput
          ref={ref}
          style={[styles.input, { color: theme.colors.text }]}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.secondary}
          keyboardType="decimal-pad"
          returnKeyType={returnKeyType}
          submitBehavior={blurOnSubmit ? 'blurAndSubmit' : 'submit'}
          onSubmitEditing={handleSubmitEditing}
          keyboardAppearance={keyboardAppearance}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
    fontFamily: theme.text.fontFamily,
  },
  required: {
    color: theme.colors.primary,
    fontFamily: theme.text.fontFamily,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.card,
  },
  inputContainerError: {
    borderColor: theme.colors.primary,
  },
  currency: {
    fontSize: 16,
    color: theme.colors.secondary,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    paddingVertical: 12,
    fontFamily: theme.text.fontFamily,
  },
  input: {
    flex: 1,
    padding: 12,
    paddingLeft: 8,
    fontSize: 16,
    fontFamily: theme.text.fontFamily,
  },
  errorText: {
    color: theme.colors.primary,
    fontSize: 14,
    marginTop: 4,
    fontFamily: theme.text.fontFamily,
  },
}); 