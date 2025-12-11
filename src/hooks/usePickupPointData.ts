"use client";

import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function usePickupPointData() {
	const axiosSecure = useAxiosSecure();
	const queryClient = useQueryClient();

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

	const createPickupPoint = useMutation({
		mutationFn: async (payload: any) => {
			// ensure numeric ids
			const body = {
				...payload,
				city_id: payload.city_id ? Number(payload.city_id) : undefined,
				district_id: payload.district_id ? Number(payload.district_id) : undefined,
			};
			const resp = await axiosSecure.post(`/pickup-points`, body);
			return resp.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pickup-points"] });
		},
	});

	const updatePickupPoint = useMutation({
		mutationFn: async ({ id, payload }: { id: string | number; payload: any }) => {
			const body = {
				...payload,
				city_id: payload.city_id ? Number(payload.city_id) : undefined,
				district_id: payload.district_id ? Number(payload.district_id) : undefined,
			};
			const resp = await axiosSecure.put(`/pickup-points/${id}`, body);
			return resp.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pickup-points"] });
		},
	});

	return {
		pickupPoints: pickupPointsQuery.data,
		pickupPointsQuery,
		createPickupPoint,
		updatePickupPoint,
	};
}
