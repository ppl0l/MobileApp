import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, RefreshControl } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import { OrdersViewModel } from '../viewmodels/OrdersViewModel';
import FoodItem from '../components/FoodItem';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ApiDataCard from '../components/ApiDataCard';
import CameraButton from '../components/CameraButton';
import ShareButton from '../components/ShareButton';
import { showAlert, formatDate, validateInput } from '../utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { remoteDB } from '../services/RemoteDBService';

export default function MainScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [viewModel] = useState(() => new OrdersViewModel());
  const [restaurantName, setRestaurantName] = useState('');
  const [image, setImage] = useState(null);
  const [state, setState] = useState({ orders: [], apiData: [], isLoading: true });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 15, gap: 15 }}>
          {state.orders.length > 0 && (
            <ShareButton order={state.orders[0]} />
          )}
        </View>
      ),
    });
  }, [navigation, state.orders]);

  useEffect(() => {
    const unsubscribe = viewModel.subscribe(setState);
    viewModel.loadOrders();
    viewModel.fetchApiData();
    
    const unsubscribeFirebase = remoteDB.subscribeToOrders((firebaseOrders) => {
      viewModel.syncWithFirebase(firebaseOrders);
    });
    
    return () => {
      unsubscribe();
      unsubscribeFirebase();
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await viewModel.loadOrders();
    await viewModel.fetchApiData();
    setRefreshing(false);
  }, []);

  const handleAddOrder = async () => {
    try {
      const name = validateInput(restaurantName, t('fillFields'));
      await viewModel.addOrder(name, '', formatDate(), 'restaurant_order', image);
      setRestaurantName('');
      setImage(null);
    } catch (e) {
      showAlert(t('error'), e.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.5 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleCameraImage = (uri) => {
    setImage(uri);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    inputContainer: { padding: 15, backgroundColor: colors.card },
    toolbar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
    toolBtn: { flexDirection: 'row', alignItems: 'center' },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input placeholder={t('restaurantName')} value={restaurantName} onChangeText={setRestaurantName} />
        <Input placeholder={t('searchOrders')} onChangeText={(text) => viewModel.fuzzySearch(text)} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title={t('photo')} onPress={pickImage} style={{ flex: 1, backgroundColor: colors.secondary }} />
          <CameraButton onImageTaken={handleCameraImage} />
          <Button title={t('addOrder')} onPress={handleAddOrder} style={{ flex: 3 }} />
        </View>
        {image && <Text style={{ color: colors.primary, marginTop: 5 }}>{t('photoSelected')}</Text>}
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={() => viewModel.sortOrders('name')}>
          <Ionicons name="text-outline" size={20} color={colors.primary} />
          <Text style={{ color: colors.text, marginLeft: 5 }}>{t('sortAZ')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={() => viewModel.sortOrders('date')}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={{ color: colors.text, marginLeft: 5 }}>{t('sortNewest')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={state.orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FoodItem item={item} onPress={() => navigation.navigate('Details', { order: item })} onDelete={() => viewModel.deleteOrder(item.id)} />
        )}
        ListHeaderComponent={<ApiDataCard data={state.apiData} isLoading={state.isLoading} />}
        contentContainerStyle={{ padding: 15 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      />
    </View>
  );
}