"use client";

import React from "react";

const CustomerInformation: React.FC<{
  fullName: string;
  setFullName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
}> = ({ fullName, setFullName, phone, setPhone, address, setAddress }) => {
  return (
    <div className="space-y-4 bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-medium">Customer Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter customer's full name"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter full address"
          className="w-full md:col-span-2 rounded-md border px-3 py-2 text-sm"
        />

        <select className="w-full rounded-md border px-3 py-2 text-sm">
          <option>Select a district</option>
        </select>
        <select className="w-full rounded-md border px-3 py-2 text-sm">
          <option>Select a city</option>
        </select>
      </div>
    </div>
  );
};

export default CustomerInformation;
