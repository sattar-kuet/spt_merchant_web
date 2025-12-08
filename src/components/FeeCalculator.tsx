"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";

interface CalcProps {
  parcel_type_id?: number | null;
  delivery_speed_id?: number | null;
  total_weight?: number | null;
  cod_amount?: number | null;
  customer_city_id?: number | null;
  customer_district_id?: number | null;
  onChange?: (resp: any) => void;
}

export default function FeeCalculator({
  parcel_type_id,
  delivery_speed_id,
  total_weight,
  cod_amount,
  customer_city_id,
  customer_district_id,
  onChange,
}: CalcProps) {
  const axiosSecure = useAxiosSecure();

  const enabled = Boolean(
    parcel_type_id &&
      delivery_speed_id &&
      total_weight != null &&
      customer_city_id != null &&
      customer_district_id != null
  );

  const params = {
    parcel_type_id,
    delivery_speed_id,
    total_weight,
    cod_amount: cod_amount || 0,
    customer_city_id,
    customer_district_id,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fee", params],
    queryFn: async () => {
      const resp = await axiosSecure.get(`/orders/calculate`, { params });
      return resp.data;
    },
    enabled,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  useEffect(() => {
    if (data) onChange && onChange(data);
  }, [data, onChange]);

  const zeroFees = { delivery_charge: 0, cod_charge: 0, total_charge: 0 } as any;
  const displayed = data ?? zeroFees;

  return (
    <div className="bg-white rounded-lg p-3 border border-slate-200 mb-4">
      <h4 className="text-lg font-semibold mb-2">Fee Calculation</h4>
      {isError && (
        <p className="text-sm text-red-500 mb-2">Failed to calculate fees</p>
      )}

      <div className="flex justify-between mb-1">
        <span>Delivery Charge</span>
        <span className="font-semibold">{isLoading ? "..." : `${displayed.delivery_charge} tk`}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>COD Charge</span>
        <span className="font-semibold">{isLoading ? "..." : `${displayed.cod_charge} tk`}</span>
      </div>
      <div className="flex justify-between mb-1 border-t border-t-gray-200 pt-2">
        <span className="text-xl font-semibold">Total Charge</span>
        <span className="font-semibold text-xl">{isLoading ? "..." : `${displayed.total_charge} tk`}</span>
      </div>

      {!enabled && (
        <p className="text-sm text-slate-500 mt-2">
          Initial values are shown. Provide parcel type, weight and location for accurate calculation.
        </p>
      )}
    </div>
  );
}
