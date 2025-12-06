"use client";

import React from "react";

const FiltersBar: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 my-4">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="w-full md:w-64">
          <button className="w-full rounded-md border px-3 py-2 text-sm text-left">Oct 5, 2023 - Nov 7, 2023</button>
        </div>
        <div className="w-full md:w-48">
          <select className="w-full rounded-md border px-3 py-2 text-sm">
            <option>Delivery State</option>
          </select>
        </div>
        <div className="w-full md:w-48">
          <select className="w-full rounded-md border px-3 py-2 text-sm">
            <option>Payment Status</option>
          </select>
        </div>
        <div className="w-full md:w-48">
          <select className="w-full rounded-md border px-3 py-2 text-sm">
            <option>COD Status</option>
          </select>
        </div>

        <div className="ml-auto flex gap-2">
          <button className="rounded-md border px-4 py-2 text-sm">Clear</button>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
