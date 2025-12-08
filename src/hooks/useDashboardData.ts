import { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const { user } = useAuth();

  const formatDashboardItems = (): FormattedDashboardItem[] => {
    if (!dashboardData) return [];
    
    return [
      {
        title: "Total Orders",
        amount: dashboardData.total_orders,
        progress: "+0%",
        status: "growing"
      },
      {
        title: "Delivered",
        amount: dashboardData.delivered_orders,
        progress: "+0%",
        status: "growing"
      },
      {
        title: "In-Progress",
        amount: dashboardData.inprogress_orders,
        progress: "+0%",
        status: "equal"
      },
      {
        title: "Failed",
        amount: dashboardData.failed_orders,
        progress: "+0%",
        status: "warning"
      }
    ];
  };

  const formatRecentOrders = (): FormattedRecentOrder[] => {
    if (!dashboardData) return [];
    
    return dashboardData.recent_orders.slice(0, 3).map(order => {
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
        status
      };
    });
  };

  const formatEarningData = (): FormattedEarningData[] => {
    if (!chartData) return [];
    
    return chartData.earning.map((item, index) => ({
      x: item.label,
      y: item.value
    }));
  };

  const fetchDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Make API call to fetch dashboard data
      const response = await axios.get(`${API_BASE_URL}/api/v1/dashboard`, {
        headers: {
          'Authorization': `Bearer ${user.api_key}`
        }
      });
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err: any) {
      console.error('Dashboard data fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (endpoint: 'daily' | 'monthly' = 'daily') => {
    if (!user) return;

    try {
      setChartLoading(true);
      setChartError(null);
      
      // Make API call to fetch chart data
      const response = await axios.get(`${API_BASE_URL}/api/v1/dashboard/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${user.api_key}`
        }
      });
      
      if (response.data.success) {
        setChartData(response.data.data);
      } else {
        setChartError('Failed to fetch chart data');
      }
    } catch (err: any) {
      console.error('Chart data fetch error:', err);
      setChartError(err.response?.data?.message || err.message || 'Failed to fetch chart data');
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchChartData('daily'); // Load daily data by default
  }, [user]);

  return {
    dashboardData,
    loading,
    error,
    chartLoading,
    chartError,
    formattedDashboardItems: formatDashboardItems(),
    formattedRecentOrders: formatRecentOrders(),
    formattedEarningData: formatEarningData(),
    refreshData: fetchDashboardData,
    fetchChartData
  };
};