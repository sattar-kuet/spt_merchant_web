"use client";

import React from "react";

const AddHeader: React.FC<{ title?: string; subtitle?: string }> = ({
  title = "Add Single Parcel",
  subtitle = "Create a parcel manually or import from CSV",
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
};

export default AddHeader;
