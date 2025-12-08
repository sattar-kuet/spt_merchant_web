"use client";

import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

export default function useParcelOptions(selectedDistrict?: string) {
  const axiosSecure = useAxiosSecure();

  const parcelTypesQuery = useQuery({
    queryKey: ["parcel-types"],
    queryFn: async () => {
      const resp = await axiosSecure.get("/parcel-types");
      const payload = resp.data;
      // normalize common shapes: { data: [...] } or { parcel_types: [...] } or raw array
      if (payload == null) return [];
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.data)) return payload.data;
      if (Array.isArray(payload.parcel_types)) return payload.parcel_types;
      if (Array.isArray(payload.parcelTypes)) return payload.parcelTypes as any;
      return [];
    },
  });

  const districtsQuery = useQuery({
    queryKey: ["locations", "districts"],
    queryFn: async () => {
      const resp = await axiosSecure.get("/locations/districts");
      const payload = resp.data;
      if (payload == null) return [];
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.data)) return payload.data;
      if (Array.isArray(payload.districts)) return payload.districts;
      return [];
    },
  });

  const citiesQuery = useQuery({
    queryKey: ["locations", "cities", selectedDistrict],
    queryFn: async () => {
      const resp = await axiosSecure.get(`/locations/cities`, {
        params: { district_id: selectedDistrict !== "-1" ? selectedDistrict : undefined },
      });
      const payload = resp.data;
      if (payload == null) return [];
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.data)) return payload.data;
      if (Array.isArray(payload.cities)) return payload.cities;
      return [];
    },
    enabled: !!selectedDistrict && selectedDistrict !== "-1",
  });

  const pickupPointsQuery = useQuery({
    queryKey: ["pickup-points"],
    queryFn: async () => {
      const resp = await axiosSecure.get(`/pickup-points`);
      const payload = resp.data;
      if (payload == null) return [];
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.data)) return payload.data;
      if (Array.isArray(payload.pickup_points)) return payload.pickup_points;
      if (Array.isArray(payload.pickupPoints)) return payload.pickupPoints as any;
      return [];
    },
  });

  return {
    parcelTypes: parcelTypesQuery.data,
    parcelTypesQuery,
    districts: districtsQuery.data,
    districtsQuery,
    cities: citiesQuery.data,
    citiesQuery,
    pickupPoints: pickupPointsQuery.data,
    pickupPointsQuery,
  };
}
