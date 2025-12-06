"use client";

import React from "react";

const ParcelDetails: React.FC<{
  weight: string;
  setWeight: (v: string) => void;
  parcelType: string;
  setParcelType: (v: string) => void;
}> = ({ weight, setWeight, parcelType, setParcelType }) => {
  return (
    <div className="mt-4 bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-medium">Parcel Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g., 2.5"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <select
          value={parcelType}
          onChange={(e) => setParcelType(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Select a type</option>
          <option value="document">Document</option>
          <option value="parcel">Parcel</option>
          <option value="fragile">Fragile</option>
        </select>
      </div>
    </div>
  );
};

export default ParcelDetails;
