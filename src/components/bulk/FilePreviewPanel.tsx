"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface FilePreviewPanelProps {
  fileName: string | null;
  rows: Record<string, any>[];
  onChangeFile: () => void;
}

export default function FilePreviewPanel({ fileName, rows, onChangeFile }: FilePreviewPanelProps) {
  // Union of columns across rows (empty cells are dropped by sheet_to_json)
  const columns: string[] = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!columns.includes(key)) columns.push(key);
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-lg font-semibold">Preview: {fileName}</h3>
          <p className="text-sm text-slate-500">
            {rows.length} parcel(s) found. Check the data, then click &quot;Add Parcels&quot;.
          </p>
        </div>
        <Button variant="outline" type="button" onClick={onChangeFile}>
          Change file
        </Button>
      </div>

      <div className="overflow-auto max-h-[60vh] rounded-md border border-slate-200">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="text-xs text-slate-500 uppercase">
              <th className="px-3 py-2 font-medium sticky top-0 bg-slate-50">#</th>
              {columns.map((c) => (
                <th key={c} className="px-3 py-2 font-medium whitespace-nowrap sticky top-0 bg-slate-50">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-slate-100 align-top">
                <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                {columns.map((c) => (
                  <td key={c} className="px-3 py-2 whitespace-pre-wrap">
                    {row[c] == null ? "" : String(row[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
