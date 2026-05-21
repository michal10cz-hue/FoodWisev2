import React, { createContext, useState } from 'react';

const FridgeContext = createContext();

const initialFridgeItems = [
  {
    id: 1,
    name: 'Jajka',
    quantity: 10,
    unit: 'szt.',
    category: 'nabia\u0142',
    expiryDate: '2024-07-01',
    dateAdded: '2026-05-12T08:30:00.000Z',
  },
  {
    id: 2,
    name: 'Mleko',
    quantity: 1,
    unit: 'l',
    category: 'nabia\u0142',
    expiryDate: '2024-07-01',
    dateAdded: '2026-05-13T09:15:00.000Z',
  },
  {
    id: 3,
    name: 'Chleb',
    quantity: 1,
    unit: 'szt.',
    category: 'pieczywo',
    expiryDate: '2024-07-01',
    dateAdded: '2026-05-14T07:45:00.000Z',
  },
  {
    id: 4,
    name: 'Mas\u0142o',
    quantity: 200,
    unit: 'g',
    category: 'nabia\u0142',
    expiryDate: '2024-07-01',
    dateAdded: '2026-05-15T11:20:00.000Z',
  },
  {
    id: 5,
    name: 'Ser',
    quantity: 300,
    unit: 'g',
    category: 'nabia\u0142',
    expiryDate: '2024-07-01',
    dateAdded: '2026-05-16T13:05:00.000Z',
  },
  {
    id: 6,
    name: 'Szczypiorek',
    quantity: 1,
    unit: 'p\u0119czek',
    category: 'warzywa',
    expiryDate: '2024-07-01',
    dateAdded: '2026-05-17T16:40:00.000Z',
  },
];

export function FridgeProvider({ children }) {
  const [fridgeItems, setFridgeItems] = useState(initialFridgeItems);

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
    <FridgeContext.Provider value={{ fridgeItems, addItem, removeItem, updateItem }}>
      {children}
    </FridgeContext.Provider>
  );
}

export { FridgeContext };
