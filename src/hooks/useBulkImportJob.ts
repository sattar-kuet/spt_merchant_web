/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { BulkOrder } from "@/lib/bulkParcels";

export interface ImportJob {
  running: boolean;
  total: number;
  done: number;
  created: number;
  // Why rows could not be created (server messages)
  failed: string[];
  // Rows left out before sending because they had validation errors
  skipped: number;
}

const CHUNK = 10;
const MIN_RUNNING_MS = 1400; // long enough for the progress animation to be seen

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Sends parcels to /orders/bulk in small batches so the merchant can watch real
 * progress, and keeps the outcome (created / failed) for the result dialog.
 */
export default function useBulkImportJob() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [job, setJob] = useState<ImportJob | null>(null);

  const start = useCallback(
    async (orders: BulkOrder[], skipped = 0): Promise<ImportJob> => {
      const startedAt = Date.now();
      let state: ImportJob = { running: true, total: orders.length, done: 0, created: 0, failed: [], skipped };
      setJob(state);

      for (let i = 0; i < orders.length; i += CHUNK) {
        const chunk = orders.slice(i, i + CHUNK);
        let created = 0;
        const failed: string[] = [];
        try {
          const resp = await axiosSecure.post("/orders/bulk", { orders: chunk });
          const data = resp.data ?? {};
          created = typeof data.created === "number" ? data.created : data.success === false ? 0 : chunk.length;
          if (Array.isArray(data.results)) {
            for (const r of data.results) {
              if (r && r.success === false) {
                failed.push(`Row ${i + (r.index ?? 0) + 1}: ${r.message || r.error || "Unknown error"}`);
              }
            }
          }
          if (data.success === false && failed.length === 0) {
            failed.push(data.message || "Failed to create parcels");
          }
        } catch (err: any) {
          const data = err?.response?.data;
          created = typeof data?.created === "number" ? data.created : 0;
          if (Array.isArray(data?.results)) {
            for (const r of data.results) {
              if (r && r.success === false) {
                failed.push(`Row ${i + (r.index ?? 0) + 1}: ${r.message || r.error || "Unknown error"}`);
              }
            }
          }
          if (failed.length === 0) {
            failed.push(data?.message || data?.error || err?.message || "Failed to create parcels");
          }
        }
        state = {
          ...state,
          done: state.done + chunk.length,
          created: state.created + created,
          failed: [...state.failed, ...failed],
        };
        setJob(state);
      }

      const left = MIN_RUNNING_MS - (Date.now() - startedAt);
      if (left > 0) await wait(left);
      state = { ...state, running: false };
      setJob(state);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      return state;
    },
    [axiosSecure, queryClient]
  );

  const close = useCallback(() => setJob(null), []);

  return { job, start, close };
}
