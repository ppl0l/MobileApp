import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import { networkMonitor } from '../services/NetworkMonitor';

export default function NetworkStatus() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = networkMonitor.addListener((connected) => {
      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, []);

  if (isConnected) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.error }]}>
      <Ionicons name="wifi-outline" size={18} color="#fff" />
      <Text style={styles.text}>{t('noConnection')}</Text>
      <Ionicons name="alert-circle-outline" size={18} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    marginHorizontal: 8,
    fontWeight: '500',
  },
});