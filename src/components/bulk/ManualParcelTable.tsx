"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import PickupPointCarousel from "@/components/parcels/form/PickupPointCarousel";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useParcelOptions from "@/hooks/useParcelOptions";
import useParcelDefaults from "@/hooks/useParcelDefaults";
import useBulkCreateParcels from "@/hooks/useBulkCreateParcels";
import { buildOrdersFromRows, RowError, TEMPLATE_HEADERS } from "@/lib/bulkParcels";

interface Row {
  name: string;
  phone: string;
  districtId: string;
  cityId: string;
  address: string;
  parcelTypeId: string;
  weight: string;
  cod: string;
  reference: string;
  exchange: boolean;
  remarks: string;
}

interface Option {
  id: number;
  name: string;
}

const emptyRow = (parcelTypeId = "", weight = ""): Row => ({
  name: "",
  phone: "",
  districtId: "",
  cityId: "",
  address: "",
  parcelTypeId,
  weight,
  cod: "",
  reference: "",
  exchange: false,
  remarks: "",
});

const inputClass =
  "w-full min-w-0 rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:border-primary bg-white";

const nameOf = (list: Option[] | undefined, id: string) =>
  list?.find((o) => String(o.id) === id)?.name ?? "";

export default function ManualParcelTable() {
  const axiosSecure = useAxiosSecure();
  const bulkCreate = useBulkCreateParcels();
  const { defaults } = useParcelDefaults();
  const { parcelTypes, districts, pickupPoints, deliverySpeeds } = useParcelOptions();

  const [pickupPointId, setPickupPointId] = useState("");
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [citiesByDistrict, setCitiesByDistrict] = useState<Record<string, Option[]>>({});

  // Prefill the merchant's saved defaults (pickup point, parcel type, weight)
  useEffect(() => {
    if (!defaults) return;
    if (defaults.pickup_point_id) setPickupPointId((p) => p || defaults.pickup_point_id);
    setRows((prev) =>
      prev.length === 1 && !prev[0].parcelTypeId && !prev[0].weight
        ? [emptyRow(defaults.parcel_type_id, defaults.weight)]
        : prev
    );
  }, [defaults]);

  useEffect(() => {
    if (!pickupPointId && pickupPoints?.length) setPickupPointId(String(pickupPoints[0].id));
  }, [pickupPoints, pickupPointId]);

  const loadCities = async (districtId: string) => {
    if (!districtId || citiesByDistrict[districtId]) return;
    const resp = await axiosSecure.get("/locations/cities", { params: { district_id: districtId } });
    const payload = resp.data;
    const list = Array.isArray(payload) ? payload : payload?.data ?? payload?.cities ?? [];
    setCitiesByDistrict((prev) => ({ ...prev, [districtId]: list }));
  };

  const update = (index: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const addRow = () =>
    setRows((prev) => {
      const last = prev[prev.length - 1];
      return [...prev, emptyRow(last?.parcelTypeId, last?.weight)];
    });

  const removeRow = (index: number) =>
    setRows((prev) => (prev.length === 1 ? [emptyRow()] : prev.filter((_, i) => i !== index)));

  const showRowErrors = (errors: RowError[]) => {
    const items = errors
      .slice(0, 10)
      .map((e) => `<li><b>Row ${e.row}:</b> ${e.message}</li>`)
      .join("");
    Swal.fire({
      icon: "error",
      title: "Invalid Parcel Data",
      html: `<ul style="text-align:left">${items}</ul><p>Fix these rows and try again. No parcels were submitted.</p>`,
    });
  };

  const handleSave = async () => {
    try {
      const speed =
        nameOf(deliverySpeeds, defaults?.delivery_speed_id || "") ||
        deliverySpeeds?.find((s: Option) => s.name.toLowerCase() === "regular")?.name ||
        deliverySpeeds?.[0]?.name ||
        "";
      const pickupName = nameOf(pickupPoints, pickupPointId);

      const sheetRows = rows.map((r) => ({
        [TEMPLATE_HEADERS.customerName]: r.name,
        [TEMPLATE_HEADERS.customerPhone]: r.phone,
        [TEMPLATE_HEADERS.customerAddress]: r.address,
        [TEMPLATE_HEADERS.district]: nameOf(districts, r.districtId),
        [TEMPLATE_HEADERS.city]: nameOf(citiesByDistrict[r.districtId], r.cityId),
        [TEMPLATE_HEADERS.pickupPoint]: pickupName,
        [TEMPLATE_HEADERS.weight]: r.weight,
        [TEMPLATE_HEADERS.parcelType]: nameOf(parcelTypes, r.parcelTypeId),
        [TEMPLATE_HEADERS.deliverySpeed]: speed,
        [TEMPLATE_HEADERS.codAmount]: r.cod,
        [TEMPLATE_HEADERS.merchantReference]: r.reference,
        [TEMPLATE_HEADERS.exchange]: r.exchange ? "yes" : "",
        [TEMPLATE_HEADERS.remarks]: r.remarks,
      }));

      // Row numbers shown to the user match the table (first row = 1)
      const { orders, errors } = await buildOrdersFromRows(sheetRows, axiosSecure, 1);
      if (errors.length > 0) {
        showRowErrors(errors);
        return;
      }
      if (orders.length === 0) {
        Swal.fire({ icon: "info", title: "No Data", text: "Fill in at least one parcel first." });
        return;
      }

      await bulkCreate.mutateAsync({ orders });
      Swal.fire({
        icon: "success",
        title: "Parcels Added",
        text: `${orders.length} parcel(s) have been added successfully.`,
      });
      setRows([emptyRow(defaults?.parcel_type_id, defaults?.weight)]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add parcels.";
      Swal.fire({
        icon: "error",
        title: "Error",
        html: message.split("\n").map((line) => line || "&nbsp;").join("<br/>"),
      });
    }
  };

  return (
    <div className="w-full">
      <PickupPointCarousel
        pickupPoints={pickupPoints}
        selected={pickupPointId}
        onSelect={setPickupPointId}
      />

      <div className="mt-4">
        <table className="w-full table-fixed text-left">
          <colgroup>
            {[3, 9, 9, 9, 8, 9, 13, 8, 6, 7, 6, 10, 3].map((w, i) => (
              <col key={i} style={{ width: `${w}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="text-xs text-slate-500 uppercase">
              {["#", "Merchant Reference", "Name", "Phone", "District", "Area", "Address", "Parcel Type", "Weight (kg)", "Amount (COD)", "Exchange", "Remarks (optional)", ""].map(
                (h) => (
                  <th key={h} className="px-1.5 py-2 font-medium">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="align-top">
                <td className="px-1.5 py-1.5 text-sm text-slate-500">{i + 1}</td>
                <td className="px-1.5 py-1.5">
                  <input className={inputClass} value={r.reference} onChange={(e) => update(i, { reference: e.target.value })} />
                </td>
                <td className="px-1.5 py-1.5">
                  <input className={inputClass} value={r.name} onChange={(e) => update(i, { name: e.target.value })} />
                </td>
                <td className="px-1.5 py-1.5">
                  <input className={inputClass} value={r.phone} onChange={(e) => update(i, { phone: e.target.value })} />
                </td>
                <td className="px-1.5 py-1.5">
                  <select
                    className={inputClass}
                    value={r.districtId}
                    onChange={(e) => {
                      update(i, { districtId: e.target.value, cityId: "" });
                      loadCities(e.target.value);
                    }}
                  >
                    <option value="">Select</option>
                    {districts?.map((d: Option) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-1.5 py-1.5">
                  <select
                    className={inputClass}
                    value={r.cityId}
                    disabled={!r.districtId}
                    onChange={(e) => update(i, { cityId: e.target.value })}
                  >
                    <option value="">Select</option>
                    {citiesByDistrict[r.districtId]?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-1.5 py-1.5">
                  <input className={`${inputClass}`} value={r.address} onChange={(e) => update(i, { address: e.target.value })} />
                </td>
                <td className="px-1.5 py-1.5">
                  <select className={inputClass} value={r.parcelTypeId} onChange={(e) => update(i, { parcelTypeId: e.target.value })}>
                    <option value="">Select</option>
                    {parcelTypes?.map((t: Option) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-1.5 py-1.5">
                  <input className={`${inputClass}`} type="number" min="0" step="0.1" value={r.weight} onChange={(e) => update(i, { weight: e.target.value })} />
                </td>
                <td className="px-1.5 py-1.5">
                  <input className={`${inputClass}`} type="number" min="0" value={r.cod} onChange={(e) => update(i, { cod: e.target.value })} />
                </td>
                <td className="px-1.5 py-1.5 text-center">
                  <input type="checkbox" aria-label="Exchange" className="h-4 w-4 mt-2 cursor-pointer" checked={r.exchange} onChange={(e) => update(i, { exchange: e.target.checked })} />
                </td>
                <td className="px-1.5 py-1.5">
                  <input className={inputClass} placeholder="Optional" value={r.remarks} onChange={(e) => update(i, { remarks: e.target.value })} />
                </td>
                <td className="px-1.5 py-1.5">
                  <button
                    type="button"
                    aria-label="Remove row"
                    onClick={() => removeRow(i)}
                    className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <FaTrash size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" type="button" onClick={addRow}>
          <FaPlus size={11} className="mr-2" /> Add Row
        </Button>
        <Button variant="default" type="button" onClick={handleSave} disabled={bulkCreate.isPending}>
          {bulkCreate.isPending ? "Saving..." : `Save ${rows.length} Parcel${rows.length > 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  );
}
