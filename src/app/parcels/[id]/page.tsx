import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Order Detail",
};
export default async function OrderDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div className="p-5 w-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">Dashboard / Orders / ID : {id}</div>
          <h1 className="text-2xl font-semibold mt-2">Order ID: {id}</h1>
          <div className="text-sm text-blue-600 mt-1">Tracking Number: #{id}</div>
        </div>
        <div className="flex gap-3">
          <button className="rounded-md border px-4 py-2 text-sm">Edit Order</button>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Print Label</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-medium mb-3">Order Lines</h3>
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 border-b">
                <tr>
                  <th className="py-2 text-left">PRODUCT NAME</th>
                  <th className="py-2 text-left">QUANTITY</th>
                  <th className="py-2 text-left">UNIT PRICE</th>
                  <th className="py-2 text-right">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">Premium Wireless Headphones</td>
                  <td>1</td>
                  <td>$35.00</td>
                  <td className="text-right">$35.00</td>
                </tr>
                <tr>
                  <td className="py-3">Ergonomic Mouse Pad</td>
                  <td>2</td>
                  <td>$5.00</td>
                  <td className="text-right">$10.00</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 text-right text-sm text-slate-600">
              <div>Subtotal <span className="ml-4 font-medium">$45.00</span></div>
              <div>Shipping <span className="ml-4">$5.00</span></div>
              <div>Taxes <span className="ml-4">$4.50</span></div>
              <div className="mt-2 font-semibold">Grand Total <span className="ml-4">$54.50</span></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-medium mb-3">Customer & Merchant Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <div className="font-medium">Merchant Name</div>
                <div>John&apos;s Store</div>
                <div className="mt-2 font-medium">Contact Phone</div>
                <div>(123) 456-7890</div>
              </div>

              <div>
                <div className="font-medium">Customer Name</div>
                <div>Jane Doe</div>
                <div className="mt-2 font-medium">Delivery Address</div>
                <div>123 Maple Street, Anytown, USA 12345</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium">Order Summary</h4>
            <div className="mt-3 text-sm text-slate-600 space-y-2">
              <div className="flex justify-between"><span>Delivery State</span><span className="text-amber-500">In Transit</span></div>
              <div className="flex justify-between"><span>Total Weight</span><span>2.5 kg</span></div>
              <div className="flex justify-between"><span>Parcel Type</span><span>Express</span></div>
              <div className="flex justify-between"><span>Order Type</span><span>Delivery</span></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium">Financial Summary</h4>
            <div className="mt-3 text-sm text-slate-600 space-y-2">
              <div className="flex justify-between"><span>Payment Status</span><span className="text-green-600">Paid</span></div>
              <div className="flex justify-between"><span>COD Status</span><span className="text-amber-500">Pending</span></div>
              <div className="flex justify-between"><span>COD Amount</span><span>$45.00</span></div>
              <div className="flex justify-between"><span>COD Collected</span><span>$0.00</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
