"use client";

import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateParcel() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const resp = await axiosSecure.post(`/orders`, payload);
      const data = resp.data;
      // treat non-success responses as errors so callers only receive onSuccess when created
      if (data && typeof data === "object" && data.success === false) {
        // Prefer the detailed server-side error over the generic message, so
        // the merchant sees the real reason instead of just "it failed"
        throw new Error(data.error || data.message || "Failed to create parcel");
      }
      return data;
    },
    onSuccess: (data) => {
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
