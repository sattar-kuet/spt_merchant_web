"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useParams } from "next/navigation";
import { useOrderData } from "@/hooks/useOrderData";

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `৳${amount.toFixed(2)}`;
};

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "text-green-600";
    case "pending":
      return "text-amber-500";
    case "in_transit":
    case "out_for_delivery":
      return "text-blue-600";
    case "cancelled":
      return "text-red-600";
    case "paid":
      return "text-green-600";
    case "unsettled":
      return "text-amber-500";
    default:
      return "text-slate-600";
  }
};

// Helper function to format delivery state
const formatDeliveryState = (state: string): string => {
  // Convert snake_case to Title Case
  return state
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function OrderDetail() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError, error } = useOrderData(id);

  if (isLoading) {
    return (
      <div className="p-5 w-full">
        <div className="flex justify-center items-center h-64">
          <div>Loading order details...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-5 w-full">
        <div className="flex justify-center items-center h-64">
          <div>
            Error loading order details:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-5 w-full">
        <div className="flex justify-center items-center h-64">
          <div>Order not found</div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = data.order_lines.reduce(
    (sum, line) => sum + line.subtotal,
    0
  );

  return (
    <div className="p-5 w-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">
            Dashboard / Orders / ID : {data.id}
          </div>
          <h1 className="text-2xl font-semibold mt-2">Order ID: {data.name}</h1>
          <div className="text-sm text-blue-600 mt-1">
            Tracking Number: #{data.name}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="default">
            Edit Order
          </Button>
          <Button variant="default" size="default">
            Print Label
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-medium mb-3">Order Lines</h3>
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 border-b">
                <tr>
                  <th className="py-2 text-left">Product ID</th>
                  <th className="py-2 text-left">Amount Name</th>
                  <th className="py-2 text-left">QUANTITY</th>
                  <th className="py-2 text-left">UNIT PRICE</th>
                  <th className="py-2 text-right">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {data.order_lines.map((line) => (
                  <tr key={line.id} className="border-b">
                    <td className="py-3">{line.product_id}</td>
                    <td className="py-3">{line.name}</td>
                    <td>{line.qty}</td>
                    <td>{formatCurrency(line.price_unit)}</td>
                    <td className="text-right">
                      {formatCurrency(line.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-right text-sm text-slate-600">
              <div>
                Subtotal{" "}
                <span className="ml-4 font-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {/* Add shipping and taxes if available in the API */}
              <div className="mt-2 font-semibold">
                Grand Total{" "}
                <span className="ml-4">{formatCurrency(subtotal)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-medium mb-3">Customer & Merchant Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <div className="font-medium">Merchant Name</div>
                <div>{data.merchant_name}</div>
                <div className="mt-2 font-medium">Contact Phone</div>
                <div>N/A</div> {/* Not provided in API response */}
              </div>

              <div>
                <div className="font-medium">Customer Name</div>
                <div>{data.customer_name}</div>
                <div className="mt-2 font-medium">Delivery Address</div>
                <div>{data.customer_address}</div>
                <div className="mt-2 font-medium">Phone</div>
                <div>{data.customer_phone}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium">Order Summary</h4>
            <div className="mt-3 text-sm text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span>Delivery State</span>
                <span className={getStatusColor(data.delivery_state)}>
                  {formatDeliveryState(data.delivery_state)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Weight</span>
                <span>{data.total_weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Parcel Type</span>
                <span>{data.parcel_type}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Type</span>
                <span>{formatDeliveryState(data.order_type)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium">Financial Summary</h4>
            <div className="mt-3 text-sm text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className={getStatusColor(data.payment_status)}>
                  {data.payment_status.charAt(0).toUpperCase() +
                    data.payment_status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>COD Status</span>
                <span className={getStatusColor(data.cod_status)}>
                  {data.cod_status.charAt(0).toUpperCase() +
                    data.cod_status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>COD Amount</span>
                <span>{formatCurrency(data.cod_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>COD Collected</span>
                <span>{formatCurrency(data.cod_collected)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
