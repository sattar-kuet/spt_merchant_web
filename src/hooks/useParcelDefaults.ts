"use client";

import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ParcelDefaults {
  parcel_type_id: string;
  delivery_speed_id: string;
  weight: string;
  pickup_point_id: string;
}

const EMPTY: ParcelDefaults = { parcel_type_id: "", delivery_speed_id: "", weight: "", pickup_point_id: "" };

// Per-merchant defaults, stored on the server against the logged-in account.
export default function useParcelDefaults() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["parcel-defaults"],
    queryFn: async (): Promise<ParcelDefaults> => {
      const resp = await axiosSecure.get("/parcel-defaults");
      return { ...EMPTY, ...(resp.data?.data || {}) };
    },
  });

  const save = useMutation({
    mutationFn: async (d: ParcelDefaults) => {
      const resp = await axiosSecure.put("/parcel-defaults", d);
      if (resp.data?.success === false) throw new Error(resp.data.message);
      return resp.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parcel-defaults"] }),
  });

  return { defaults: query.data, isLoading: query.isLoading, save };
}
