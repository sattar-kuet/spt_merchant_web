"use client";

import React, { useEffect, useState } from "react";
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

// value = the real sale.order.delivery_state key the backend expects;
// label = friendly text shown to the merchant
const STATUS_OPTIONS = [
  { value: "created", label: "Parcel Created" },
  { value: "ready_for_pickup", label: "Ready for Pickup" },
  { value: "assigned_for_pickup", label: "Assigned for Pickup" },
  { value: "rejected_by_merchant", label: "Rejected by Merchant" },
  { value: "pickup_done", label: "Pickup Completed" },
  { value: "in_hub", label: "In Hub" },
  { value: "hub_transferring_delivery", label: "Transferring for Delivery" },
  { value: "hub_transferred_delivery", label: "Transferred for Delivery" },
  { value: "ready_for_delivery", label: "Ready for Delivery" },
  { value: "assigned_for_delivery", label: "Assigned for Delivery" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "return_to_hub_for_reschedule", label: "Return for Reschedule" },
  { value: "return_to_hub_for_rejection", label: "Rejected Returning Hub" },
  { value: "rejected_by_customer", label: "Rejected by Customer" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "hub_transferring_return", label: "Transferring for Return" },
  { value: "hub_transferred_return", label: "Transferred for Return" },
  { value: "returned_to_merchant", label: "Returned to Merchant" },
];

const FiltersBar: React.FC<FiltersBarProps> = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Debounce the search box so it doesn't fire a request on every keystroke;
  // status applies immediately since it's a discrete selection, not typing
  useEffect(() => {
    const id = setTimeout(() => {
      onFilterChange({ status: statusFilter, search: searchFilter || null });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter]);

  const handleStatusChange = (value: string) => {
    const nextStatus = value === "all" ? null : value;
    setStatusFilter(nextStatus);
    onFilterChange({ status: nextStatus, search: searchFilter || null });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setStatusFilter(null);
    setSearchFilter("");
    onFilterChange({ status: null, search: null });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 my-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="w-full md:w-64">
          <Input
            type="text"
            placeholder="Search by Order ID"
            value={searchFilter}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:flex lg:gap-3 lg:items-center w-full">
          <div className="w-full md:w-56">
            <Select
              value={statusFilter || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="default"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
