"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

const CustomerInformation: React.FC<{
  fullName: string;
  setFullName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  districts?: { id: number; name: string }[];
  cities?: { id: number; name: string }[];
  selectedDistrict?: string;
  setSelectedDistrict?: (v: string) => void;
  selectedCity?: string;
  setSelectedCity?: (v: string) => void;
}> = ({ fullName, setFullName, phone, setPhone, address, setAddress, districts, cities, selectedDistrict, setSelectedDistrict, selectedCity, setSelectedCity }) => {
  return (
    <div className="space-y-4 bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-medium">Customer Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter customer's full name"
        />
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter full address"
          className="md:col-span-2"
        />

        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}> 
          <SelectTrigger>
            <SelectValue placeholder="Select a district" />
          </SelectTrigger>
          <SelectContent>
            {districts && districts.length > 0 ? (
              districts.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
              ))
            ) : (
              <SelectItem value="-1" disabled>No districts</SelectItem>
            )}
          </SelectContent>
        </Select>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {cities && cities.length > 0 ? (
              cities.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))
            ) : (
              <SelectItem value="-1" disabled>No cities</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CustomerInformation;
