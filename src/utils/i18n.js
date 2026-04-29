import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LANGUAGE } from '../constants/languages';

const translations = {
  ru: {
    menu: 'Меню',
    details: 'Детали',
    settings: 'Настройки',
    cart: 'Корзина',
    restaurantName: 'Название ресторана или кафе',
    addOrder: 'Добавить заказ',
    noOrders: 'Нет заказов',
    error: 'Ошибка',
    fillFields: 'Введите название',
    confirmDelete: 'Подтверждение удаления',
    deleteMessage: 'Вы уверены, что хотите удалить этот заказ?',
    cancel: 'Отмена',
    delete: 'Удалить',
    date: 'Дата',
    updateOrder: 'Обновить заказ',
    confirmUpdate: 'Обновить информацию о заказе?',
    success: 'Успех',
    orderUpdated: 'Заказ обновлен',
    updated: 'обновлено',
    appearance: 'Внешний вид',
    darkMode: 'Темная тема',
    language: 'Язык',
    about: 'О приложении',
    year: 'Год выпуска',
    selectLanguage: 'Выберите язык',
    emptyCart: 'Корзина пуста',
    orderFromRestaurant: 'Заказ из ресторана',
    recommendedDishes: 'Рекомендуем попробовать',
    loadingDishes: 'Загрузка блюд...',
    noDishes: 'Рекомендации блюд',
    cuisine: 'Кухня',
    noConnection: 'Нет интернет-соединения',
    photo: 'Фото',
    searchOrders: 'Поиск заказов...',
    sortAZ: 'А-Я',
    sortNewest: 'Новые',
    remindOrder: 'Напомнить о заказе',
    orderReminderTitle: 'Напоминание о заказе',
    orderReminderBody: 'Пора проверить заказ',
    reminderSet: 'Напоминание установлено',
    photoSelected: 'Фото выбрано',
    orderNotFound: 'Заказ не найден',
  },
  en: {
    menu: 'Menu',
    details: 'Details',
    settings: 'Settings',
    cart: 'Cart',
    restaurantName: 'Restaurant or cafe name',
    addOrder: 'Add order',
    noOrders: 'No orders',
    error: 'Error',
    fillFields: 'Enter name',
    confirmDelete: 'Confirm deletion',
    deleteMessage: 'Are you sure you want to delete this order?',
    cancel: 'Cancel',
    delete: 'Delete',
    date: 'Date',
    updateOrder: 'Update order',
    confirmUpdate: 'Update order information?',
    success: 'Success',
    orderUpdated: 'Order updated',
    updated: 'updated',
    appearance: 'Appearance',
    darkMode: 'Dark theme',
    language: 'Language',
    about: 'About',
    year: 'Release year',
    selectLanguage: 'Select language',
    emptyCart: 'Cart is empty',
    orderFromRestaurant: 'Order from restaurant',
    recommendedDishes: 'Recommended dishes',
    loadingDishes: 'Loading dishes...',
    noDishes: 'Dish recommendations',
    cuisine: 'Cuisine',
    noConnection: 'No internet connection',
    photo: 'Photo',
    searchOrders: 'Search orders...',
    sortAZ: 'A-Z',
    sortNewest: 'Newest',
    remindOrder: 'Remind about order',
    orderReminderTitle: 'Order Reminder',
    orderReminderBody: 'Time to check order',
    reminderSet: 'Reminder set',
    photoSelected: 'Photo selected',
    orderNotFound: 'Order not found',
  },
};

const I18nContext = createContext();

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const saved = await AsyncStorage.getItem('language');
    if (saved) setLanguage(saved);
  };

  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    await AsyncStorage.setItem('language', newLang);
  };

  const t = (key) => translations[language]?.[key] || translations['ru'][key] || key;

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};