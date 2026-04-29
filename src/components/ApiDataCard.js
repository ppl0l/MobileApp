import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import Card from './common/Card';

export default function ApiDataCard({ data, isLoading }) {
  const { colors } = useTheme();
  const { t } = useI18n();

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          {t('loadingDishes')}
        </Text>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card style={styles.card}>
        <Ionicons name="restaurant-outline" size={32} color={colors.text} />
        <Text style={[styles.emptyText, { color: colors.text }]}>
          {t('noDishes')}
        </Text>
      </Card>
    );
  }

  const dataArray = Array.isArray(data) ? data : [data];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="restaurant" size={24} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('recommendedDishes')}
        </Text>
      </View>
      
      {dataArray.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={[styles.itemTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.itemCuisine, { color: colors.secondary }]}>
            {t('cuisine')}: {item.area || item.cuisine || 'Кухня мира'}
          </Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  item: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCuisine: {
    fontSize: 13,
    opacity: 0.7,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
});