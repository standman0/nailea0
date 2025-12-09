// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load current user on refresh
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      api.get('/auth/me')
        .then(res => {
          const data = res.data;
          const normalized = {
            ...data,
            isAdmin: data.role === 'admin' || data.role === 'Admin'
          };
          setUser(normalized);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);


  // -------------------------
  // REGISTER FUNCTION (NEW)
  // -------------------------
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password
      });

      // Backend should return: { token, user }
      const { token: newToken, user: userFromServer } = res.data;

      // Save token
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);

      // Normalize user object
      const normalizedUser = {
        ...userFromServer,
        isAdmin: userFromServer.role === 'admin' || userFromServer.role === 'Admin'
      };

      setUser(normalizedUser);

      return normalizedUser; // important!
    } catch (err) {
      console.error("Registration failed:", err.response?.data);
      throw err;
    }
  };


  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userFromServer } = res.data;

      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);

      const normalizedUser = {
        ...userFromServer,
        isAdmin: userFromServer.role === 'admin' || userFromServer.role === 'Admin'
      };
      setUser(normalizedUser);

      return normalizedUser;
    } catch (err) {
      console.error("Login failed:", err.response?.data);
      throw err;
    }
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,   // <-- IMPORTANT
        logout,
        isAdmin: () => !!user?.isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
