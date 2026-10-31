"use client";

import React from "react";

interface ParcelFormHeaderProps {
    title: string;
    children?: React.ReactNode;
}

const ParcelFormHeader: React.FC<ParcelFormHeaderProps> = ({ title, children }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="lg:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                    {title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Please fill in the details below
                </p>
            </div>
            {children}
            </div>
        </div>
    );
};

export default ParcelFormHeader;
