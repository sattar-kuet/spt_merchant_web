"use client";

import React, { useState, useEffect } from "react";
import ParcelFormHeader from "./form/ParcelFormHeader";
import CustomerInformation from "./form/CustomerInformation";
import ParcelDetails from "./form/ParcelDetails";
import FinancialInfo from "./form/FinancialInfo";
import FeeCalculator from "@/components/FeeCalculator";
import useParcelOptions from "@/hooks/useParcelOptions";
import { Button } from "@/components/ui/Button";

interface ParcelFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    isPending: boolean;
    title: string;
    submitLabel: string;
    onCancel: () => void;
}

const ParcelForm: React.FC<ParcelFormProps> = ({
    initialData,
    onSubmit,
    isPending,
    title,
    submitLabel,
    onCancel,
}) => {
    const [fullName, setFullName] = useState(initialData?.customer_name || "");
    const [phone, setPhone] = useState(initialData?.customer_phone || "");
    const [address, setAddress] = useState(initialData?.customer_address || "");
    const [weight, setWeight] = useState(initialData?.total_weight?.toString() || "");
    const [parcelType, setParcelType] = useState(initialData?.parcel_type_id?.toString() || "");
    const [codAmount, setCodAmount] = useState(initialData?.cod_amount?.toString() || "");

    const [selectedDistrict, setSelectedDistrict] = useState(initialData?.customer_district_id?.toString() || "");
    const [selectedCity, setSelectedCity] = useState(initialData?.customer_city_id?.toString() || "");
    const [selectedPickupPoint, setSelectedPickupPoint] = useState(initialData?.pickup_point_id?.toString() || "");
    const [calculatedFees, setCalculatedFees] = useState<any | null>(null);

    const { parcelTypes, districts, cities, pickupPoints } = useParcelOptions(selectedDistrict);

    // Sync state if initialData changes (important for edit mode after fetch)
    useEffect(() => {
        if (initialData) {
            setFullName(initialData.customer_name || "");
            setPhone(initialData.customer_phone || "");
            setAddress(initialData.customer_address || "");
            setWeight(initialData.total_weight?.toString() || "");
            setParcelType(initialData.parcel_type_id?.toString() || "");
            setCodAmount(initialData.cod_amount?.toString() || "");
            setSelectedDistrict(initialData.customer_district_id?.toString() || "");
            setSelectedCity(initialData.customer_city_id?.toString() || "");
            setSelectedPickupPoint(initialData.pickup_point_id?.toString() || "");
        }
    }, [initialData]);

    const codNumber = parseFloat(codAmount) || 0;
    const deliveryChargeNum = Number(calculatedFees?.delivery_charge ?? 0);
    const codChargeNum = Number(calculatedFees?.cod_charge ?? 0);
    const totalChargeNum = Number(calculatedFees?.total_charge ?? 0);

    const handleFormSubmit = () => {
        const payload = {
            parcel_type_id: parcelType ? Number(parcelType) : undefined,
            delivery_speed_id: 1,
            customer_name: fullName,
            customer_phone: phone,
            customer_address: address,
            customer_city_id: selectedCity && selectedCity !== "-1" ? Number(selectedCity) : undefined,
            customer_district_id: selectedDistrict && selectedDistrict !== "-1" ? Number(selectedDistrict) : undefined,
            pickup_point_id: selectedPickupPoint && selectedPickupPoint !== "-1" ? Number(selectedPickupPoint) : undefined,
            total_weight: weight ? Number(weight) : undefined,
            cod_amount: codNumber,
        };
        onSubmit(payload);
    };

    return (
        <div className="p-4 sm:p-6 w-full">
            <ParcelFormHeader title={title} />

            <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="lg:col-span-3 space-y-4">
                    <CustomerInformation
                        fullName={fullName}
                        setFullName={setFullName}
                        phone={phone}
                        setPhone={setPhone}
                        address={address}
                        setAddress={setAddress}
                        districts={districts}
                        cities={cities}
                        pickupPoints={pickupPoints}
                        selectedPickupPoint={selectedPickupPoint}
                        setSelectedPickupPoint={setSelectedPickupPoint}
                        selectedDistrict={selectedDistrict}
                        setSelectedDistrict={setSelectedDistrict}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                    />

                    <ParcelDetails
                        weight={weight}
                        setWeight={setWeight}
                        parcelType={parcelType}
                        setParcelType={setParcelType}
                        parcelTypes={parcelTypes}
                    />

                    <FinancialInfo codAmount={codAmount} setCodAmount={setCodAmount} />
                </div>

                <div className="lg:col-span-1">
                    <FeeCalculator
                        parcel_type_id={parcelType ? Number(parcelType) : undefined}
                        delivery_speed_id={1}
                        total_weight={Number(weight) || undefined}
                        cod_amount={Number(codAmount) || 0}
                        customer_city_id={selectedCity && selectedCity !== "-1" ? Number(selectedCity) : undefined}
                        customer_district_id={selectedDistrict && selectedDistrict !== "-1" ? Number(selectedDistrict) : undefined}
                        onChange={(resp: any) => setCalculatedFees(resp?.data ?? resp)}
                    />

                    <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 mt-4">
                        <h4 className="font-medium mb-2">Order Actions</h4>
                        <div className="text-sm text-slate-600 mb-3">
                            <div className="flex justify-between py-1">
                                <span>Delivery Charge</span>
                                <span>{deliveryChargeNum.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>COD Fee</span>
                                <span>{codChargeNum.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t mt-2 font-semibold">
                                <span>Total Amount to Collect</span>
                                <span className="text-primary">{(totalChargeNum + codNumber).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <Button variant="outline" className="w-full sm:w-auto" type="button" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full sm:w-auto"
                                disabled={isPending}
                                onClick={handleFormSubmit}
                            >
                                {isPending ? "Processing..." : submitLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParcelForm;
