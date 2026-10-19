import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rc_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('rc_token'))
      .finally(() => setLoading(false));
  }, []);

  function persist(session) {
    localStorage.setItem('rc_token', session.token);
    setUser(session.user);
  }

  async function login(email, password) {
    const session = await authApi.login({ email, password });
    persist(session);
    return session.user;
  }

  async function register(name, email, password) {
    const session = await authApi.register({ name, email, password });
    persist(session);
    return session.user;
  }

  function logout() {
    localStorage.removeItem('rc_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
