import React from 'react';
import { FridgeProvider } from './context/FridgeContext';
import RecipeRecommendations from './components/RecipeRecommendations';
import './App.css';

function App() {
  return (
    <FridgeProvider>
      <div className="App">
        <h1>FoodWise</h1>
        <p>Aplikacja do zarządzania jedzeniem</p>
        <RecipeRecommendations />
      </div>
    </FridgeProvider>
  );
}

export default App;
