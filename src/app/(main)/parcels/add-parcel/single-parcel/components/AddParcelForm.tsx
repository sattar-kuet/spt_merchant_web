"use client";

import React from "react";
import useCreateParcel from "@/hooks/useCreateParcel";
import { useRouter } from 'next/navigation';
import ParcelForm from "@/components/parcels/ParcelForm";
import Swal from 'sweetalert2';

const AddParcelForm: React.FC = () => {
  const router = useRouter();
  const createParcel = useCreateParcel();

  const handleCreate = (payload: any) => {
    createParcel.mutate(payload, {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Created',
          text: 'Parcel created successfully',
          toast: true,
          position: 'top-end',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          router.push('/parcels');
        });
      },
      onError: (err) => {
        console.error('Create parcel failed', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.message || 'Failed to create parcel'
        });
      },
    });
  };

  return (
    <ParcelForm
      title="Add New Parcel"
      onSubmit={handleCreate}
      isPending={createParcel.isPending}
      submitLabel="Create Parcel"
      onCancel={() => router.push('/parcels')}
    />
  );
};

export default AddParcelForm;