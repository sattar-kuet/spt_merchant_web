"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrderData } from "@/hooks/useOrderData";
import useUpdateParcel from "@/hooks/useUpdateParcel";
import ParcelForm from "@/components/parcels/ParcelForm";
import Swal from "sweetalert2";

const EditParcelPage = () => {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const { data: order, isLoading, isError, error } = useOrderData(id);
    const updateParcel = useUpdateParcel(id);

    const handleUpdate = (payload: any) => {
        updateParcel.mutate(payload, {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Updated",
                    text: "Parcel updated successfully",
                    toast: true,
                    position: "top-end",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    router.push(`/parcels/${id}`);
                });
            },
            onError: (err: any) => {
                console.error("Update parcel failed", err);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: err?.message || "Failed to update parcel",
                });
            },
        });
    };

    if (isLoading) {
        return (
            <div className="p-5 w-full flex justify-center items-center h-64">
                <div>Loading order details...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-5 w-full flex justify-center items-center h-64">
                <div className="text-red-500">
                    Error loading order: {error instanceof Error ? error.message : "Unknown error"}
                </div>
            </div>
        );
    }

    return (
        <ParcelForm
            title={`Edit Order: ${order?.name}`}
            initialData={order}
            onSubmit={handleUpdate}
            isPending={updateParcel.isPending}
            submitLabel="Update Parcel"
            onCancel={() => router.push(`/parcels/${id}`)}
        />
    );
};

export default EditParcelPage;
