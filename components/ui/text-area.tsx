import React from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View, Keyboard } from 'react-native';
import { theme } from '../../utils/theme';

interface TextAreaProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  numberOfLines?: number;
  returnKeyType?: 'default' | 'done' | 'go' | 'next' | 'search' | 'send';
  blurOnSubmit?: boolean;
}

export function TextArea({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  error,
  required = false,
  maxLength,
  numberOfLines = 4,
  returnKeyType = 'default',
  blurOnSubmit = true
}: TextAreaProps) {
  const handleSubmitEditing = () => {
    if (returnKeyType === 'done') {
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <RNTextInput
        style={[styles.textArea, error && styles.textAreaError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        textAlignVertical="top"
        returnKeyType={returnKeyType}
        submitBehavior={blurOnSubmit ? 'blurAndSubmit' : 'submit'}
        onSubmitEditing={handleSubmitEditing}
      />
      <View style={styles.footer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {maxLength && (
          <Text style={styles.characterCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}

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
  textArea: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: theme.colors.card,
    minHeight: 100,
  },
  textAreaError: {
    borderColor: theme.colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: theme.colors.primary,
    fontSize: 14,
    flex: 1,
    fontFamily: theme.fonts.regular,
  },
  characterCount: {
    color: theme.colors.secondary,
    fontSize: 12,
    fontFamily: theme.fonts.regular,
  },
}); 