"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

const FiltersBar: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 my-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="w-full md:w-64">
          <Button
            variant="outline"
            size="default"
            className="w-full text-left justify-start"
          >
            Oct 5, 2023 - Nov 7, 2023
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:flex lg:gap-3 lg:items-center w-full">
          <div className="w-full md:w-48">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Delivery State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48 mt-3 sm:mt-0">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48 mt-3 sm:mt-0">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="COD Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="collected">Collected</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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