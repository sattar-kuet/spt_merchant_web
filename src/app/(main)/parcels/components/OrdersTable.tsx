"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Package, Scale, Phone } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface Order {
  id: number;
  name: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_address: string;
  cod_amount: number;
  total_weight: number;
  parcel_type: string | null;
  date: string | null;
  status: string;
}

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = "bg-gray-100 text-gray-800",
}) => (
  <span
    className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${color}`}
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
  // These are matched against the exact labels sale.order.delivery_state
  // returns from the backend (Odoo's selection field labels), not any
  // custom frontend wording
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return { color: "bg-green-100 text-green-800", label: "Delivered" };
      case "Out for Delivery":
        return { color: "bg-primary/10 text-primary", label: "Out for Delivery" };
      case "Ready for Pickup":
      case "Ready for Delivery":
        return { color: "bg-yellow-100 text-yellow-800", label: status };
      case "Rejected by Customer":
      case "Rejected by Merchant":
      case "Rejected Returning Hub":
        return { color: "bg-red-100 text-red-800", label: status };
      case "Parcel Created":
        return { color: "bg-purple-100 text-purple-800", label: status };
      case "Assigned for Pickup":
      case "Assigned for Delivery":
        return { color: "bg-primary/10 text-primary", label: status };
      case "Pickup Completed":
        return { color: "bg-green-100 text-green-800", label: status };
      case "In Hub":
        return { color: "bg-primary/5 text-primary", label: status };
      case "Transferring for Delivery":
      case "Transferred for Delivery":
      case "Transferring for Return":
      case "Transferred for Return":
        return { color: "bg-primary/5 text-primary", label: status };
      case "Return for Reschedule":
      case "Rescheduled":
        return { color: "bg-orange-100 text-orange-800", label: status };
      case "Returned to Merchant":
        return { color: "bg-gray-100 text-gray-800", label: status };
      default:
        return { color: "bg-slate-100 text-slate-800", label: status };
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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
              <th className="p-4">PARCEL</th>
              <th className="p-4">CUSTOMER</th>
              <th className="p-4">ADDRESS</th>
              <th className="p-4">COD</th>
              <th className="p-4">WEIGHT</th>
              <th className="p-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-slate-50 cursor-pointer transition-colors"
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
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Package size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{order.name}</div>
                        <div className="text-xs text-slate-400">
                          {order.date ?? "-"}
                          {order.parcel_type ? ` · ${order.parcel_type}` : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-700">
                      {order.customer_name || "-"}
                    </div>
                    {order.customer_phone && (
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Phone size={10} />
                        {order.customer_phone}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-slate-500 max-w-[220px]">
                    {order.customer_address}
                  </td>
                  <td className="p-4 font-medium text-slate-800 tabular-nums">
                    ৳{order.cod_amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-slate-500 tabular-nums">
                    <div className="flex items-center gap-1">
                      <Scale size={12} className="text-slate-400" />
                      {order.total_weight} kg
                    </div>
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
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card
              key={order.id}
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => goToOrder(order.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Package size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{order.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {order.customer_name || order.customer_address}
                      </div>
                    </div>
                  </div>
                  <Badge color={getStatusColor(order.status).color}>
                    {getStatusColor(order.status).label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span>{order.date ?? "-"}</span>
                  <span className="flex items-center gap-1">
                    <Scale size={12} />
                    {order.total_weight} kg
                  </span>
                  <span className="font-semibold text-slate-800">
                    ৳{order.cod_amount.toLocaleString()}
                  </span>
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
