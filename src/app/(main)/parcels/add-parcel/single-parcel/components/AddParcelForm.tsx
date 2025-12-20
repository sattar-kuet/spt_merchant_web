"use client";

import React, { useState } from "react";
import AddHeader from "./AddHeader";
import CustomerInformation from "./CustomerInformation";
import ParcelDetails from "./ParcelDetails";
import FinancialInfo from "./FinancialInfo";
import FeeCalculator from "@/components/FeeCalculator";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";
import useCreateParcel from "@/hooks/useCreateParcel";
import useParcelOptions from "@/hooks/useParcelOptions";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import Swal from 'sweetalert2';

const AddParcelForm: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [parcelType, setParcelType] = useState("");
  const [codAmount, setCodAmount] = useState("");

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPickupPoint, setSelectedPickupPoint] = useState("");
  const [calculatedFees, setCalculatedFees] = useState<any | null>(null);

  const codNumber = parseFloat(codAmount) || 0;

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const router = useRouter();
  const createParcel = useCreateParcel();

  const { parcelTypes, districts, cities, pickupPoints } = useParcelOptions(selectedDistrict);

  // normalize fee values to safe numbers to avoid null access at render
  const deliveryChargeNum = Number(calculatedFees?.delivery_charge ?? 0);
  const codChargeNum = Number(calculatedFees?.cod_charge ?? 0);
  const totalChargeNum = Number(calculatedFees?.total_charge ?? 0);

  return (
    <div className="p-4 sm:p-6 w-full">
      <AddHeader />

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
              <Button variant="default" className="w-full sm:w-auto" type="button">Cancel</Button>
                <Button
                variant="secondary"
                className="w-full sm:w-auto"
                disabled={createParcel.isPending}
                onClick={() => {
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
                  } as any;

                  createParcel.mutate(payload, {
                  onSuccess: () => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Created',
                      text: 'Parcel created successfully',
                      toast: true,
                      position: 'top-end',
                      timer: 1500,
                      showConfirmButton: false,
                    }).then(() => {
                      router.push('/parcels');
                    });
                  },
                    onError: (err) => {
                      console.error('Create parcel failed', err);
                      Swal.fire({
                        icon: 'error',
                        title: 'Failed',
                        text: err?.message || 'Failed to create parcel'
                      });
                    },
                  });
                }}
                >
                {createParcel.isPending ? 'Creating...' : 'Create Parcel'}
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddParcelForm;