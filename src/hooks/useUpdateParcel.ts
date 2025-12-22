"use client";

import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateParcel(orderId: string) {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            const resp = await axiosSecure.patch(`/orders/${orderId}`, payload);
            const data = resp.data;
            if (data && typeof data === "object" && data.success === false) {
                throw new Error(data.message || "Failed to update parcel");
            }
            return data;
        },
        onSuccess: (data) => {
            try {
                queryClient.invalidateQueries({ queryKey: ["orders"] });
                queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            } catch (e) {
                // ignore
            }
        },
    });

    return mutation;
}
