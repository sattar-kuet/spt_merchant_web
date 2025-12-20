"use client";
import usePickupPointData from "@/hooks/usePickupPointData";
import { FiEdit, FiPlus } from "react-icons/fi";
import { useState } from "react";
import AddPickupModal from "./components/AddPickupModal";
import EditPickupModal from "./components/EditPickupModal";
import { Button } from "@/components/ui/Button";

function getTitle(point: any) {
  return point?.name || point?.title || point?.label || "Unnamed Point";
}

function getAddress(point: any) {
  // Try a few common field names
  if (!point) return "";
  if (point.address) return point.address;
  if (point.details) return point.details;
  const parts: string[] = [];
  if (point.area) parts.push(point.area);
  if (point.city) parts.push(point.city);
  if (point.district) parts.push(point.district);
  if (point.zone) parts.push(point.zone);
  if (point.group) parts.push(point.group);
  return parts.filter(Boolean).join(", ") || "Address not provided";
}

function getCityName(point: any) {
  if (!point) return null;
  return (
    point.city ||
    point.city_name ||
    (point.city && (point.city.name || point.city.title)) ||
    (point.location && (point.location.city || point.location.city_name)) ||
    null
  );
}

function getDistrictName(point: any) {
  if (!point) return null;
  return (
    point.district ||
    point.district_name ||
    point.area ||
    (point.district && (point.district.name || point.district.title)) ||
    (point.location && (point.location.district || point.location.district_name)) ||
    null
  );
}

const PickupPointsPage = () => {
  const { pickupPoints, pickupPointsQuery } = usePickupPointData();

  const loading = pickupPointsQuery.isLoading;
    const points = pickupPoints || [];
    const [openAdd, setOpenAdd] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState<string | number | null>(null);

  return (
    <div className="p-4 sm:p-6 w-full">
      <div>
        <p className="text-xl sm:text-2xl font-semibold">Pick Up Points</p>
        <p className="text-sm text-slate-500 mt-1">
          Manage pick up points for parcel collection.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {loading && (
          <div className="space-y-3">
            <div className="h-20 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-20 rounded-lg bg-slate-100 animate-pulse" />
          </div>
        )}

        {!loading && points.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="text-sm text-slate-600">No pick up points found.</p>
            <div className="mt-4">
              <button
                onClick={() => setOpenAdd(true)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-primary hover:bg-primary/5"
              >
                <FiPlus /> Add New Address
              </button>
            </div>
          </div>
        )}

        {!loading && points.length > 0 && (
          <div className="space-y-3">
            {points.map((p: any) => (
              <div
                key={p.id || p._id || getTitle(p)}
                className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="font-semibold text-slate-800">{getTitle(p)}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {getAddress(p)}
                    <span className="text-xs text-slate-400 ml-2">
                      {getCityName(p) ? `${getCityName(p)}` : ""}
                      {getCityName(p) && getDistrictName(p) ? ", " : ""}
                      {getDistrictName(p) ? `${getDistrictName(p)}` : ""}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const id = p.id ?? p._id ?? null;
                      setEditId(id);
                      // open the modal on next tick so modal receives editId prop
                       setTimeout(() => setEditOpen(true), 0);
                    }}
                    className="text-slate-400 hover:text-slate-600"
                    aria-label={`Edit ${getTitle(p)}`}
                  >
                    <FiEdit />
                  </button>
                </div>
              </div>
            ))}

            {/* Always show Add New Address dashed box like the attachment */}
            <Button
              onClick={() => {
                setEditId(null);
                setOpenAdd(true);
              }}
              className="w-full"
              variant="outline"
            >
              <div className="inline-flex py-2 items-center gap-2 text-primary text-sm font-medium">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                  <FiPlus />
                </span>
                Add New Address
              </div>
            </Button>
          </div>
        )}
      </div>
      <AddPickupModal open={openAdd} onClose={() => setOpenAdd(false)} />
      <EditPickupModal open={editOpen} onClose={() => setEditOpen(false)} id={editId as any} />
    </div>
  );
};

export default PickupPointsPage;
