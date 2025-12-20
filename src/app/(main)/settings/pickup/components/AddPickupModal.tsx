"use client";

import { useEffect, useState } from "react";
import useParcelOptions from "@/hooks/useParcelOptions";
import usePickupPointData from "@/hooks/usePickupPointData";
import Swal from 'sweetalert2';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddPickupModal({ open, onClose }: Props) {
  const { createPickupPoint } = usePickupPointData();

  const [form, setForm] = useState({
    name: "",
    address: "",
    contact_name: "",
    phone: "",
    city_id: "",
    district_id: "",
  });

  // fetch districts and cities (cities depend on selected district)
  const { districts = [], cities = [] } = useParcelOptions(form.district_id as any);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === "district_id") {
      setForm((s) => ({ ...s, district_id: value, city_id: "" }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      city_id: form.city_id ? Number(form.city_id) : undefined,
      district_id: form.district_id ? Number(form.district_id) : undefined,
    };
    const sendPayload = {
      ...payload,
      contact_person: (payload as any).contact_name ?? (payload as any).contact_person,
      active: (payload as any).active !== undefined ? (payload as any).active : true,
    };

    createPickupPoint.mutate(sendPayload, {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Created',
          text: 'Pickup point created successfully',
          toast: true,
          position: 'top-end',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => onClose());
      },
      onError: (err: any) => {
        // eslint-disable-next-line no-console
        console.error('AddPickupModal: create failed', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.message || 'Failed to create pickup point',
        });
      },
    });
  }

  useEffect(() => {
    if (!open) return;
    // clear when opening for create
    setForm({ name: "", address: "", contact_name: "", phone: "", city_id: "", district_id: "" });
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-5 z-10">
        <h3 className="text-lg font-semibold">Add Pick Up Point</h3>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm text-slate-600">Name</label>
            <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Address</label>
            <input name="address" value={form.address} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600">Contact Name</label>
              <input name="contact_name" value={form.contact_name} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600">District</label>
              <select name="district_id" value={form.district_id} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2">
                <option value="">Select district</option>
                {districts.map((d: any) => {
                  const id = d.id ?? d.district_id ?? d._id ?? d.value;
                  const label = d.name ?? d.title ?? d.district_name ?? d.label ?? String(id);
                  return (
                    <option key={id} value={String(id)}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600">City</label>
              <select name="city_id" value={form.city_id} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" disabled={!form.district_id}>
                <option value="">Select city</option>
                {cities.map((c: any) => {
                  const id = c.id ?? c.city_id ?? c._id ?? c.value;
                  const label = c.name ?? c.title ?? c.city_name ?? c.label ?? String(id);
                  return (
                    <option key={id} value={String(id)}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
            <div className="flex items-center justify-end gap-2 mt-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-slate-100 text-sm">Cancel</button>
              <button type="submit" disabled={createPickupPoint.isPending} className="px-4 py-2 rounded bg-secondary text-white text-sm hover:bg-secondary/90 transition-colors">
                {createPickupPoint.isPending ? "Creating..." : "Create"}
              </button>
            </div>

            {createPickupPoint.isError && <p className="text-sm text-red-600">Failed to create. Try again.</p>}
          </form>
        </div>
      </div>
  );
}
