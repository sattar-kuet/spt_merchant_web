"use client";

import axios, { AxiosInstance } from "axios";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function useAxiosSecure(): AxiosInstance {
  const { user } = useAuth();

  const axiosInstance = useMemo(() => {
    return axios.create({ baseURL: API_BASE_URL });
  }, []);

  useEffect(() => {
    // add request interceptor to include Authorization header when available
    const reqInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (user && user.api_key) {
          config.headers.Authorization = `Bearer ${user.api_key}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
    };
  }, [axiosInstance, user]);

  return axiosInstance;
}
