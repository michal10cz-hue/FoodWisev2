import React, { createContext, useState, useContext } from 'react';

const FridgeContext = createContext();

export function FridgeProvider({ children }) {
  const [fridgeItems, setFridgeItems] = useState([
    { id: 1, name: 'Jajka', quantity: 10, unit: 'szt.' },
    { id: 2, name: 'Mleko', quantity: 1, unit: 'l' },
    { id: 3, name: 'Chleb', quantity: 1, unit: 'szt.' },
    { id: 4, name: 'Masło', quantity: 200, unit: 'g' },
    { id: 5, name: 'Ser', quantity: 300, unit: 'g' },
    { id: 6, name: 'Szczypiorek', quantity: 1, unit: 'pęczek' },
  ]);

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
    <FridgeContext.Provider value={{ fridgeItems, addItem, removeItem, updateItem }}>
      {children}
    </FridgeContext.Provider>
  );
}

export { FridgeContext };