"use client";

import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BulkOrder } from "@/lib/bulkParcels";

export default function useBulkCreateParcels() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: { orders: BulkOrder[] }) => {
      let resp;
      try {
        resp = await axiosSecure.post(`/orders/bulk`, payload);
      } catch (err: any) {
        // surface the server's validation message instead of the generic axios error
        const serverMessage =
          err?.response?.data?.message || err?.response?.data?.error;
        throw new Error(serverMessage || err?.message || "Failed to create parcels");
      }
      const data = resp.data;
      // treat non-success responses as errors so callers only receive onSuccess when created
      if (data && typeof data === "object" && data.success === false) {
        throw new Error(data.message || "Failed to create parcels");
      }
      return data;
    },
    onSuccess: () => {
      // invalidate orders list so UI updates
      try {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      } catch (e) {
        // ignore
      }
    },
  });

  return mutation;
}
