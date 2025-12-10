"use client";

import useAxiosSecure from '@/hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface Order {
  id: number;
  name: string;
  customer_address: string;
  status: string;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_orders: number;
    per_page: number;
  };
}

// Default pagination values in case API doesn't return pagination data
const DEFAULT_PAGINATION = {
  current_page: 1,
  total_pages: 1,
  total_orders: 0,
  per_page: 10
};

interface FilterParams {
  status?: string | null;
  search?: string | null;
}

export const useOrdersData = (
  page: number = 1,
  limit: number = 10,
  filters: FilterParams = {}
) => {
  const { isAuthenticated } = useAuth();
  const axiosSecure = useAxiosSecure();

  const fetchOrders = async (): Promise<OrdersResponse> => {
    // Build query parameters as an object
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    // Add filters if they exist
    if (filters.status) {
      params.status = filters.status;
    }

    if (filters.search) {
      params.search = filters.search;
    }

    const url = "/orders";
    console.log("Fetching orders with URL:", url, "and params:", params); // Debug log
    const response = await axiosSecure.get(url, { params });
    console.log("Received response:", response.data); // Debug log
    if (!response.data.success) throw new Error("Failed to fetch orders data");
    return response.data;
  };

  const ordersQuery = useQuery({
    queryKey: ["orders", page, limit, filters],
    queryFn: fetchOrders,
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1 minute
  });

  // Extract pagination data or use defaults
  const paginationData = ordersQuery.data?.pagination || DEFAULT_PAGINATION;

  // If we have orders but no pagination data, calculate basic pagination
  const calculatedPagination = {
    ...paginationData,
    total_orders:
      ordersQuery.data?.orders?.length || paginationData.total_orders,
  };

  return {
    orders: ordersQuery.data?.orders ?? [],
    pagination: calculatedPagination,
    loading: ordersQuery.isLoading,
    error: ordersQuery.error ? (ordersQuery.error as Error).message : null,
    refetch: ordersQuery.refetch,
  };
};