"use client";

import { useEffect } from 'react';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface DashboardData {
  balance: number;
  total_orders: number;
  delivered_orders: number;
  failed_orders: number;
  inprogress_orders: number;
  recent_orders: Array<{
    id: number;
    tracking_number: string;
    status: string;
    location: {
      district: string;
      city: string;
    };
  }>;
  earning: Array<{
    label: string;
    value: number;
  }>;
  pickup_point_complete: boolean;
  bank_complete: boolean;
}

interface ChartData {
  earning: Array<{
    label: string;
    value: number;
  }>;
}

interface FormattedDashboardItem {
  title: string;
  amount: number;
  progress: string;
  status: "growing" | "equal" | "warning";
}

interface FormattedRecentOrder {
  orderId: string;
  customer: string;
  status: "Delivered" | "In-Progress" | "Failed";
}

interface FormattedEarningData {
  x: string;
  y: number;
}

export const useDashboardData = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const fetchDashboard = async (): Promise<DashboardData> => {
    const response = await axiosSecure.get(`/dashboard`);
    if (!response.data.success) throw new Error('Failed to fetch dashboard data');
    return response.data.data;
  };

  const fetchChart = async (endpoint: 'daily' | 'monthly' = 'daily'): Promise<ChartData> => {
    const response = await axiosSecure.get(`/dashboard/${endpoint}`);
    if (!response.data.success) throw new Error('Failed to fetch chart data');
    return response.data.data;
  };

  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  const dailyChartQuery = useQuery({
    queryKey: ['dashboard', 'daily'],
    queryFn: () => fetchChart('daily'),
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  const monthlyChartQuery = useQuery({
    queryKey: ["dashboard", "monthly"],
    queryFn: () => fetchChart("monthly"),
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  const formatDashboardItems = (): FormattedDashboardItem[] => {
    const dashboardData = dashboardQuery.data;
    if (!dashboardData) return [];

    return [
      {
        title: "Total Orders",
        amount: dashboardData.total_orders,
        progress: "+0%",
        status: "growing",
      },
      {
        title: "Delivered",
        amount: dashboardData.delivered_orders,
        progress: "+0%",
        status: "growing",
      },
      {
        title: "In-Progress",
        amount: dashboardData.inprogress_orders,
        progress: "+0%",
        status: "equal",
      },
      {
        title: "Failed",
        amount: dashboardData.failed_orders,
        progress: "+0%",
        status: "warning",
      },
    ];
  };

  const formatRecentOrders = (): FormattedRecentOrder[] => {
    const dashboardData = dashboardQuery.data;
    if (!dashboardData) return [];

    return dashboardData.recent_orders.slice(0, 3).map((order) => {
      let status: "Delivered" | "In-Progress" | "Failed" = "In-Progress";

      if (order.status === "delivered") {
        status = "Delivered";
      } else if (order.status === "assigned_for_delivery") {
        status = "In-Progress";
      } else if (order.status === "created") {
        status = "In-Progress";
      } else if (order.status === "failed") {
        status = "Failed";
      }

      return {
        orderId: order.tracking_number,
        customer: `${order.location.district}, ${order.location.city}`,
        status,
      };
    });
  };

  const formatEarningData = (
    endpoint: "daily" | "monthly" = "daily"
  ): FormattedEarningData[] => {
    const chartData =
      endpoint === "daily" ? dailyChartQuery.data : monthlyChartQuery.data;
    if (!chartData) return [];

    return chartData.earning.map((item) => ({ x: item.label, y: item.value }));
  };

  // expose a manual refresh
  const refreshData = () => dashboardQuery.refetch();

  const fetchChartData = async (endpoint: "daily" | "monthly" = "daily") => {
    if (!isAuthenticated) return null;
    const key = ["dashboard", endpoint];
    return queryClient.fetchQuery({
      queryKey: key,
      queryFn: () => fetchChart(endpoint),
    });
  };
  useEffect(() => {
    // When authentication state changes to authenticated, invalidate and refetch queries
    if (isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  }, [isAuthenticated, queryClient]);

  // Add this effect to handle authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.removeQueries({ queryKey: ["dashboard"] });
    }
  }, [isAuthenticated, queryClient]);

  return {
    dashboardData: dashboardQuery.data ?? null,
    loading: dashboardQuery.isLoading,
    error: dashboardQuery.error
      ? (dashboardQuery.error as Error).message
      : null,
    chartLoading: dailyChartQuery.isLoading || monthlyChartQuery.isLoading,
    chartError: dailyChartQuery.error
      ? (dailyChartQuery.error as Error).message
      : monthlyChartQuery.error
        ? (monthlyChartQuery.error as Error).message
        : null,
    formattedDashboardItems: formatDashboardItems(),
    formattedRecentOrders: formatRecentOrders(),
    formattedEarningData: formatEarningData,
    refreshData,
    fetchChartData,
  };
};