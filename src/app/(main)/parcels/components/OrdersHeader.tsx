"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const OrdersHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
      <div>
        <h2 className="text-xl font-semibold">Order List</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Input placeholder="Search" />
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
    </div>
  );
};

export default OrdersHeader;