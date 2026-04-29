import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme';

export default function Input({ placeholder, value, onChangeText, style }) {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        styles.input, 
        { 
          borderColor: colors.border,
          color: colors.text,
          backgroundColor: colors.background,
        },
        style
      ]}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
});