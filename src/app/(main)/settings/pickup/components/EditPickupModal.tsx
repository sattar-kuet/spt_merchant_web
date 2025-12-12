"use client";

import { useEffect, useState } from "react";
import useParcelOptions from "@/hooks/useParcelOptions";
import usePickupPointData from "@/hooks/usePickupPointData";
import usePickupPoint from "@/hooks/usePickupPoint";
import Swal from 'sweetalert2';

type Props = {
  open: boolean;
  onClose: () => void;
  id?: string | number | null;
};

export default function EditPickupModal({ open, onClose, id }: Props) {
  const { updatePickupPoint } = usePickupPointData();
  // only fetch the single point when modal is open and id is provided
  const singleQuery = usePickupPoint(open && id ? id : undefined);
  const [form, setForm] = useState({
    name: "",
    address: "",
    contact_name: "",
    phone: "",
    city_id: "",
    district_id: "",
    active: true,
  });
  // track whether user edited any field to avoid overwriting their input
  const [dirty, setDirty] = useState(false);

  // fetch districts and cities (cities depend on selected district)
  const { districts = [], cities = [] } = useParcelOptions(form.district_id as any);

  const loadingSingle = singleQuery.isLoading;

  // populate form when data loaded
  useEffect(() => {
    if (!open) return;
    if (!singleQuery.isSuccess) return;
    // don't overwrite if user already started editing
    if (dirty) return;
    const it = singleQuery.data;
    if (!it) return;
    setForm({
      name: it.name ?? it.title ?? it.label ?? "",
      address: it.address ?? it.details ?? it.location?.address ?? "",
      contact_name: it.contact_name ?? it.contactName ?? it.contact ?? "",
      phone: it.phone ?? it.mobile ?? "",
      city_id: String(it.city_id ?? it.cityId ?? it.city?.id ?? it.city?._id ?? it.city?.city_id ?? ""),
      district_id: String(it.district_id ?? it.districtId ?? it.district?.id ?? it.district?._id ?? it.district?.district_id ?? ""),
      active: typeof it.active === "boolean" ? it.active : it.active === undefined ? true : Boolean(it.active),
    });
  }, [open, singleQuery.isSuccess, singleQuery.data]);

  // reset dirty when modal is opened
  useEffect(() => {
    if (open) setDirty(false);
  }, [open]);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    // mark as edited
    setDirty(true);
    // handle checkbox separately
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((s) => ({ ...s, [name]: (target as HTMLInputElement).checked }));
      return;
    }

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
    // ensure API accepts contact_person key as well (some backends expect this)
    const sendPayload = {
      ...payload,
      contact_person: (payload as any).contact_name ?? (payload as any).contact_person,
      active: (payload as any).active !== undefined ? (payload as any).active : true,
    };

    updatePickupPoint.mutate(
      { id, payload: sendPayload },
      {
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Saved',
            text: 'Pickup point updated successfully',
            toast: true,
            position: 'top-end',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => onClose());
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.error("EditPickupModal: update failed:", err);
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: err?.message || 'Failed to update pickup point',
          });
        },
      }
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-5 z-10">
        <h3 className="text-lg font-semibold">Edit Pick Up Point</h3>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm text-slate-600">Name</label>
            <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" required disabled={loadingSingle} />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Address</label>
            <input name="address" value={form.address} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" required disabled={loadingSingle} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600">Contact Name</label>
              <input name="contact_name" value={form.contact_name} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" disabled={loadingSingle} />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" disabled={loadingSingle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600">District</label>
              <select name="district_id" value={form.district_id} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" disabled={loadingSingle}>
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
              <select name="city_id" value={form.city_id} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" disabled={loadingSingle || !form.district_id}>
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
            <button type="submit" disabled={updatePickupPoint.isPending || loadingSingle} className="px-4 py-2 rounded bg-indigo-600 text-white text-sm">
              {loadingSingle ? "Loading..." : updatePickupPoint.isPending ? "Saving..." : "Save"}
            </button>
          </div>

          {updatePickupPoint.isError && <p className="text-sm text-red-600">Failed to save. Try again.</p>}
        </form>
      </div>
    </div>
  );
}
