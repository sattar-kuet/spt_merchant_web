"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

const Pagination: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-4 text-sm text-slate-600">
      <div>Showing 1-5 of 100</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">Previous</Button>
        <Button variant="outline" size="sm" className="bg-white">
          1
        </Button>
        <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
          2
        </Button>
        <Button variant="outline" size="sm">Next</Button>
      </div>
    </div>
  );
};

export default Pagination;
