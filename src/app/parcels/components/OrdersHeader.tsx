"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const OrdersHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <h2 className="text-xl font-semibold">Order List</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Input
            placeholder="Search"
          />
        </div>
        <Button variant="default" size="default">
          + Create New Order
        </Button>
      </div>
    </div>
  );
};

export default OrdersHeader;
