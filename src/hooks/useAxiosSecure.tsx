"use client";

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useEffect, useMemo } from "react";
import { getAuthToken } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function useAxiosSecure(): AxiosInstance {
  const { logout } = useAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({ 
      baseURL: API_BASE_URL,
    });
    return instance;
  }, []);

  useEffect(() => {
    // Request interceptor to add Authorization header
    const reqInterceptor = axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle 401 errors
    const resInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, log the user out
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [axiosInstance, logout]);

  return axiosInstance;
}