import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { authService } from '../services/AuthService';

export default function AuthScreen({ onAuthSuccess }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = isLogin 
      ? await authService.login(email, password)
      : await authService.register(email, password);
    
    setLoading(false);
    
    if (result.success) {
      onAuthSuccess && onAuthSuccess();
    } else {
      setError(result.error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 30,
    },
    errorText: {
      color: colors.error,
      textAlign: 'center',
      marginBottom: 10,
    },
    switchText: {
      color: colors.primary,
      textAlign: 'center',
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Delivery</Text>
      
      <Input 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Input 
        placeholder="Пароль" 
        value={password} 
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <Button 
        title={loading ? "..." : (isLogin ? "Войти" : "Зарегистрироваться")}
        onPress={handleSubmit}
        disabled={loading}
      />
      
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}