"use client";

import React from 'react';

type MobileInputProps = {
  seletedPaymentMethod: { name: string; provider: string } | null;
  mobileNumber: string | undefined;
  setMobileNumber: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function MobileInput({ seletedPaymentMethod, mobileNumber, setMobileNumber }: MobileInputProps) {
  if (seletedPaymentMethod?.provider !== 'mobile') return null;

  return (
    <input
      placeholder={`Enter ${seletedPaymentMethod.name} number`}
      inputMode="numeric"
      value={mobileNumber ?? ''}
      onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
      className="w-full px-3 py-3 mt-4 border-2 border-gray-200 rounded-md text-black"
    />
  );
}
