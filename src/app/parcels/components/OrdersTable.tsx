"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/Checkbox";

type Order = {
  id: string;
  tracking: string;
  customer: string;
  phone?: string;
  merchant: string;
  cod: string;
  paymentStatus: "Paid" | "Unpaid";
  deliveryState: string;
};

const sampleOrders: Order[] = [
  { id: "#834521", tracking: "TRK987654321", customer: "John Doe", phone: "555-123-4567", merchant: "Global Imports", cod: "$150.00", paymentStatus: "Paid", deliveryState: "Delivered" },
  { id: "#834522", tracking: "TRK123456789", customer: "Jane Smith", phone: "555-987-6543", merchant: "Tech Gadgets", cod: "$50.00", paymentStatus: "Unpaid", deliveryState: "In Transit" },
  { id: "#834523", tracking: "TRK543219876", customer: "Mike Johnson", phone: "555-456-7890", merchant: "Fashion Hub", cod: "$25.00", paymentStatus: "Paid", deliveryState: "Out for Delivery" },
  { id: "#834524", tracking: "TRK678954321", customer: "Emily Davis", phone: "555-321-6549", merchant: "Home Essentials", cod: "$300.00", paymentStatus: "Paid", deliveryState: "Delivery Failed" },
  { id: "#834525", tracking: "TRK192837465", customer: "Chris Wilson", phone: "555-654-3210", merchant: "Global Imports", cod: "$75.50", paymentStatus: "Unpaid", deliveryState: "Pending Pickup" },
];

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-gray-100 text-gray-800" }) => (
  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${color}`}>{children}</span>
);

const OrdersTable: React.FC = () => {
  const router = useRouter();

  const goToOrder = (rawId: string) => {
    const id = rawId.replace(/[^a-zA-Z0-9-_]/g, "");
    router.push(`/parcels/${encodeURIComponent(id)}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs text-slate-500">
            <th className="p-4 w-10"><Checkbox /></th>
            <th className="p-4">ORDER ID</th>
            <th className="p-4">TRACKING NO.</th>
            <th className="p-4">CUSTOMER</th>
            <th className="p-4">MERCHANT</th>
            <th className="p-4">COD AMOUNT</th>
            <th className="p-4">PAYMENT STATUS</th>
            <th className="p-4">DELIVERY STATE</th>
            <th className="p-4">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {sampleOrders.map((o) => (
            <tr
              key={o.id}
              className="border-t hover:bg-slate-50 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => goToOrder(o.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goToOrder(o.id);
              }}
            >
              <td className="p-4"><Checkbox onClick={(e) => e.stopPropagation()} /></td>
              <td className="p-4 font-medium">{o.id}</td>
              <td className="p-4 text-slate-500">{o.tracking}</td>
              <td className="p-4">
                <div className="font-medium">{o.customer}</div>
                <div className="text-xs text-slate-400">{o.phone}</div>
              </td>
              <td className="p-4 text-slate-500">{o.merchant}</td>
              <td className="p-4">{o.cod}</td>
              <td className="p-4">
                {o.paymentStatus === "Paid" ? (
                  <Badge color="bg-green-100 text-green-800">Paid</Badge>
                ) : (
                  <Badge color="bg-amber-100 text-amber-800">Unpaid</Badge>
                )}
              </td>
              <td className="p-4">
                <Badge color={
                  o.deliveryState === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : o.deliveryState === "Delivery Failed"
                    ? "bg-red-100 text-red-800"
                    : o.deliveryState === "Out for Delivery"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-slate-100 text-slate-800"
                }>
                  {o.deliveryState}
                </Badge>
              </td>
              <td className="p-4 text-slate-400">•••</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
