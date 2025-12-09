"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function BulkParcelPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function onBrowse() {
    fileInputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : null);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFileName(f.name);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Add Multiple Parcels at Once
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Save time by uploading an Excel file with your parcel information.
        </p>

        <div className="mt-6 sm:mt-8 bg-white rounded-lg p-4 sm:p-8 shadow-sm">
          <div
            className="border-2 border-dashed border-slate-300 rounded-md py-12 sm:py-20 flex flex-col items-center justify-center"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 text-slate-300">
              📁
            </div>
            <div className="text-base sm:text-lg font-medium text-center px-4">
              Drag &amp; drop your Excel file here
            </div>
            <div className="text-xs text-slate-400 mt-2 text-center px-4">
              Accepted formats: .xlsx, .xls, .csv
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={onFileChange}
            />

            <Button
              variant="outline"
              size="default"
              type="button"
              onClick={onBrowse}
              className="mt-4 sm:mt-6"
            >
              Browse files
            </Button>

            {fileName && (
              <div className="mt-3 sm:mt-4 text-sm text-slate-600 text-center px-4">
                Selected: {fileName}
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link href="#" className="text-sm text-blue-600">
              Don&apos;t have a template? Download our template to get started.
            </Link>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex justify-end">
          <Button variant="default" size="default">
            Add Parcels
          </Button>
        </div>
      </div>
    </div>
  );
}