import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import { ThemeProvider, useTheme } from './src/utils/theme';
import { I18nProvider, useI18n } from './src/utils/i18n';
import { initDatabase } from './src/utils/database';

import MainScreen from './src/screens/MainScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CartScreen from './src/screens/CartScreen';
import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import NetworkStatus from './src/components/NetworkStatus';
import { authService } from './src/services/AuthService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MenuStack() {
  const { t } = useI18n();
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={MainScreen}
        options={{ title: t('menu') }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{ title: t('details') }}
      />
    </Stack.Navigator>
  );
}

const TabBarIcon = ({ focused, color, size, name }) => {
  const iconName = focused ? name : `${name}-outline`;
  return <Ionicons name={iconName} size={size} color={color} />;
};

function AppTabs() {
  const { t } = useI18n();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Tab.Screen 
        name="MenuTab" 
        component={MenuStack}
        options={{
          title: t('menu'),
          headerShown: false,
          tabBarIcon: (props) => (
            <TabBarIcon {...props} name="restaurant" />
          ),
        }}
      />
      
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen}
        options={{
          title: t('cart'),
          tabBarIcon: (props) => (
            <TabBarIcon {...props} name="cart" />
          ),
        }}
      />
      
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsScreen}
        options={{
          title: t('settings'),
          tabBarIcon: (props) => (
            <TabBarIcon {...props} name="settings" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainApp() {
  const { colors } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppTabs />
      <NetworkStatus />
    </View>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        authService.initAuthListener();
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn('Error:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
    
    const unsubscribe = authService.addListener((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (!appIsReady) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <I18nProvider>
          <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />
          <StatusBar style="auto" />
        </I18nProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <I18nProvider>
        <NavigationContainer>
          <MainApp />
          <StatusBar style="auto" />
        </NavigationContainer>
      </I18nProvider>
    </ThemeProvider>
  );
}