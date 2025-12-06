"use client";

import React from "react";

const OrdersHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <h2 className="text-xl font-semibold">Order List</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Search"
          />
        </div>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm">
          + Create New Order
        </button>
      </div>
    </div>
  );
};

export default OrdersHeader;
