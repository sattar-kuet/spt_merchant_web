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
import { loadParcelDefaults, saveParcelDefaults } from "@/hooks/useParcelDefaults";
import Swal from "sweetalert2";

const DefaultConfigurationPage = () => {
  const { parcelTypes, deliverySpeeds } = useParcelOptions("");
  const [parcelType, setParcelType] = useState("");
  const [deliverySpeed, setDeliverySpeed] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const d = loadParcelDefaults();
    setParcelType(d.parcelType);
    setDeliverySpeed(d.deliverySpeed);
    setWeight(d.weight);
  }, []);

  const handleSave = () => {
    saveParcelDefaults({ parcelType, deliverySpeed, weight });
    Swal.fire({
      icon: "success",
      title: "Saved",
      text: "Default configuration saved",
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="p-4 sm:p-5 w-full">
      <p className="text-xl sm:text-2xl font-semibold">Default Configuration</p>
      <p className="text-sm text-slate-500 mt-1">
        These values are pre-filled when you create a new parcel.
      </p>

      <div className="mt-4 sm:mt-6 rounded-lg border border-slate-200 bg-white p-4 sm:p-6 max-w-xl space-y-4">
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
          <Button variant="secondary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DefaultConfigurationPage;
