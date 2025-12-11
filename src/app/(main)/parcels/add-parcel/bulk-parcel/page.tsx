"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";

export default function BulkParcelPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hotTableComponent = useRef<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"upload" | "editor">("upload");

  // Sample data for the spreadsheet
  const [sheetData, setSheetData] = useState<Array<Array<string>>>([
    ["Name", "Address", "Weight", "Type", "Phone"],
    ["John Doe", "123 Main St", "2.5", "Parcel", "555-1234"],
    ["Jane Smith", "456 Oak Ave", "1.0", "Document", "555-5678"],
    ["Bob Johnson", "789 Pine Rd", "3.2", "Fragile", "555-9012"],
  ]);

  // State for formula bar
  const [formulaBarValue, setFormulaBarValue] = useState<string>("");

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

  // Handle data changes from Handsontable
  const handleDataChange = (
    changes: Handsontable.CellChange[] | null,
    source: Handsontable.ChangeSource
  ) => {
    if (changes) {
      const newData = [...sheetData];
      changes.forEach((change) => {
        const [row, prop, oldValue, newValue] = change;
        // Ensure row exists
        if (!newData[row]) {
          newData[row] = [];
        }
        // Convert prop to number if it's a string representation of a number
        const col =
          typeof prop === "string" ? parseInt(prop, 10) : (prop as number);
        if (!isNaN(col)) {
          newData[row][col] = newValue as string;
        }
      });
      setSheetData(newData);
    }
  };

  // Handle cell selection
  const handleCellSelection = (row: number, col: number) => {
    if (sheetData[row] && sheetData[row][col] !== undefined) {
      setFormulaBarValue(sheetData[row][col]);
    }
  };

  // Resize Handsontable when component mounts or window resizes
  useEffect(() => {
    const handleResize = () => {
      if (hotTableComponent.current && hotTableComponent.current.hotInstance) {
        hotTableComponent.current.hotInstance.render();
      }
    };

    // Initial render
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Add Multiple Parcels at Once
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Save time by uploading an Excel file with your parcel information.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode(viewMode === "upload" ? "editor" : "upload")
            }
            className="ml-4"
          >
            {viewMode === "upload" ? "Switch to Editor" : "Switch to Upload"}
          </Button>
        </div>

        <div className="mt-6 sm:mt-8 bg-white rounded-lg p-4 sm:p-8 shadow-sm">
          {viewMode === "upload" ? (
            // File upload interface
            <>
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
                  Don&apos;t have a template? Download our template to get
                  started.
                </Link>
              </div>
            </>
          ) : (
            // Exact Google Sheets Interface with Full Width
            <div className="w-full">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">XLSX Editor</h2>
                <p className="text-sm text-slate-500">
                  Edit your parcel data directly in the spreadsheet
                </p>
              </div>

              {/* Google Sheets Header Bar */}
              <div className="bg-white border border-gray-300 rounded-t">
                {/* Menu Bar */}
                <div className="flex items-center px-4 py-1 border-b border-gray-300 text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">File</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span>Insert</span>
                    <span>Format</span>
                    <span>Data</span>
                    <span>Tools</span>
                    <span>Extensions</span>
                    <span>Help</span>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center px-4 py-2 border-b border-gray-300">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 rounded hover:bg-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="border-l border-gray-300 h-6 mx-3"></div>

                  <div className="flex items-center space-x-2">
                    <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                      <option>Calibri</option>
                      <option>Arial</option>
                      <option>Times New Roman</option>
                    </select>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white w-16">
                      <option>10</option>
                      <option>11</option>
                      <option>12</option>
                      <option>14</option>
                      <option>16</option>
                      <option>18</option>
                      <option>20</option>
                    </select>

                    <div className="border-l border-gray-300 h-6 mx-3"></div>

                    <button className="p-1 rounded hover:bg-gray-200">
                      <span className="font-bold">B</span>
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
                      <span className="italic">I</span>
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
                      <span className="underline">U</span>
                    </button>

                    <div className="border-l border-gray-300 h-6 mx-3"></div>

                    <button className="p-1 rounded hover:bg-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Formula Bar */}
                <div className="flex items-center px-4 py-2 border-b border-gray-300">
                  <div className="flex items-center">
                    <div className="bg-gray-100 px-2 py-1 border border-gray-300 rounded-l text-sm font-medium">
                      fx
                    </div>
                    <input
                      type="text"
                      value={formulaBarValue}
                      onChange={(e) => setFormulaBarValue(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-r focus:outline-none w-64"
                      placeholder="Enter cell value or formula"
                    />
                  </div>
                </div>
              </div>

              {/* Google Sheets Main Content Area - Full Width */}
              <div className="border-l border-r border-b border-gray-300 rounded-b w-full" style={{ height: '700px' }}>
                <HotTable
                  ref={hotTableComponent}
                  data={sheetData}
                  rowHeaders={true}
                  colHeaders={true}
                  contextMenu={false}
                  columnSorting={false}
                  filters={false}
                  dropdownMenu={false}
                  licenseKey="non-commercial-and-evaluation"
                  height="100%"
                  width="100%"
                  stretchH="none"
                  autoWrapRow={false}
                  autoWrapCol={false}
                  afterChange={handleDataChange}
                  afterSelection={(row, column) => handleCellSelection(row, column)}
                  readOnly={false}
                  manualColumnResize={true}
                  manualRowResize={true}
                  fillHandle={false}
                  columnHeaderHeight={undefined}
                  rowHeights={undefined}
                  viewportColumnRenderingOffset={undefined}
                  viewportRowRenderingOffset={undefined}
                  renderAllRows={false}
                  renderAllColumns={false}
                  preventOverflow="horizontal"
                  className="w-full h-full"
                  outsideClickDeselects={false}
                  disableVisualSelection={false}
                  persistentState={true}
                  observeDOMVisibility={true}
                  allowInvalid={true}
                  preventWheel={false}
                />
              </div>

              {/* Google Sheets Footer/Status Bar */}
              <div className="flex justify-between items-center px-4 py-1 bg-gray-100 border border-gray-300 rounded-b text-xs">
                <div className="flex items-center space-x-4">
                  <span>Sheet1</span>
                  <span>Add Sheet</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>100%</span>
                  <span>A1</span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link href="#" className="text-sm text-blue-600">
                  Need help with the format? View our template example.
                </Link>
              </div>
            </div>
          )}
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