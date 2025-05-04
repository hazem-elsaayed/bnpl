import React, { createContext, useState, useEffect } from 'react';
import api from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  const login = (access, refresh) => {
    setToken(access);
    setRefreshToken(refresh);
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    try {
      const payload = JSON.parse(atob(access.split('.')[1]));
      setUser({ email: payload.email, role: payload.role, username: payload.username });
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const updateToken = (access) => {
    setToken(access);
    localStorage.setItem('token', access);
    try {
      const payload = JSON.parse(atob(access.split('.')[1]));
      setUser({ email: payload.email, role: payload.role, username: payload.username });
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.email, role: payload.role, username: payload.username });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    // Set up axios interceptor for token refresh and auto logout
    const interceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (!originalRequest._retry && error.response && error.response.status === 401 && refreshToken) {
          originalRequest._retry = true;
          try {
            const res = await api.post('token/refresh/', { refresh: refreshToken });
            updateToken(res.data.access);
            originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access;
            return api(originalRequest);
          } catch (err) {
            logout();
            window.location.href = '/login';
            return Promise.reject(err);
          }
        }
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [refreshToken, updateToken, logout]);

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, login, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};
