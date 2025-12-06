"use client";

import { FaBars } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import Button from "@/components/ui/Button";
import Balance from "@/components/ui/Balance";
import Avatar from "@/components/ui/Avatar";
import { useSidebar } from "@/context/SidebarContext";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";


const imgLink = "https://avatars.githubusercontent.com/u/173485995?v=4&size=64";

const RightSideHeader = () => {
    const { toggle } = useSidebar();
    const [rightOpen, setRightOpen] = useState(false);

    const openRight = () => setRightOpen(true);
    const closeRight = () => setRightOpen(false);

    return (
        <>
            <div className="flex justify-between items-center w-full">
                <div className="cursor-pointer" onClick={toggle}>
                    <FaBars size={18} />
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <div className="hidden sm:block">
                        <Button text="Add Bulk Parcel" url="/parcels/add-parcel/bulk-parcel" focused />
                    </div>
                    <div className="hidden sm:block">
                        <Button text="Add Single Parcel" url="/parcels/add-parcel/single-parcel" focused={false} />
                    </div>
                    <div className="hidden sm:block">
                        <Balance text="Available Balance" balance="3000" />
                    </div>
                    <FaRegBell size={20} />

                    <div className="ml-2 cursor-pointer" onClick={openRight}>
                        <Avatar imgLink={imgLink} />
                    </div>
                </div>
            </div>

            {/* Right-side drawer for mobile */}
            {rightOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/30" onClick={closeRight} />
                    <div className="fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Avatar imgLink={imgLink} />
                                <div>
                                    <div className="font-medium">John Doe</div>
                                    <div className="text-xs text-slate-500">Logistics Manager</div>
                                </div>
                            </div>
                            <button onClick={closeRight} className="p-1 rounded-md text-slate-600">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <Balance text="Available Balance" balance="3000" />
                            <div className="flex flex-col gap-2">
                                <Button text="Add Bulk Parcel" url="/parcels/add-parcel/bulk-parcel" focused />
                                <Button text="Add Single Parcel" url="/parcels/add-parcel/single-parcel" focused={false} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default RightSideHeader;
