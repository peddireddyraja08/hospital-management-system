import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, refreshToken, username, email } = response.data.data;
      if (token && token.split('.').length === 3) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify({ username, email }));
        setUser({ username, email });
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Invalid token received from server.'
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateLocalUser = (userData) => {
    const username = userData.username || user?.username;
    const email = userData.email || user?.email;
    const newUser = { username, email };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, refreshToken, username, email } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({ username, email }));
      
      setUser({ username, email });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
