"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const OrdersHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
      <div>
        <h2 className="text-xl font-semibold">Order List</h2>
      </div>

      <Link href="/parcels/add-parcel/single-parcel" className="w-full sm:w-auto">
        <Button
          variant="default"
          size="default"
          className="w-full sm:w-auto whitespace-nowrap"
        >
          + Create New Order
        </Button>
      </Link>
    </div>
  );
};

export default OrdersHeader;