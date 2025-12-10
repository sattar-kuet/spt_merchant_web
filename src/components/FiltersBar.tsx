"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

interface FiltersBarProps {
  onFilterChange: (filters: {
    status: string | null;
    search: string | null;
  }) => void;
}

// Map display names to the actual status values from API
const STATUS_OPTIONS = [
  { value: "Created", label: "Created" },
  { value: "Ready for Pickup", label: "Ready for Pickup" },
  { value: "Assigned for Pickup", label: "Assigned for Pickup" },
  { value: "Rejected by Merchant", label: "Rejected by Merchant" },
  { value: "Pickup Done", label: "Pickup Done" },
  { value: "In Hub", label: "In Hub" },
  { value: "Out for Delivery", label: "Out for Delivery" },
  { value: "Delivered", label: "Delivered" },
  { value: "Delivery Failed", label: "Delivery Failed" },
  { value: "Returned to Hub", label: "Returned to Hub" },
  { value: "Return Initiated", label: "Return Initiated" },
  { value: "Returned to Merchant", label: "Returned to Merchant" },
];

const FiltersBar: React.FC<FiltersBarProps> = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      status: statusFilter,
      search: searchFilter || null,
    }); // Debug log
    onFilterChange({ status: statusFilter, search: searchFilter || null });
  };

  const handleClearFilters = () => {
    console.log("Clearing filters"); // Debug log
    setStatusFilter(null);
    setSearchFilter("");
    onFilterChange({ status: null, search: null });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyFilters();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 my-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="w-full md:w-64">
          <Input
            type="text"
            placeholder="Search by Order ID or Address"
            value={searchFilter}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:flex lg:gap-3 lg:items-center w-full">
          <div className="w-full md:w-48">
            <Select
              value={statusFilter || ""}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="default"
              className="flex-1"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
            <Button
              variant="default"
              size="default"
              className="flex-1"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;