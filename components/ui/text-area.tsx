import React from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View, Keyboard } from 'react-native';

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
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 100,
  },
  textAreaError: {
    borderColor: '#FF3B30',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    flex: 1,
  },
  characterCount: {
    color: '#666',
    fontSize: 12,
  },
}); 