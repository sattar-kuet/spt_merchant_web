"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalOrders,
  onPageChange,
}) => {
  // Calculate the range of orders being displayed
  const ordersPerPage = 10; // Assuming 10 orders per page
  const startOrder = (currentPage - 1) * ordersPerPage + 1;
  const endOrder = Math.min(currentPage * ordersPerPage, totalOrders);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generate page numbers to display (show up to 5 pages around current page)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between py-4 text-sm text-slate-600 gap-4">
      <div className="text-center sm:text-left">
        Showing {startOrder}-{endOrder} of {totalOrders}
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant="outline"
            size="sm"
            className={
              page === currentPage ? "bg-blue-50 text-blue-600" : "bg-white"
            }
            onClick={() => handlePageClick(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;