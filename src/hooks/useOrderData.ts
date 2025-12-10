"use client";

import useAxiosSecure from '@/hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

// Define TypeScript interfaces based on the API response
interface OrderLine {
  id: number;
  product_id: number;
  name: string;
  qty: number;
  price_unit: number;
  subtotal: number;
}

export interface Order {
  id: number;
  name: string;
  merchant_id: number;
  merchant_name: string;
  rider_id: number | null;
  pickup_point_id: number | null;
  pickup_point: string | null;
  total_weight: number;
  customer_id: number | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_district_id: number;
  customer_city_id: number;
  cod_amount: number;
  cod_collected: number;
  cod_status: string;
  payment_status: string;
  delivery_state: string;
  parcel_type_id: number;
  parcel_type: string;
  order_type: string;
  order_lines: OrderLine[];
  delivery_state_log: any[]; // You might want to define a more specific type
}

interface OrderResponse {
  success: boolean;
  order: Order;
}

export const useOrderData = (orderId: string) => {
  const axiosSecure = useAxiosSecure();

  const fetchOrder = async (): Promise<Order> => {
    const response = await axiosSecure.get<OrderResponse>(`/orders/${orderId}`);
    
    if (!response.data.success) {
      throw new Error('Failed to fetch order data');
    }
    
    return response.data.order;
  };

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: fetchOrder,
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};