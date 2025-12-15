"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
}

export function TutorialModal({ isOpen, onClose, videoId }: TutorialModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header/Close Button */}
                <div className="absolute top-2 right-2 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
                        aria-label="Close tutorial"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Video Container (16:9 Aspect Ratio) */}
                <div className="relative pt-[56.25%] bg-slate-900">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title="Tutorial Video"
                        className="absolute top-0 left-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>

            {/* Backdrop Click to Close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
