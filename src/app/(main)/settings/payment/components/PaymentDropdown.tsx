"use client";

import React from 'react';

type PaymentMethod = {
  id?: number;
  name: string;
  provider: string;
};

type Props = {
  seletedPaymentMethod: PaymentMethod | null;
  setSeletedPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
  filteredMethods: PaymentMethod[];
};

export default function PaymentDropdown({ seletedPaymentMethod, setSeletedPaymentMethod, filteredMethods }: Props) {
  return (
    <div className="mt-4">
      <label className="block text-sm text-slate-600 mb-2">Payment Method</label>
      <select
        value={seletedPaymentMethod?.id ?? ''}
        onChange={(e) => {
          const id = e.target.value;
          const found = filteredMethods.find((m) => String(m.id) === String(id));
          setSeletedPaymentMethod(found ?? null);
        }}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Select payment method</option>
        {filteredMethods.map((m) => (
          <option key={m.id ?? m.name} value={String(m.id ?? m.name)}>{`${m.name} (${m.provider})`}</option>
        ))}
      </select>
    </div>
  );
}
