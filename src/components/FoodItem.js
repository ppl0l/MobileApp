import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import Card from './common/Card';

export default function FoodItem({ item, onPress, onDelete }) {
  const { colors } = useTheme();
  const { t } = useI18n();

  const getDescription = () => {
    if (item.type === 'restaurant_order') {
      return t('orderFromRestaurant');
    }
    return item.description;
  };

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {getDescription()}
        </Text>
        <Text style={[styles.date, { color: colors.secondary }]}>{item.date}</Text>
      </View>
      <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
        <Ionicons name="trash-outline" size={24} color={colors.error || '#ff4444'} />
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
  },
  actionButton: {
    padding: 8,
  },
});