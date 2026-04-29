import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  async scheduleOrderReminder(title) {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Ошибка', 'У приложения нет прав на уведомления');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Напоминание о заказе!",
          body: `Пора проверить заказ: ${title}`,
          sound: true,
        },
        trigger: { 
          type: 'timeInterval',
          seconds: 5,
          repeats: false
        },
      });

      Alert.alert('Напоминание установлено');

    } catch (error) {
      console.error("Notification Error:", error);
      Alert.alert('Ошибка', 'Не удалось запланировать уведомление');
    }
  }
};