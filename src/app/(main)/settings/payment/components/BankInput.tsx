"use client";

import React from 'react';

type PaymentMethod = { name: string; provider: string } | null;

type BankDetails = {
  accountHolderName: string;
  branch: string;
  accountNumber: string;
  routingNumber: string;
};

type Props = {
  seletedPaymentMethod: PaymentMethod;
  bankDetails: BankDetails;
  setBankDetails: React.Dispatch<React.SetStateAction<BankDetails>>;
};

export default function BankInput({ seletedPaymentMethod, bankDetails, setBankDetails }: Props) {
  const isBank = seletedPaymentMethod?.provider?.toLowerCase().includes('bank') ?? false;
  if (!isBank) return null;

  return (
    <div className="mt-4 grid grid-cols-1 gap-3">
      <input
        placeholder="Account holder name"
        value={bankDetails.accountHolderName}
        onChange={(e) => setBankDetails((s) => ({ ...s, accountHolderName: e.target.value }))}
        className="w-full px-3 py-2 border rounded"
      />

      <input
        placeholder="Branch"
        value={bankDetails.branch}
        onChange={(e) => setBankDetails((s) => ({ ...s, branch: e.target.value }))}
        className="w-full px-3 py-2 border rounded"
      />

      <input
        placeholder="Account number"
        value={bankDetails.accountNumber}
        onChange={(e) => setBankDetails((s) => ({ ...s, accountNumber: e.target.value }))}
        className="w-full px-3 py-2 border rounded"
      />

      <input
        placeholder="Routing / SWIFT"
        value={bankDetails.routingNumber}
        onChange={(e) => setBankDetails((s) => ({ ...s, routingNumber: e.target.value }))}
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  );
}
