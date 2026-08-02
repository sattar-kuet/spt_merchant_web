"use client";

import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export interface TransactionBill {
  id: number;
  name: string;
  amount: number;
  date: string | null;
}

interface TransactionsResponse {
  success: boolean;
  total_count: number;
  bills: TransactionBill[];
  pagination: {
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

export interface TransactionCharge {
  id: number;
  name: string;
  amount: number;
}

export interface TransactionParcelBreakdown {
  parcel: { id: number; name: string };
  cod_collected: number;
  charges: TransactionCharge[];
  total_charges: number;
  net_amount: number;
}

interface TransactionDetailsResponse {
  success: boolean;
  bill: {
    id: number;
    name: string;
    cod_collected: number;
    charge: number;
    net_amount: number;
    adjustment: number;
    notes: string[];
    date: string | null;
    state: string;
  };
  detailed_breakdown: TransactionParcelBreakdown[];
}

export const useTransactionsData = (page: number = 1, limit: number = 10) => {
  const { isAuthenticated } = useAuth();
  const axiosSecure = useAxiosSecure();
  const offset = (page - 1) * limit;

  const fetchTransactions = async (): Promise<TransactionsResponse> => {
    const response = await axiosSecure.get("/transactions", {
      params: { limit, offset },
    });
    if (!response.data.success) throw new Error("Failed to fetch paid invoices");
    return response.data;
  };

  const transactionsQuery = useQuery({
    queryKey: ["transactions", page, limit],
    queryFn: fetchTransactions,
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  return {
    bills: transactionsQuery.data?.bills ?? [],
    hasMore: transactionsQuery.data?.pagination?.has_more ?? false,
    loading: transactionsQuery.isPending,
    error: transactionsQuery.error ? (transactionsQuery.error as Error).message : null,
  };
};

export const useTransactionDetails = (billId: number | null) => {
  const { isAuthenticated } = useAuth();
  const axiosSecure = useAxiosSecure();

  const fetchDetails = async (): Promise<TransactionDetailsResponse> => {
    const response = await axiosSecure.get(`/transactions/${billId}/details`);
    if (!response.data.success) throw new Error("Failed to fetch invoice details");
    return response.data;
  };

  const detailsQuery = useQuery({
    queryKey: ["transaction-details", billId],
    queryFn: fetchDetails,
    enabled: isAuthenticated && billId != null,
    staleTime: 1000 * 60,
  });

  return {
    bill: detailsQuery.data?.bill ?? null,
    breakdown: detailsQuery.data?.detailed_breakdown ?? [],
    loading: detailsQuery.isFetching,
    error: detailsQuery.error ? (detailsQuery.error as Error).message : null,
  };
};
