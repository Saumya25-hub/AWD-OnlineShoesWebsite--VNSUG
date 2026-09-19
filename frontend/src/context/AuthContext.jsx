import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password, captchaInput, captchaToken) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password, captchaInput, captchaToken });
      setUser(res.data);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setLoading(false);
      return { success: true, user: res.data };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', userData);
      setUser(res.data);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setLoading(false);
      return { success: true, user: res.data };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Registration failed.';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        loading,
        error,
        login,
        register,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
