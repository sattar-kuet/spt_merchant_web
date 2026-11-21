"use client";

import React, { useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileExcel,
  FaListUl,
  FaMoneyBillWave,
  FaSyncAlt,
  FaTrashAlt,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";

interface FilePreviewPanelProps {
  fileName: string | null;
  rows: Record<string, any>[];
  // Per-row problems ([] = ready); null while the file is still being checked
  problems: string[][] | null;
  submitting: boolean;
  onChangeFile: () => void;
  onStartOver: () => void;
  onRemoveRow: (index: number) => void;
  onConfirm: () => void;
}

type Filter = "all" | "valid" | "invalid";

const COD_KEYS = ["cod amount", "cash collection"];

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });

export default function FilePreviewPanel({
  fileName,
  rows,
  problems,
  submitting,
  onChangeFile,
  onStartOver,
  onRemoveRow,
  onConfirm,
}: FilePreviewPanelProps) {
  const [filter, setFilter] = useState<Filter>("all");

  // Union of columns across rows (empty cells are dropped by sheet_to_json)
  const columns = useMemo(() => {
    const cols: string[] = [];
    for (const row of rows) {
      for (const key of Object.keys(row)) if (!cols.includes(key)) cols.push(key);
    }
    return cols;
  }, [rows]);

  const checked = problems !== null && problems.length === rows.length;
  const isValid = (i: number) => checked && problems![i].length === 0;

  const totalCod = useMemo(() => {
    let sum = 0;
    for (const row of rows) {
      for (const key of Object.keys(row)) {
        if (COD_KEYS.includes(key.trim().toLowerCase())) {
          const n = Number(row[key]);
          if (!Number.isNaN(n)) sum += n;
        }
      }
    }
    return sum;
  }, [rows]);

  const validCount = checked ? rows.filter((_, i) => isValid(i)).length : 0;
  const invalidCount = checked ? rows.length - validCount : 0;

  const visible = rows
    .map((row, i) => ({ row, i }))
    .filter(({ i }) => filter === "all" || !checked || (filter === "valid" ? isValid(i) : !isValid(i)));

  const tile = (
    key: Filter | "cod",
    icon: React.ReactNode,
    value: React.ReactNode,
    label: string,
    tone: string,
    activeRing: string
  ) => {
    const active = key !== "cod" && filter === key;
    const base = `flex items-center gap-3 rounded-xl border-2 bg-white p-4 text-left shadow-sm transition-all ${
      active ? activeRing : "border-transparent"
    }`;
    const body = (
      <>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${tone}`}>
          {icon}
        </span>
        <span>
          <b className="block text-2xl leading-tight">{value}</b>
          <span className="text-xs text-slate-500">{label}</span>
        </span>
      </>
    );
    return key === "cod" ? (
      <div className={base}>{body}</div>
    ) : (
      <button
        type="button"
        onClick={() => setFilter(key)}
        className={`${base} cursor-pointer hover:-translate-y-0.5 hover:shadow-md`}
      >
        {body}
      </button>
    );
  };

  return (
    <div className="spt-rise w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {tile("all", <FaListUl />, rows.length, "Total rows", "bg-indigo-50 text-indigo-600", "border-indigo-500")}
        {tile(
          "valid",
          <FaCheckCircle />,
          checked ? validCount : "…",
          "Ready to import",
          "bg-green-50 text-green-600",
          "border-green-500"
        )}
        {tile(
          "invalid",
          <FaExclamationTriangle />,
          checked ? invalidCount : "…",
          "Need attention",
          "bg-amber-50 text-amber-600",
          "border-amber-500"
        )}
        {tile("cod", <FaMoneyBillWave />, <>৳ {fmt(totalCod)}</>, "COD to collect", "bg-cyan-50 text-cyan-600", "")}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm">
            <FaFileExcel className="text-green-600" size={18} />
            <b>{fileName}</b>
            <button
              type="button"
              onClick={onChangeFile}
              className="ml-2 inline-flex items-center gap-1 text-primary font-medium hover:underline cursor-pointer"
            >
              <FaSyncAlt size={11} /> Change file
            </button>
          </div>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <i className="h-2.5 w-2.5 rounded-sm border border-green-500 bg-green-200" /> Ready
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-2.5 w-2.5 rounded-sm border border-amber-500 bg-amber-200" /> Needs fixing in your file
            </span>
          </div>
        </div>

        <div className="overflow-auto max-h-[55vh]">
          <table className="w-full text-sm text-left border-separate border-spacing-0">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2.5 font-semibold border-b border-slate-200">Row</th>
                {columns.map((c) => (
                  <th key={c} className="sticky top-0 z-10 bg-slate-50 px-3 py-2.5 font-semibold whitespace-nowrap border-b border-slate-200">
                    {c}
                  </th>
                ))}
                <th className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200" />
              </tr>
            </thead>
            <tbody>
              {visible.map(({ row, i }, n) => {
                const ok = isValid(i);
                const bad = checked && !ok;
                const tint = ok ? "bg-green-50/70" : bad ? "bg-amber-50" : "";
                const bar = ok ? "shadow-[inset_4px_0_0_#16a34a]" : bad ? "shadow-[inset_4px_0_0_#d97706]" : "";
                return (
                  <React.Fragment key={i}>
                    <tr className="spt-rise" style={{ animationDelay: `${Math.min(n, 12) * 25}ms` }}>
                      <td className={`px-3 py-2.5 font-semibold text-slate-500 whitespace-nowrap ${tint} ${bar}`}>
                        {ok && <FaCheckCircle className="inline mr-1.5 text-green-600" />}
                        {bad && <FaExclamationTriangle className="inline mr-1.5 text-amber-600" />}
                        {i + 1}
                      </td>
                      {columns.map((c) => (
                        <td key={c} className={`px-3 py-2.5 whitespace-pre-wrap ${tint} ${bad ? "" : "border-b border-slate-100"}`}>
                          {row[c] == null ? "" : String(row[c])}
                        </td>
                      ))}
                      <td className={`px-3 py-2.5 text-right ${tint}`}>
                        <button
                          type="button"
                          title="Remove row"
                          onClick={() => onRemoveRow(i)}
                          className="p-1.5 rounded-md text-slate-400 hover:bg-black/5 hover:text-red-500 cursor-pointer"
                        >
                          <FaTrashAlt size={13} />
                        </button>
                      </td>
                    </tr>
                    {bad && (
                      <tr>
                        <td className={`${tint} ${bar}`} />
                        <td colSpan={columns.length + 1} className={`px-3 pb-2.5 text-[13px] font-medium text-amber-700 ${tint}`}>
                          <FaInfoCircle className="inline mr-1.5" />
                          {problems![i].join("  ·  ")}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className="p-10 text-center text-slate-500">Nothing here.</div>
          )}
        </div>
      </div>

      <div className="sticky bottom-3 z-10 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/95 px-5 py-3 shadow-xl backdrop-blur">
        <div className="text-sm">
          {checked ? (
            <>
              <b>{validCount}</b> parcel(s) ready to import
              {invalidCount > 0 && (
                <span className="font-medium text-amber-600">
                  {" "}· {invalidCount} row(s) need fixing and will be skipped
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-500">Checking your file…</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={onStartOver} disabled={submitting}>
            Start over
          </Button>
          <Button type="button" onClick={onConfirm} disabled={!checked || validCount === 0 || submitting}>
            <FaCheck size={12} className="mr-2" />
            {submitting ? "Importing..." : `Confirm Import (${validCount})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
