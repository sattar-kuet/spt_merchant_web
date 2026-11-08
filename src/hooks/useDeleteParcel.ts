"use client";

import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteParcel(orderId: string) {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const resp = await axiosSecure.post(`/orders/${orderId}/delete`, {});
            const data = resp.data;
            if (data && typeof data === "object" && data.success === false) {
                throw new Error(data.message || "Failed to delete parcel");
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.removeQueries({ queryKey: ["order", orderId] });
        },
    });
}
