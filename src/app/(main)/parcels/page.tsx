"use client";

import { useState } from "react";
import OrdersHeader from "./components/OrdersHeader";
import FiltersBar from "@/components/FiltersBar";
import OrdersTable from "./components/OrdersTable";
import Pagination from "./components/Pagination";
import { useOrdersData } from "@/hooks/useOrdersData";

const OrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    status: string | null;
    search: string | null;
  }>({ status: null, search: null });
  console.log("Current filters:", filters); // Debug log
  const { orders, loading, error, pagination } = useOrdersData(
    currentPage,
    10,
    filters
  );
  console.log("Received orders:", orders); // Debug log

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: {
    status: string | null;
    search: string | null;
  }) => {
    console.log("Filters changed to:", newFilters); // Debug log
    setFilters(newFilters);
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Show pagination if we have pagination data and either:
  // 1. Total pages > 1, OR
  // 2. We have orders (assuming API might not return pagination data but we still want to show pagination controls)
  const shouldShowPagination =
    pagination && (pagination.total_pages > 1 || orders.length > 0);

  return (
    <div className="p-4 sm:p-5 w-full">
      <OrdersHeader />
      <div className="mt-2">
        <FiltersBar onFilterChange={handleFilterChange} />
        <div className="mt-4">
          <OrdersTable orders={orders} loading={loading} error={error} />
          {shouldShowPagination && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              totalOrders={pagination.total_orders}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;