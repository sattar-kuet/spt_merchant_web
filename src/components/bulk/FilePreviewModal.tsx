"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string | null;
  rows: Record<string, any>[];
}

export default function FilePreviewModal({ isOpen, onClose, fileName, rows }: FilePreviewModalProps) {
  if (!isOpen) return null;

  // Union of columns across rows (empty cells are dropped by sheet_to_json)
  const columns: string[] = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!columns.includes(key)) columns.push(key);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold">Preview: {fileName}</h3>
          <p className="text-sm text-slate-500">
            {rows.length} parcel(s) found. Check the data, then close this and click &quot;Add Parcels&quot;.
          </p>
        </div>

        <div className="overflow-auto px-5 py-3">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-xs text-slate-500 uppercase">
                <th className="px-2 py-2 font-medium sticky top-0 bg-white">#</th>
                {columns.map((c) => (
                  <th key={c} className="px-2 py-2 font-medium whitespace-nowrap sticky top-0 bg-white">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-slate-100 align-top">
                  <td className="px-2 py-2 text-slate-400">{i + 1}</td>
                  {columns.map((c) => (
                    <td key={c} className="px-2 py-2 whitespace-pre-wrap">
                      {row[c] == null ? "" : String(row[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 flex justify-end">
          <Button variant="default" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
