"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import useParcelOptions from "@/hooks/useParcelOptions";
import useParcelDefaults from "@/hooks/useParcelDefaults";
import Swal from "sweetalert2";

const DefaultConfigurationPage = () => {
  const { parcelTypes, deliverySpeeds, pickupPoints } = useParcelOptions("");
  const { defaults, save } = useParcelDefaults();
  const [parcelType, setParcelType] = useState("");
  const [deliverySpeed, setDeliverySpeed] = useState("");
  const [weight, setWeight] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");

  useEffect(() => {
    if (!defaults) return;
    setParcelType(defaults.parcel_type_id);
    setDeliverySpeed(defaults.delivery_speed_id);
    setWeight(defaults.weight);
    setPickupPoint(defaults.pickup_point_id);
  }, [defaults]);

  const handleSave = () => {
    save.mutate(
      { parcel_type_id: parcelType, delivery_speed_id: deliverySpeed, weight, pickup_point_id: pickupPoint },
      {
        onSuccess: () =>
          Swal.fire({
            icon: "success",
            title: "Saved",
            text: "Default configuration saved",
            toast: true,
            position: "top-end",
            timer: 1500,
            showConfirmButton: false,
          }),
        onError: (err) =>
          Swal.fire({ icon: "error", title: "Failed", text: err?.message || "Failed to save" }),
      }
    );
  };

  return (
    <div className="p-4 sm:p-5 w-full">
      <p className="text-xl sm:text-2xl font-semibold">Default Configuration</p>
      <p className="text-sm text-slate-500 mt-1">
        These values are pre-filled when you create a new parcel.
      </p>

      <div className="mt-4 sm:mt-6 rounded-lg border border-slate-200 bg-white p-4 sm:p-6 max-w-xl space-y-4">
        <div>
          <label className="text-sm">Default Pickup Point</label>
          <Select value={pickupPoint} onValueChange={setPickupPoint}>
            <SelectTrigger>
              <SelectValue placeholder="Select a pickup point" />
            </SelectTrigger>
            <SelectContent>
              {(pickupPoints || []).map((p: { id: number; name: string }) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm">Default Parcel Type</label>
          <Select value={parcelType} onValueChange={setParcelType}>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {(parcelTypes || []).map((t: { id: number; name: string }) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm">Default Delivery Speed</label>
          <Select value={deliverySpeed} onValueChange={setDeliverySpeed}>
            <SelectTrigger>
              <SelectValue placeholder="Select a speed" />
            </SelectTrigger>
            <SelectContent>
              {(deliverySpeeds || []).map((s: { id: number; name: string }) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="default-weight" className="text-sm">
            Default Parcel Weight
          </label>
          <Input
            id="default-weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="2.5"
          />
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" disabled={save.isPending} onClick={handleSave}>
            {save.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DefaultConfigurationPage;
