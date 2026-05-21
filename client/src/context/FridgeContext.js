import React, { createContext, useState, useRef } from 'react';

const FridgeContext = createContext();

export function FridgeProvider({ children }) {
  const [fridgeItems, setFridgeItems] = useState([
    { id: 1, name: 'Jajka', quantity: 10, unit: 'szt.', category: 'nabiał', expiryDate: '2026-05-25' },
    { id: 2, name: 'Mleko', quantity: 1, unit: 'l', category: 'nabiał', expiryDate: '2026-05-21' },
    { id: 3, name: 'Chleb', quantity: 1, unit: 'szt.', category: 'pieczywo', expiryDate: '2026-05-19' },
    { id: 4, name: 'Masło', quantity: 200, unit: 'g', category: 'nabiał', expiryDate: '2026-06-01' },
    { id: 5, name: 'Ser', quantity: 300, unit: 'g', category: 'nabiał', expiryDate: '2026-05-23' },
    { id: 6, name: 'Szczypiorek', quantity: 1, unit: 'pęczek', category: 'warzywa', expiryDate: '' },
  ]);

  // Zmienna do przechowywania ostatniego powiadomienia
  const lastNotificationRef = useRef('');

  // Funkcja do poprawnej odmiany polskiej
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

  // Funkcja sprawdzająca daty i zwracająca komunikaty
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

  // Funkcja do ręcznego wywołania powiadomienia (używana przy przejściu do Lodówki)
  const showNotificationIfNeeded = () => {
    const notification = getExpiryNotification();
    const notificationKey = notification || 'none';
    
    // Sprawdź czy to nowe powiadomienie (inne niż poprzednie)
    if (notification && lastNotificationRef.current !== notificationKey) {
      alert(notification);
      lastNotificationRef.current = notificationKey;
    }
  };

  const addItem = (item) => {
    setFridgeItems([...fridgeItems, { ...item, id: Date.now() }]);
  };

  const removeItem = (id) => {
    setFridgeItems(fridgeItems.filter(item => item.id !== id));
  };

  const updateItem = (id, updates) => {
    setFridgeItems(fridgeItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
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