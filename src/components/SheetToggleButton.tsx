"use client";

import { Button } from "@/components/ui/Button";

interface SheetToggleButtonProps {
    isEditorOpen: boolean;
    onClick: () => void;
}

export function SheetToggleButton({ isEditorOpen, onClick }: SheetToggleButtonProps) {
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            className={`relative w-9 h-9 p-0 hover:bg-transparent transition-all duration-200 ${isEditorOpen ? "" : ""
                }`}
            title={isEditorOpen ? "Close Editor" : "Open Google Sheet Editor"}
        >
            <div className="relative flex items-center justify-center w-full h-full">
                {/* Google Sheet Icon */}
                <svg
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Google Sheets"
                    className={`w-full h-full transition-opacity duration-200 ${isEditorOpen ? "opacity-50 grayscale" : ""}`}
                >
                    {/* Main Body */}
                    <path fill="#0F9D58" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />

                    {/* Fold */}
                    <path fill="#87CEFA" opacity="0.5" d="M14 2v6h6" />
                    <path fill="#000" opacity="0.1" d="M13 2v6h1V2h-1z M14 7h6v1h-6V7z" />

                    {/* White Grid Cells */}
                    <rect x="7" y="10" width="4" height="2.5" rx="0.5" fill="#fff" />
                    <rect x="12" y="10" width="4" height="2.5" rx="0.5" fill="#fff" />

                    <rect x="7" y="13.5" width="4" height="2.5" rx="0.5" fill="#fff" />
                    <rect x="12" y="13.5" width="4" height="2.5" rx="0.5" fill="#fff" />

                    <rect x="7" y="17" width="4" height="2.5" rx="0.5" fill="#fff" />
                    <rect x="12" y="17" width="4" height="2.5" rx="0.5" fill="#fff" />
                </svg>

                {/* The "Line" (Slash) - Only visible when editor is open */}
                {isEditorOpen && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[120%] h-0.5 bg-red-500 rotate-45 transform origin-center rounded-full shadow-sm" />
                    </div>
                )}
            </div>
        </Button>
    );
}
