"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { SheetToggleButton } from "@/components/SheetToggleButton";
import { TutorialModal } from "@/components/TutorialModal";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function BulkParcelPage() {
  const { data: session, status } = useSession();
  const [viewMode, setViewMode] = useState<"upload" | "editor">("upload");
  const {
    loading,
    error,
    currentSheetId,
    createNewSheet,
    readParcelData,
    clearSheet
  } = useGoogleSheets();

  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Create a new sheet when the user navigates to the editor
  useEffect(() => {
    const initializeSheet = async () => {
      if (viewMode === "editor" && !currentSheetId && !isLoadingSheet && session) {
        setIsLoadingSheet(true);
        try {
          // In a real app, you would get the actual user ID
          const userId = session.user?.email?.split('@')[0] || "user-" + Math.random().toString(36).substr(2, 9);
          const result = await createNewSheet("SPT Merchant Bulk Parcel Sheet", userId);
          setSheetUrl(result.sheetUrl);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (data) {
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            console.log("Uploaded Excel Data:", jsonData);

            Swal.fire({
              icon: "success",
              title: "File Parsed",
              text: `Successfully parsed ${file.name}. Check the console to see the data.`,
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
    }
  };

  // Function to handle adding parcels
  const handleAddParcels = async () => {
    try {
      // Read data from Google Sheets
      const parcels = await readParcelData();

      if (parcels.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Data",
          text: "No parcel data found in the sheet.",
        });
        return;
      }

      // Here you would typically send the data to your backend
      // For now, we'll just show a success message
      console.log("Parcels to be added:", parcels);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Parcels Added",
        text: `${parcels.length} parcels have been added successfully.`,
      });

      // Clear the sheet (except headers)
      await clearSheet();
    } catch (err: any) {
      console.error("Error adding parcels:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to add parcels.",
      });
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
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
                className="text-blue-600 hover:underline cursor-pointer font-medium flex items-center gap-1"
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

        <div className="mt-6 sm:mt-8 bg-white rounded-lg p-4 sm:p-8 shadow-sm">
          {viewMode === "upload" ? (
            // File upload interface
            <>
              <div className="border-2 border-dashed border-slate-300 rounded-md py-12 sm:py-20 flex flex-col items-center justify-center">
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
              </div>

              <div className="mt-4 text-center">
                <Link href="#" className="text-sm text-blue-600">
                  Don&apos;t have a template? Download our template to get
                  started.
                </Link>
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
              </div>

              {/* Loading state */}
              {isLoadingSheet && (
                <div className="w-full flex items-center justify-center" style={{ height: "700px" }}>
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p>Creating your personalized Google Sheet...</p>
                  </div>
                </div>
              )}

              {/* Google Sheets iframe - Editable version */}
              {!isLoadingSheet && sheetUrl && (
                <div className="w-full" style={{ height: "700px" }}>
                  <iframe
                    src={`${sheetUrl}/edit?widget=true&headers=false`}
                    className="w-full h-full border border-gray-300 rounded"
                    frameBorder="0"
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
                <Link href="#" className="text-sm text-blue-600">
                  Need help with the format? View our template example.
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 sm:mt-8 flex justify-end">
          <Button
            variant="default"
            size="default"
            onClick={handleAddParcels}
            disabled={loading || isLoadingSheet}
          >
            {loading ? "Adding Parcels..." : "Add Parcels"}
          </Button>
        </div>
      </div>

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        videoId={process.env.NEXT_PUBLIC_TUTORIAL_VIDEO_ID || "dQw4w9WgXcQ"}
      />
    </div>
  );
}