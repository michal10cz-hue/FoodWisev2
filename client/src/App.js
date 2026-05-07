import React, { useState } from 'react';
import { FridgeProvider } from './context/FridgeContext';
import RecipeRecommendations from './components/RecipeRecommendations';
import ProductForm from './components/ProductForm'; 
import FridgeList from './components/FridgeList'; 
import './App.css';

function App() {
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <FridgeProvider>
      <div className="App">
        <h1>FoodWise</h1>
        <p>Aplikacja do zarządzania jedzeniem</p>
        
        <div className="dashboard">
          <div className="management-section" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 2fr', 
            gap: '2rem',
            marginBottom: '3rem' 
          }}>
            <ProductForm 
              editingProduct={editingProduct} 
              setEditingProduct={setEditingProduct} 
            />
            <FridgeList onEdit={setEditingProduct} />
          </div>

          <hr />

          <RecipeRecommendations />
        </div>
      </div>
    </FridgeProvider>
  );
}

export default App;