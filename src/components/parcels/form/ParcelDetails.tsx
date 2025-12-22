"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";

const ParcelDetails: React.FC<{
    weight: string;
    setWeight: (v: string) => void;
    parcelType: string;
    setParcelType: (v: string) => void;
    parcelTypes?: { id: number; name: string }[];
}> = ({ weight, setWeight, parcelType, setParcelType, parcelTypes }) => {
    return (
        <div className="mt-4 bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-medium">Parcel Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <label htmlFor="parcel-weight" className="text-sm">
                        Parcel Weight
                    </label>
                    <Input
                        id="parcel-weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="2.5"
                    />
                </div>
                <div>
                    <label htmlFor="parcel-type" className="text-sm">
                        Parcel Type
                    </label>
                    <Select value={parcelType} onValueChange={setParcelType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            {parcelTypes && parcelTypes.length > 0 ? (
                                parcelTypes.map((t) => (
                                    <SelectItem key={t.id} value={String(t.id)}>
                                        {t.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <>
                                    <SelectItem value="document">Document</SelectItem>
                                    <SelectItem value="parcel">Parcel</SelectItem>
                                    <SelectItem value="fragile">Fragile</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default ParcelDetails;
