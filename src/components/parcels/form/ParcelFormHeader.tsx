"use client";

import React from "react";

interface ParcelFormHeaderProps {
    title: string;
}

const ParcelFormHeader: React.FC<ParcelFormHeaderProps> = ({ title }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                    {title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Please fill in the details below
                </p>
            </div>
        </div>
    );
};

export default ParcelFormHeader;
