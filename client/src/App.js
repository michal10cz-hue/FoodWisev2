import React, { useContext, useState } from 'react';
import { FridgeProvider } from './context/FridgeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import HomePage from './pages/HomePage';
import FridgePage from './pages/FridgePage';
import ScanPage from './pages/ScanPage';
import RecipesPage from './pages/RecipesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BottomNav from './components/BottomNav';
import './App.css';

function AuthenticatedApp() {
  const { logout, user } = useContext(AuthContext);
  const [activePage, setActivePage] = useState('home');
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <FridgeProvider>
      <div className="App">
        <header className="app-header">
          <span className="app-header-user">
            {user?.name ? `Cześć, ${user.name}` : 'Witaj!'}
          </span>
          <button type="button" className="link-button" onClick={logout}>
            Wyloguj
          </button>
        </header>

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
    </FridgeProvider>
  );
}

function UnauthenticatedApp() {
  const [authView, setAuthView] = useState('login');

  return (
    <div className="App auth-app">
      {authView === 'login' ? (
        <LoginPage onSwitchToRegister={() => setAuthView('register')} />
      ) : (
        <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
      )}
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isReady } = useContext(AuthContext);

  if (!isReady) {
    return null;
  }

  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
