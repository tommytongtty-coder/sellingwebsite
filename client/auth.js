import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from './services/api';

// Guard for SSR where localStorage is not available
const storage = typeof localStorage !== 'undefined' ? localStorage : null;

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  setAuth: () => {},
  clearAuth: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => storage && storage.getItem('token'));
  const [loading, setLoading] = useState(!!(storage && storage.getItem('token')));

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    if (storage) storage.removeItem('token');
  }, []);

  const setAuth = useCallback(({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
    if (storage) storage.setItem('token', newToken);
  }, []);

  // On mount, if we have a stored token, fetch the current user
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((u) => setUser(u))
      .catch(() => {
        // Token is invalid or expired — clear it
        clearAuth();
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, token, loading, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
