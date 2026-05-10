import React, { useState } from 'react';
import { FridgeProvider } from './context/FridgeContext';
import HomePage from './pages/HomePage';
import FridgePage from './pages/FridgePage';
import ScanPage from './pages/ScanPage';
import RecipesPage from './pages/RecipesPage';
import BottomNav from './components/BottomNav';
import './App.css';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <div className="App">
      <main className="content-shell">
        {activePage === 'home' && <HomePage onNavigate={setActivePage} />}
        {activePage === 'fridge' && <FridgePage onEdit={setEditingProduct} />}
        {activePage === 'scan' && (
          <ScanPage editingProduct={editingProduct} setEditingProduct={setEditingProduct} />
        )}
        {activePage === 'recipes' && <RecipesPage />}
      </main>

      <BottomNav activePage={activePage} onChange={setActivePage} />
    </div>
  );
}

function App() {
  return (
    <FridgeProvider>
      <AppContent />
    </FridgeProvider>
  );
}

export default App;
