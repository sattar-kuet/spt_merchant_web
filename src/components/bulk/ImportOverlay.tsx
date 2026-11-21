"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes, FaBoxes } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { ImportJob } from "@/hooks/useBulkImportJob";

interface ImportOverlayProps {
  job: ImportJob | null;
  onClose: () => void;
}

export default function ImportOverlay({ job, onClose }: ImportOverlayProps) {
  const router = useRouter();
  if (!job) return null;

  const percent = job.total ? Math.round((job.done / job.total) * 100) : 0;
  const hasFailures = job.failed.length > 0;
  const tone = job.created === 0 ? "red" : hasFailures || job.skipped > 0 ? "amber" : "green";
  const iconClass = {
    red: "bg-red-500 ring-red-100",
    amber: "bg-amber-500 ring-amber-100",
    green: "bg-green-600 ring-green-100",
  }[tone];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/45 backdrop-blur-[3px] p-4 animate-[spt-pop_0.2s_ease_both]">
      <div className="spt-pop w-full max-w-md rounded-3xl bg-white px-8 py-8 text-center shadow-2xl">
        {job.running ? (
          <>
            <svg viewBox="0 0 120 120" className="mx-auto h-32 w-32" aria-hidden="true">
              <g fill="none" stroke="#b9a89a" strokeWidth="3.5" strokeLinecap="round">
                <path className="spt-steam" d="M46 42 q-7 -8 0 -16 q7 -8 0 -16" />
                <path className="spt-steam" style={{ animationDelay: "0.6s" }} d="M60 42 q-7 -8 0 -16 q7 -8 0 -16" />
                <path className="spt-steam" style={{ animationDelay: "1.2s" }} d="M74 42 q-7 -8 0 -16 q7 -8 0 -16" />
              </g>
              <path d="M88 58 h5 a11 11 0 0 1 0 22 h-8" fill="none" stroke="#6b4f3a" strokeWidth="4" strokeLinecap="round" />
              <path d="M30 50 h60 v20 a26 26 0 0 1 -26 26 h-8 a26 26 0 0 1 -26 -26 z" fill="#fff" stroke="#6b4f3a" strokeWidth="4" strokeLinejoin="round" />
              <ellipse cx="60" cy="52" rx="27" ry="3.5" fill="#7b4a2a" />
              <ellipse cx="60" cy="101" rx="42" ry="5" fill="#e7dccf" />
            </svg>
            <h3 className="mt-2 text-2xl font-bold">Relax, grab a coffee</h3>
            <p className="mt-1 mb-5 text-slate-500">We&apos;re creating your parcels. You can sip while this finishes.</p>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="spt-shine h-full min-w-3 rounded-full bg-gradient-to-r from-indigo-500 to-green-500 transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="mt-2.5 text-sm text-slate-500">
              <b>{job.done}</b> of {job.total} parcels · {percent}%
            </div>
          </>
        ) : (
          <>
            <div
              className={`spt-pop mx-auto mb-2 flex h-[72px] w-[72px] items-center justify-center rounded-full text-3xl text-white ring-[10px] ${iconClass}`}
            >
              {job.created === 0 ? <FaTimes /> : <FaCheck />}
            </div>
            <h3 className="mt-3 text-2xl font-bold">{job.created} parcel(s) created</h3>
            {hasFailures ? (
              <div className="mt-2 mb-4 text-left text-sm text-amber-700">
                <p className="mb-1 text-center">{job.failed.length} row(s) could not be created:</p>
                <ul className="max-h-32 list-disc overflow-auto pl-5">
                  {job.failed.slice(0, 8).map((m, i) => (
                    <li key={i} className="whitespace-pre-wrap">{m}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-1 mb-4 text-slate-500">All done! Every parcel was created successfully.</p>
            )}
            {job.skipped > 0 && (
              <p className="mb-4 text-sm text-amber-700">{job.skipped} row(s) with errors were skipped.</p>
            )}
            <p className="mb-4 text-sm font-medium text-slate-700">What would you like to do next?</p>
            <div className="flex flex-wrap justify-center gap-3">
              {job.created > 0 && (
                <Button type="button" onClick={() => router.push("/parcels")}>
                  <FaBoxes size={13} className="mr-2" /> Go to Parcel List
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                {job.created > 0 ? "Create More Parcels" : "Close"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
