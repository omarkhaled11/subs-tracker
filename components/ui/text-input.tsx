import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View, Keyboard } from 'react-native';
import { theme } from '../../utils/theme';

interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  returnKeyType?: 'default' | 'done' | 'go' | 'next' | 'search' | 'send';
  blurOnSubmit?: boolean;
  onSubmitEditing?: () => void;
  keyboardAppearance?: 'default' | 'light' | 'dark';
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  error,
  required = false,
  returnKeyType = 'next',
  blurOnSubmit = false,
  onSubmitEditing,
  keyboardAppearance = 'dark'
}, ref) => {
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
      <RNTextInput
        ref={ref}
        style={[styles.input, error && styles.inputError, { color: theme.colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.secondary}
        returnKeyType={returnKeyType}
        submitBehavior={blurOnSubmit ? 'blurAndSubmit' : 'submit'}
        onSubmitEditing={handleSubmitEditing}
        keyboardAppearance={keyboardAppearance}
      />
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
    fontFamily: theme.fonts.regular,
  },
  required: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.small,
    padding: 12,
    fontSize: 16,
    backgroundColor: theme.colors.card,
    fontFamily: theme.fonts.regular,
  },
  inputError: {
    borderColor: theme.colors.primary,
  },
  errorText: {
    color: theme.colors.primary,
    fontSize: 14,
    marginTop: 4,
    fontFamily: theme.fonts.regular,
  },
}); 