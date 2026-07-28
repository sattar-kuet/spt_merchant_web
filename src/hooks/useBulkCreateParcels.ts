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
        // Surface the real per-row reason(s) instead of a generic message, so
        // the merchant knows exactly what to fix instead of just "it failed"
        const failedResults = Array.isArray(data.results)
          ? data.results.filter((r: any) => r && r.success === false)
          : [];
        if (failedResults.length > 0) {
          const reasons = failedResults
            .slice(0, 5)
            .map((r: any) => `Row ${(r.index ?? 0) + 1}: ${r.message || r.error || "Unknown error"}`)
            .join("\n");
          const more =
            failedResults.length > 5 ? `\n...and ${failedResults.length - 5} more.` : "";
          const createdNote =
            typeof data.created === "number" && data.created > 0
              ? ` (${data.created} of ${data.total} were created successfully.)`
              : "";
          throw new Error(`${data.failed || failedResults.length} parcel(s) failed:${createdNote}\n${reasons}${more}`);
        }
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
