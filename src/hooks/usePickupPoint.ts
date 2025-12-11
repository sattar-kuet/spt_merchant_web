"use client";

import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

export default function usePickupPoint(id?: string | number | null) {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["pickup-point", id],
    queryFn: async () => {
      const resp = await axiosSecure.get(`/pickup-points/${id}`);
      const payload = resp.data;
      // prefer common wrappers if present (data, pickup_point)
      return payload?.data ?? payload?.pickup_point ?? payload;
    },
    enabled: !!id,
  });
}
