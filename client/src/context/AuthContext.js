import React, { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'bdio_szpont_auth_user';
const API_BASE = '/api';

async function postJson(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // odpowiedz bez body - zostawiamy data = null
  }

  if (!response.ok) {
    const message = (data && data.error) || `Blad serwera (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      // Ignorujemy uszkodzony stan w localStorage
    }
    setIsReady(true);
  }, []);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error('Podaj e-mail i hasło.');
    }
    const data = await postJson('/auth/login', { email, password });
    persistUser(data);
    return data;
  };

  const register = async ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw new Error('Wypełnij wszystkie pola.');
    }
    const data = await postJson('/auth/register', { name, email, password });
    persistUser(data);
    return data;
  };

  const logout = () => {
    persistUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), isReady, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
