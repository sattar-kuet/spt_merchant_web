"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

const FiltersBar: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 my-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:flex lg:gap-3 lg:items-center w-full">
          <div className="w-full md:w-48">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                <SelectItem value="Assigned for Delivery">Assigned for Delivery</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Delivery Failed">Delivery Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mt-3 sm:mt-0">
            <Button variant="outline" size="default" className="flex-1">
              Clear
            </Button>
            <Button variant="default" size="default" className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;