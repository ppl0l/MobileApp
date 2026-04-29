import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Header from '../components/common/Header';
import ShareButton from '../components/ShareButton';
import { notificationService } from '../services/NotificationService';

export default function DetailsScreen({ route }) {
  const order = route?.params?.order;
  const { colors } = useTheme();
  const { t } = useI18n();

  if (!order) return null;

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Header title={order.title} />
          <ShareButton order={order} />
        </View>
        {order.imageUrl ? (
          <Image source={{ uri: order.imageUrl }} style={{ width: '100%', height: 250, borderRadius: 10, marginBottom: 15 }} />
        ) : null}
        <Text style={{ color: colors.text, marginBottom: 10 }}>
          {order.type === 'restaurant_order' ? t('orderFromRestaurant') : order.description}
        </Text>
        <Text style={{ fontSize: 14, color: colors.secondary, marginBottom: 20 }}>{t('date')}: {order.date}</Text>
        <Button 
          title={t('remindOrder')} 
          onPress={() => notificationService.scheduleOrderReminder(order.title)} 
          style={{ backgroundColor: colors.secondary }} 
        />
      </Card>
    </ScrollView>
  );
}