"use client";

import React, { useState, useEffect } from "react";
import ParcelFormHeader from "./form/ParcelFormHeader";
import CustomerInformation from "./form/CustomerInformation";
import PickupPointCarousel from "./form/PickupPointCarousel";
import ParcelDetails from "./form/ParcelDetails";
import FinancialInfo from "./form/FinancialInfo";
import FeeCalculator from "@/components/FeeCalculator";
import useParcelOptions from "@/hooks/useParcelOptions";
import { Button } from "@/components/ui/Button";
import useParcelDefaults from "@/hooks/useParcelDefaults";

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
    const [deliverySpeed, setDeliverySpeed] = useState(initialData?.delivery_speed_id?.toString() || "");
    const [calculatedFees, setCalculatedFees] = useState<any | null>(null);

    const { defaults: savedDefaults } = useParcelDefaults();
    const { parcelTypes, districts, cities, pickupPoints, deliverySpeeds } = useParcelOptions(selectedDistrict);

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
            setDeliverySpeed(initialData.delivery_speed_id?.toString() || "");
        }
    }, [initialData]);

    // New parcel: pre-fill from the merchant's saved Default Configuration
    useEffect(() => {
        if (initialData) return;
        if (!savedDefaults) return;
        if (savedDefaults.parcel_type_id) setParcelType(savedDefaults.parcel_type_id);
        if (savedDefaults.delivery_speed_id) setDeliverySpeed(savedDefaults.delivery_speed_id);
        if (savedDefaults.weight) setWeight(savedDefaults.weight);
        if (savedDefaults.pickup_point_id) setSelectedPickupPoint(savedDefaults.pickup_point_id);
    }, [initialData, savedDefaults]);

    // Default to the first available delivery speed once loaded, if none is set yet
    useEffect(() => {
        if (!deliverySpeed && deliverySpeeds && deliverySpeeds.length > 0) {
            setDeliverySpeed(String(deliverySpeeds[0].id));
        }
    }, [deliverySpeed, deliverySpeeds]);

    const codNumber = parseFloat(codAmount) || 0;

    const handleFormSubmit = () => {
        const payload = {
            parcel_type_id: parcelType ? Number(parcelType) : undefined,
            delivery_speed_id: deliverySpeed ? Number(deliverySpeed) : undefined,
            order_type: "normal_delivery",
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
            <ParcelFormHeader title={title}>
                <PickupPointCarousel
                    pickupPoints={pickupPoints}
                    selected={selectedPickupPoint}
                    onSelect={setSelectedPickupPoint}
                />
            </ParcelFormHeader>

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
                        deliverySpeed={deliverySpeed}
                        setDeliverySpeed={setDeliverySpeed}
                        deliverySpeeds={deliverySpeeds}
                    />

                    <FinancialInfo codAmount={codAmount} setCodAmount={setCodAmount} />
                </div>

                <div className="lg:col-span-1">
                    <FeeCalculator
                        parcel_type_id={parcelType ? Number(parcelType) : undefined}
                        delivery_speed_id={deliverySpeed ? Number(deliverySpeed) : undefined}
                        total_weight={Number(weight) || undefined}
                        cod_amount={Number(codAmount) || 0}
                        customer_city_id={selectedCity && selectedCity !== "-1" ? Number(selectedCity) : undefined}
                        customer_district_id={selectedDistrict && selectedDistrict !== "-1" ? Number(selectedDistrict) : undefined}
                        onChange={(resp: any) => setCalculatedFees(resp?.data ?? resp)}
                    />

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
    );
};

export default ParcelForm;
