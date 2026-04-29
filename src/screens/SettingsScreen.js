import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import { LANGUAGES } from '../constants/languages';
import Card from '../components/common/Card';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { authService } from '../services/AuthService';

export default function SettingsScreen({ navigation }) {
  const { theme, toggleTheme, colors } = useTheme();
  const { language, changeLanguage, t } = useI18n();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = LANGUAGES.find(lang => lang.code === language) || LANGUAGES[0];

  const handleLogout = async () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
          }
        }
      ]
    );
  };

  const SettingRow = ({ icon, label, value, onPress, children }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={24} color={colors.text} />
        <Text style={[styles.rowText, { color: colors.text }]}>{label}</Text>
      </View>
      {children || <Text style={[styles.rowText, { opacity: 0.7 }]}>{value}</Text>}
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowText: {
      fontSize: 16,
      marginLeft: 12,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    logoutButton: {
      marginTop: 30,
    },
  });

  return (
    <View style={styles.container}>
      <Card>
        <Header title={t('appearance')} style={{ marginBottom: 10 }} />
        <SettingRow
          icon={theme === 'dark' ? 'moon' : 'sunny'}
          label={t('darkMode')}
        >
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.primary }}
          />
        </SettingRow>
      </Card>

      <Card>
        <Header title={t('language')} style={{ marginBottom: 10 }} />
        <SettingRow
          icon="language"
          label={currentLanguage.name}
          onPress={() => setModalVisible(true)}
          value={<Ionicons name="chevron-down" size={24} color={colors.text} />}
        />
      </Card>

      <Card>
        <Header title={t('about')} style={{ marginBottom: 10 }} />
        <SettingRow icon="information-circle-outline" label="Food Delivery App" value="v1.0.0" />
        <SettingRow icon="calendar-outline" label={t('year')} value="2026" />
      </Card>

      {/* Кнопка выхода в стиле приложения */}
      <View style={styles.logoutButton}>
        <Button 
          title="Выйти из аккаунта" 
          onPress={handleLogout}
          style={{ backgroundColor: colors.secondary }}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Header title={t('selectLanguage')} />
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageItem}
                  onPress={() => {
                    changeLanguage(item.code);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.rowText, { color: colors.text, flex: 1 }]}>
                    {item.name}
                  </Text>
                  {language === item.code && (
                    <Ionicons name="checkmark" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}