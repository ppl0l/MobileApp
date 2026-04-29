import { Alert } from 'react-native';

export const showAlert = (title, message, onConfirm, onCancel) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'Отмена', style: 'cancel', onPress: onCancel },
      { text: 'OK', onPress: onConfirm },
    ]
  );
};

export const formatDate = (date = new Date()) => {
  return date.toLocaleDateString();
};

export const validateInput = (value, errorMessage) => {
  if (!value?.trim()) {
    throw new Error(errorMessage);
  }
  return value.trim();
};