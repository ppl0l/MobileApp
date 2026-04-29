import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import Header from '../components/common/Header';

export default function CartScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Header title={t('emptyCart')} />
    </View>
  );
}