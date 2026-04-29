import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme';

export default function Header({ title, style }) {
  const { colors } = useTheme();
  
  return (
    <Text style={[styles.title, { color: colors.text }, style]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});