"use client";

import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PickupPointCarousel: React.FC<{
    pickupPoints?: { id: number; name: string }[];
    selected?: string;
    onSelect: (v: string) => void;
}> = ({ pickupPoints, selected, onSelect }) => {
    const trackRef = useRef<HTMLDivElement>(null);

    const scrollByPage = (dir: 1 | -1) => {
        const el = trackRef.current;
        if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-medium">Pickup Point</h3>

            {pickupPoints && pickupPoints.length > 0 ? (
                <div className="mt-4 flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Previous pickup points"
                        onClick={() => scrollByPage(-1)}
                        className="shrink-0 p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                        <FaChevronLeft size={12} />
                    </button>

                    <div
                        ref={trackRef}
                        className="flex flex-1 gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {pickupPoints.map((p) => {
                            const active = selected === String(p.id);
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => onSelect(String(p.id))}
                                    className={`snap-start shrink-0 basis-[calc((100%-1.5rem)/3)] rounded-md border px-3 py-3 text-sm text-center truncate cursor-pointer transition-colors ${active
                                        ? "border-primary bg-primary/10 text-primary font-medium"
                                        : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                    title={p.name}
                                >
                                    {p.name}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        aria-label="Next pickup points"
                        onClick={() => scrollByPage(1)}
                        className="shrink-0 p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                        <FaChevronRight size={12} />
                    </button>
                </div>
            ) : (
                <p className="mt-3 text-sm text-slate-500">No pickup points</p>
            )}
        </div>
    );
};

export default PickupPointCarousel;
