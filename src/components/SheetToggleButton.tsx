"use client";

import { cn } from "@/lib/utils";

interface SheetToggleButtonProps {
    isEditorOpen: boolean;
    onClick: () => void;
}

export function SheetToggleButton({ isEditorOpen, onClick }: SheetToggleButtonProps) {
    return (
        <div
            className={cn(
                "relative flex items-center w-56 h-10 p-1 rounded-full cursor-pointer select-none transition-colors duration-200",
                "bg-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
            )}
            onClick={onClick}
            role="switch"
            aria-checked={isEditorOpen}
            aria-label="Toggle View Mode"
        >
            {/* Sliding Thumb */}
            <div
                className={cn(
                    "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out",
                    isEditorOpen ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
                )}
            />

            {/* Upload Label */}
            <span
                className={cn(
                    "relative z-10 w-1/2 text-center text-sm font-medium transition-colors duration-200",
                    !isEditorOpen ? "text-slate-900" : "text-slate-500"
                )}
            >
                Upload
            </span>

            {/* Google Sheet Label */}
            <span
                className={cn(
                    "relative z-10 w-1/2 text-center text-sm font-medium transition-colors duration-200",
                    isEditorOpen ? "text-slate-900" : "text-slate-500"
                )}
            >
                Google Sheet
            </span>
        </div>
    );
}
