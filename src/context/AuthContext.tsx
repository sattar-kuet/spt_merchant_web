"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { removeAuthToken } from '@/lib/auth';
import { isAuthenticated } from '@/lib/auth';

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
    // Check if user is logged in by verifying token exists
    if (isAuthenticated()) {
      // In a real app, you might want to validate the token with the backend
      // For now, we'll just set a minimal user state
      // The full user data should be fetched when needed
      setUser(null); // We'll fetch user data when needed
    }
    setLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // Using your provided endpoint structure
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password
      }, {
        withCredentials: true // Enable sending cookies
      });

      if (response.data.success) {
        // The token should be set in a cookie by the backend
        // Store only non-sensitive user data in state
        const userData = {
          user_id: response.data.user_id,
          name: response.data.name,
          email: response.data.email,
          groups: response.data.groups || []
        };
        
        setUser(userData);
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
      }, {
        withCredentials: true // Enable sending cookies
      });

      if (response.data.success) {
        // The token should be set in a cookie by the backend
        // Store only non-sensitive user data in state
        const userData = {
          user_id: response.data.user_id,
          name: response.data.name,
          email: response.data.email,
          groups: response.data.groups || []
        };
        
        setUser(userData);
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

  const logout = () => {
    setUser(null);
    // Remove token cookie
    removeAuthToken();
    // In a real app, you might want to call a logout endpoint to clear server-side session
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