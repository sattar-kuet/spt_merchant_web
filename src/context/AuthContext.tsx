"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { signOut } from "next-auth/react";
import { removeAuthToken, setAuthToken, isAuthenticated, getAuthToken } from '@/lib/auth';

// Updated to use your actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface User {
  user_id: number;
  name: string;
  email: string;
  groups: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Try to restore user from localStorage (we store non-sensitive user info there)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        setUser(null);
      }
    } else {
      // No stored user; if auth token exists we keep user null (can fetch later)
      if (isAuthenticated()) setUser(null);
    }
    setLoading(false);
  }, []);

  // Periodically check token validity and log out proactively if token expired
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          // clear state/token and redirect without calling logout (avoids dependency problems)
          setUser(null);
          try { localStorage.removeItem('user'); } catch (e) { /* ignore */ }
          removeAuthToken();

          try {
            await signOut({ redirect: false });
          } catch (e) { /* ignore */ }

          try { window.location.href = '/auth/login'; } catch (e) { /* ignore */ }
        }
      } catch (e) {
        // ignore
      }
    }, 30 * 1000); // every 30s

    return () => clearInterval(id);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // Using your provided endpoint structure
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password
      });

      if (response.data.success) {
        // Extract api_key and keep remaining user fields via spread
        const { api_key, expires_in, expires_at, ...rest } = response.data;
        if (api_key) {
          // prefer expires_in (seconds) if provided, else use expires_at (timestamp)
          if (typeof expires_in === 'number') {
            setAuthToken(api_key, expires_in);
          } else if (expires_at) {
            try {
              const at = Number(expires_at);
              if (!Number.isNaN(at)) {
                const ttl = Math.floor((at - Date.now()) / 1000);
                if (ttl > 0) setAuthToken(api_key, ttl);
                else setAuthToken(api_key);
              } else {
                setAuthToken(api_key);
              }
            } catch (e) {
              setAuthToken(api_key);
            }
          } else {
            setAuthToken(api_key);
          }
        }

        // Ensure groups exists
        const userData = { ...(rest as any), groups: rest.groups || [] } as any;

        setUser(userData);
        try {
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.error('Failed to write user to localStorage', e);
        }

        return { success: true };
      } else {
        return { success: false, message: 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle network errors specifically
      if (error.code === 'ERR_NETWORK') {
        return { success: false, message: 'Unable to connect to the server. Please check your internet connection and ensure the backend server is running.' };
      }

      return { success: false, message: error.response?.data?.message || error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Updated to use your provided endpoint
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });

      if (response.data.success) {
        // Extract api_key and keep remaining user fields via spread
        const { api_key, expires_in, expires_at, ...rest } = response.data;
        if (api_key) {
          if (typeof expires_in === 'number') {
            setAuthToken(api_key, expires_in);
          } else if (expires_at) {
            try {
              const at = Number(expires_at);
              if (!Number.isNaN(at)) {
                const ttl = Math.floor((at - Date.now()) / 1000);
                if (ttl > 0) setAuthToken(api_key, ttl);
                else setAuthToken(api_key);
              } else {
                setAuthToken(api_key);
              }
            } catch (e) {
              setAuthToken(api_key);
            }
          } else {
            setAuthToken(api_key);
          }
        }

        const userData = { ...(rest as any), groups: rest.groups || [] } as any;

        setUser(userData);
        try {
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.error('Failed to write user to localStorage', e);
        }

        return { success: true };
      } else {
        return { success: false, message: 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle network errors specifically
      if (error.code === 'ERR_NETWORK') {
        return { success: false, message: 'Unable to connect to the server. Please check your internet connection and ensure the backend server is running.' };
      }

      return { success: false, message: error.response?.data?.message || error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    // Remove token cookie and local user data
    try {
      localStorage.removeItem('user');
    } catch (e) {
      console.error('Failed to remove user from localStorage', e);
    }
    removeAuthToken();

    // Clear NextAuth session (Google OAuth) without redirecting immediately
    // We handle the main redirect manually below
    try {
      await signOut({ redirect: false });
    } catch (e) {
      console.error('Failed to sign out from NextAuth', e);
    }

    // Redirect to login so user cannot access protected screens
    try {
      window.location.href = '/auth/login';
    } catch (e) {
      // ignore in non-browser contexts
    }
    // In a real app, you might also call a logout endpoint to clear server-side session
  };

  const value = {
    user,
    isAuthenticated: !!user || isAuthenticated(),
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};