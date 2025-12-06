"use client";

import React from "react";

const Pagination: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-4 text-sm text-slate-600">
      <div>Showing 1-5 of 100</div>
      <div className="flex items-center gap-2">
        <button className="rounded-md border px-3 py-1">Previous</button>
        <button className="rounded-md border px-3 py-1 bg-white">1</button>
        <button className="rounded-md border px-3 py-1 bg-blue-50 text-blue-600">2</button>
        <button className="rounded-md border px-3 py-1">Next</button>
      </div>
    </div>
  );
};

export default Pagination;
