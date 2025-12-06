"use client";

import React from "react";

const FinancialInfo: React.FC<{
  codAmount: string;
  setCodAmount: (v: string) => void;
}> = ({ codAmount, setCodAmount }) => {
  return (
    <div className="mt-4 bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-medium">Financial Information</h3>

      <div className="mt-4">
        <label className="text-sm text-slate-700">Cash on Delivery (COD) Amount</label>
        <input
          value={codAmount}
          onChange={(e) => setCodAmount(e.target.value)}
          placeholder="$ 0.00"
          className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
};

export default FinancialInfo;
