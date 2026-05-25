import React, { createContext, useState, useRef } from 'react';

const FridgeContext = createContext();

const initialFridgeItems = [
  { id: 1, name: 'Jajka', quantity: 10, unit: 'szt.', category: 'nabiał', expiryDate: '2026-05-25', dateAdded: '2026-05-12T08:30:00.000Z' },
  { id: 2, name: 'Mleko', quantity: 1, unit: 'l', category: 'nabiał', expiryDate: '2026-05-21', dateAdded: '2026-05-13T09:15:00.000Z' },
  { id: 3, name: 'Chleb', quantity: 1, unit: 'szt.', category: 'pieczywo', expiryDate: '2026-05-19', dateAdded: '2026-05-14T07:45:00.000Z' },
  { id: 4, name: 'Masło', quantity: 200, unit: 'g', category: 'nabiał', expiryDate: '2026-06-01', dateAdded: '2026-05-15T11:20:00.000Z' },
  { id: 5, name: 'Ser', quantity: 300, unit: 'g', category: 'nabiał', expiryDate: '2026-05-23', dateAdded: '2026-05-16T13:05:00.000Z' },
  { id: 6, name: 'Szczypiorek', quantity: 1, unit: 'pęczek', category: 'warzywa', expiryDate: '', dateAdded: '2026-05-17T16:40:00.000Z' },
];

export function FridgeProvider({ children }) {
  const [fridgeItems, setFridgeItems] = useState(initialFridgeItems);
  const lastNotificationRef = useRef('');

  const getPolishMessage = (count, type) => {
    if (type === 'expired') {
      if (count === 0) return '';
      if (count === 1) return `⚠️ UWAGA! 1 produkt jest PRZETERMINOWANY!`;
      if (count >= 2 && count <= 4) return `⚠️ UWAGA! ${count} produkty są PRZETERMINOWANE!`;
      return `⚠️ UWAGA! ${count} produktów jest PRZETERMINOWANYCH!`;
    } else if (type === 'expiring') {
      if (count === 0) return '';
      if (count === 1) return `📢 Powiadomienie: 1 produkt straci ważność w ciągu 3 dni!`;
      if (count >= 2 && count <= 4) return `📢 Powiadomienie: ${count} produkty stracą ważność w ciągu 3 dni!`;
      return `📢 Powiadomienie: ${count} produktów straci ważność w ciągu 3 dni!`;
    }
    return '';
  };

  const getExpiryNotification = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiringSoon = fridgeItems.filter(item => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      return daysLeft <= 3 && daysLeft >= 0;
    });
    
    const expired = fridgeItems.filter(item => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);
      return expiryDate < today;
    });

    if (expired.length > 0) {
      return getPolishMessage(expired.length, 'expired');
    } else if (expiringSoon.length > 0) {
      return getPolishMessage(expiringSoon.length, 'expiring');
    }
    return null;
  };

  const showNotificationIfNeeded = () => {
    const notification = getExpiryNotification();
    const notificationKey = notification || 'none';
    
    if (notification && lastNotificationRef.current !== notificationKey) {
      alert(notification);
      lastNotificationRef.current = notificationKey;
    }
  };

  const addItem = (item) => {
    setFridgeItems([
      ...fridgeItems,
      {
        ...item,
        id: Date.now(),
        dateAdded: item.dateAdded || new Date().toISOString(),
      },
    ]);
  };

  const removeItem = (id) => {
    setFridgeItems(fridgeItems.filter((item) => item.id !== id));
  };

  const updateItem = (id, updates) => {
    setFridgeItems(
      fridgeItems.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  return (
    <FridgeContext.Provider value={{ 
      fridgeItems, 
      addItem, 
      removeItem, 
      updateItem,
      showNotificationIfNeeded 
    }}>
      {children}
    </FridgeContext.Provider>
  );
}

export { FridgeContext };