"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { SheetToggleButton } from "@/components/SheetToggleButton";
import ManualParcelTable from "@/components/bulk/ManualParcelTable";
import { TutorialModal } from "@/components/TutorialModal";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useBulkCreateParcels from "@/hooks/useBulkCreateParcels";
import { buildOrdersFromRows, RowError } from "@/lib/bulkParcels";

const getGoogleSheetsEditorUrl = (spreadsheetId: string) =>
  `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?rm=minimal`;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function BulkParcelPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"excel" | "manual">("excel");
  const [viewMode, setViewMode] = useState<"upload" | "editor">("upload");
  const {
    loading,
    currentSheetId,
    createNewSheet,
    readParcelData,
    clearSheet
  } = useGoogleSheets();

  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [uploadedRows, setUploadedRows] = useState<Record<string, any>[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const axiosSecure = useAxiosSecure();
  const bulkCreate = useBulkCreateParcels();

  // Create a new sheet when the user navigates to the editor
  useEffect(() => {
    const initializeSheet = async () => {
      if (viewMode === "editor" && !currentSheetId && !isLoadingSheet && session) {
        setIsLoadingSheet(true);
        try {
          // In a real app, you would get the actual user ID
          const userId = session.user?.email?.split('@')[0] || "user-" + Math.random().toString(36).substr(2, 9);
          const result = await createNewSheet("SPT Merchant Bulk Parcel Sheet", userId);
          setSheetUrl(getGoogleSheetsEditorUrl(result.spreadsheetId));
        } catch (err) {
          console.error("Error creating sheet:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to create Google Sheet. Please try again.",
          });
        } finally {
          setIsLoadingSheet(false);
        }
      }
    };

    initializeSheet();
  }, [viewMode, currentSheetId, isLoadingSheet, createNewSheet, session]);

  // Check for OAuth2 callback code in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Remove code from URL without processing it
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onBrowse() {
    fileInputRef.current?.click();
  }

  // Always serve the same sample file (public/BulkImportSample.xlsx)
  function handleDownloadTemplate() {
    const a = document.createElement("a");
    a.href = "/BulkImportSample.xlsx";
    a.download = "BulkImportSample.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const parseFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

          setUploadedRows(jsonData);
          setUploadedFileName(file.name);

          Swal.fire({
            icon: "success",
            title: "File Parsed",
            text: `Found ${jsonData.length} parcel(s) in ${file.name}. Click "Add Parcels" to submit them.`,
          });
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to parse the Excel file.",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) parseFile(file);
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      Swal.fire({
        icon: "error",
        title: "Unsupported file",
        text: "Please drop an .xlsx, .xls or .csv file.",
      });
      return;
    }
    parseFile(file);
  };

  const showRowErrors = (errors: RowError[]) => {
    const shown = errors.slice(0, 10);
    const items = shown
      .map((e) => `<li><b>Row ${e.row}:</b> ${e.message}</li>`)
      .join("");
    const more =
      errors.length > shown.length
        ? `<p>...and ${errors.length - shown.length} more row(s) with errors.</p>`
        : "";
    Swal.fire({
      icon: "error",
      title: "Invalid Parcel Data",
      html: `<ul style="text-align:left">${items}</ul>${more}<p>Fix these rows and try again. No parcels were submitted.</p>`,
    });
  };

  // Function to handle adding parcels
  const handleAddParcels = async () => {
    try {
      // Rows come from the uploaded Excel file or the Google Sheet,
      // depending on the active view
      const rows =
        viewMode === "editor" ? await readParcelData() : uploadedRows;

      if (rows.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Data",
          text:
            viewMode === "editor"
              ? "No parcel data found in the sheet."
              : "Upload an Excel file first.",
        });
        return;
      }

      const { orders, errors } = await buildOrdersFromRows(rows, axiosSecure);

      if (errors.length > 0) {
        showRowErrors(errors);
        return;
      }

      if (orders.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Data",
          text: "No parcel data found to submit.",
        });
        return;
      }

      await bulkCreate.mutateAsync({ orders });

      Swal.fire({
        icon: "success",
        title: "Parcels Added",
        text: `${orders.length} parcel(s) have been added successfully.`,
      });

      if (viewMode === "editor") {
        // Clear the sheet (except headers) only after a successful submission
        await clearSheet();
      } else {
        setUploadedRows([]);
        setUploadedFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err: unknown) {
      console.error("Error adding parcels:", err);
      const message = getErrorMessage(err, "Failed to add parcels.");
      Swal.fire({
        icon: "error",
        title: "Error",
        html: message.split("\n").map((line) => line || "&nbsp;").join("<br/>"),
      });
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className={`mx-auto ${tab === "manual" ? "max-w-[1600px]" : "max-w-5xl"}`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Add Multiple Parcels at Once
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Save time by using Google Sheets to enter your parcel information.
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <span className="text-slate-600">Confused about how to add multiple parcels with Google Sheet?</span>
              <button
                onClick={() => setIsTutorialOpen(true)}
                className="text-primary hover:underline cursor-pointer font-medium flex items-center gap-1"
              >
                See Tutorial
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <GoogleAuthButton session={session} />
            {session && (
              <SheetToggleButton
                isEditorOpen={viewMode === "editor"}
                onClick={() =>
                  setViewMode(viewMode === "upload" ? "editor" : "upload")
                }
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2 border-b border-slate-200">
          {([
            ["excel", "Excel Upload"],
            ["manual", "Smart Form"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 cursor-pointer ${
                tab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 bg-white rounded-lg p-4 sm:p-8 shadow-sm">
          {tab === "manual" ? (
            <ManualParcelTable />
          ) : viewMode === "upload" ? (
            // File upload interface
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-md py-12 sm:py-20 flex flex-col items-center justify-center ${
                  isDragging ? "border-primary bg-slate-50" : "border-slate-300"
                }`}
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
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
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

                {uploadedFileName && (
                  <div className="mt-4 text-sm text-slate-600">
                    <span className="font-medium">{uploadedFileName}</span>
                    {" — "}
                    {uploadedRows.length} parcel(s) ready to submit
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-sm text-primary hover:underline"
                >
                  Don&apos;t have a template? Download our template to get
                  started.
                </button>
              </div>
            </>
          ) : (
            // Google Sheets Interface with Full Width
            <div className="w-full">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  Google Sheets Editor
                </h2>
                <p className="text-sm text-slate-500">
                  Edit your parcel data directly in Google Sheets
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Note: You can edit the sheet directly. Make sure to follow the
                  column format.
                </p>
                {sheetUrl && (
                  <Link
                    href={sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
                  >
                    Open in Google Sheets
                  </Link>
                )}
              </div>

              {/* Loading state */}
              {isLoadingSheet && (
                <div className="w-full flex items-center justify-center" style={{ height: "700px" }}>
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p>Creating your personalized Google Sheet...</p>
                  </div>
                </div>
              )}

              {/* Google Sheets iframe - Editable version */}
              {!isLoadingSheet && sheetUrl && (
                <div className="w-full" style={{ height: "700px" }}>
                  <iframe
                    src={sheetUrl}
                    className="w-full h-full border border-gray-300 rounded"
                    frameBorder="0"
                    allow="clipboard-read; clipboard-write"
                    title="Bulk Parcel Editor"
                  ></iframe>
                </div>
              )}

              {/* Error state */}
              {!isLoadingSheet && !sheetUrl && currentSheetId && (
                <div className="w-full flex items-center justify-center" style={{ height: "700px" }}>
                  <div className="text-center text-red-500">
                    <p>Error loading Google Sheet. Please try again.</p>
                  </div>
                </div>
              )}

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-sm text-primary hover:underline"
                >
                  Need help with the format? View our template example.
                </button>
              </div>
            </div>
          )}
        </div>

        {tab === "excel" && (
        <div className="mt-6 sm:mt-8 flex justify-end">
          <Button
            variant="default"
            size="default"
            onClick={handleAddParcels}
            disabled={loading || isLoadingSheet || bulkCreate.isPending}
          >
            {loading || bulkCreate.isPending ? "Adding Parcels..." : "Add Parcels"}
          </Button>
        </div>
        )}
      </div>

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        videoId={process.env.NEXT_PUBLIC_TUTORIAL_VIDEO_ID || "dQw4w9WgXcQ"}
      />
    </div>
  );
}
