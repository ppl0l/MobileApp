import React from 'react';
import { TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';

export default function ShareButton({ order }) {
  const { colors } = useTheme();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Заказ из ресторана: ${order.title}\n Дата: ${order.date}\n ${order.description || 'Успешно'}\n\nПоделились из Food Delivery App!`,
        title: `Мой заказ - ${order.title}`,
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось поделиться');
    }
  };

  return (
    <TouchableOpacity onPress={handleShare}>
      <Ionicons name="share-social" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
}