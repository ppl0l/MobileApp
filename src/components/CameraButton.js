import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../utils/theme';

export default function CameraButton({ onImageTaken }) {
  const { colors } = useTheme();

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нет доступа к камере');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      onImageTaken(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={takePhoto}>
      <Ionicons name="camera" size={28} color={colors.primary} />
    </TouchableOpacity>
  );
}