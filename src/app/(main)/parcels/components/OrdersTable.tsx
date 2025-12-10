"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface Order {
  id: number;
  name: string;
  customer_address: string;
  status: string;
}

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = "bg-gray-100 text-gray-800",
}) => (
  <span
    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${color}`}
  >
    {children}
  </span>
);

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  error,
}) => {
  const router = useRouter();

  const goToOrder = (id: number) => {
    router.push(`/parcels/${encodeURIComponent(id)}`);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    // Map actual status values from API to display colors
    switch (status) {
      case "Delivered":
        return { color: "bg-green-100 text-green-800", label: "Delivered" };
      case "Out for Delivery":
        return {
          color: "bg-blue-100 text-blue-800",
          label: "Out for Delivery",
        };
      case "Ready for Pickup":
        return {
          color: "bg-yellow-100 text-yellow-800",
          label: "Ready for Pickup",
        };
      case "Delivery Failed":
        return { color: "bg-red-100 text-red-800", label: "Delivery Failed" };
      case "Created":
        return { color: "bg-purple-100 text-purple-800", label: "Created" };
      case "Assigned for Pickup":
        return {
          color: "bg-indigo-100 text-indigo-800",
          label: "Assigned for Pickup",
        };
      case "Rejected by Merchant":
        return {
          color: "bg-red-100 text-red-800",
          label: "Rejected by Merchant",
        };
      case "Pickup Done":
        return { color: "bg-green-100 text-green-800", label: "Pickup Done" };
      case "In Hub":
        return { color: "bg-blue-100 text-blue-800", label: "In Hub" };
      case "Returned to Hub":
        return {
          color: "bg-orange-100 text-orange-800",
          label: "Returned to Hub",
        };
      case "Return Initiated":
        return {
          color: "bg-orange-100 text-orange-800",
          label: "Return Initiated",
        };
      case "Returned to Merchant":
        return {
          color: "bg-gray-100 text-gray-800",
          label: "Returned to Merchant",
        };
      default:
        return { color: "bg-slate-100 text-slate-800", label: status };
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-2 text-slate-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error loading orders: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs text-slate-500">
              <th className="p-4 w-10">
                <Checkbox />
              </th>
              <th className="p-4">ORDER ID</th>
              <th className="p-4">CUSTOMER ADDRESS</th>
              <th className="p-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-slate-50 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => goToOrder(order.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") goToOrder(order.id);
                  }}
                >
                  <td className="p-4">
                    <Checkbox onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td className="p-4 font-medium">{order.name}</td>
                  <td className="p-4 text-slate-500">
                    {order.customer_address}
                  </td>
                  <td className="p-4">
                    <Badge color={getStatusColor(order.status).color}>
                      {getStatusColor(order.status).label}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card
              key={order.id}
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => goToOrder(order.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{order.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {order.customer_address}
                    </div>
                  </div>
                  <Badge color={getStatusColor(order.status).color}>
                    {getStatusColor(order.status).label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
            <p className="text-slate-500">No orders found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersTable;