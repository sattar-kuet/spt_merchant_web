"use client";

import React from "react";
import { Input } from "@/components/ui/Input";

const FinancialInfo: React.FC<{
  codAmount: string;
  setCodAmount: (v: string) => void;
}> = ({ codAmount, setCodAmount }) => {
  return (
    <div className="mt-4 bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-medium">Financial Information</h3>

      <div className="mt-4">
        <label className="text-sm text-slate-700">Cash on Delivery (COD) Amount</label>
        <Input
          value={codAmount}
          onChange={(e) => setCodAmount(e.target.value)}
          placeholder="$ 0.00"
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default FinancialInfo;
