"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

const OrderSummary: React.FC<{
  codAmount: number;
}> = ({ codAmount }) => {
  const deliveryCharge = 5.0;
  const codFee = 1.5;
  const total = +(deliveryCharge + codFee + codAmount).toFixed(2);

  return (
    <div className="sticky top-6 space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h4 className="font-medium">Order Summary</h4>
        <div className="mt-3 text-sm text-slate-600">
          <div className="flex justify-between py-1">
            <span>Delivery Charge</span>
            <span>${deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>COD Fee</span>
            <span>${codFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t mt-2 font-semibold">
            <span>Total Amount to Collect</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" size="default">Cancel</Button>
        <Button variant="default" size="default">Create Parcel</Button>
      </div>
    </div>
  );
};

export default OrderSummary;
