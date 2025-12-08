"use client";

import { FaBars } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import Balance from "@/components/ui/Balance";
import { Avatar, AvatarImage } from "@/components/ui/Avatar";
import { useSidebar } from "@/context/SidebarContext";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";

const imgLink = "https://avatars.githubusercontent.com/u/173485995?v=4&size=64";

const RightSideHeader = () => {
  const { isOpen, toggle } = useSidebar();
  const [rightOpen, setRightOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const openRight = () => setRightOpen(true);
  const closeRight = () => setRightOpen(false);

  const handleToggle = () => {
    setIsToggling(true);
    toggle();
    // Reset the toggle state after a short delay for visual feedback
    setTimeout(() => setIsToggling(false), 300);
  };

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <button
          className={`cursor-pointer bg-transparent border-none p-0 transition-all duration-300 ${
            isToggling ? "scale-125 text-blue-500" : ""
          }`}
          onClick={handleToggle}
          aria-label="Toggle sidebar"
        >
          <FaBars size={18} />
        </button>
        <div className="flex gap-2 justify-center items-center">
          <div className="hidden sm:block">
            <Link href="/parcels/add-parcel/bulk-parcel">
              <Button variant="default" size="default">
                Add Bulk Parcel
              </Button>
            </Link>
          </div>
          <div className="hidden sm:block">
            <Link href="/parcels/add-parcel/single-parcel">
              <Button variant="outline" size="default">
                Add Single Parcel
              </Button>
            </Link>
          </div>

          <div className="hidden sm:block">
            <Balance text="Available Balance" balance="3000" />
          </div>
          <FaRegBell size={20} />

          <div className="ml-2 cursor-pointer" onClick={openRight}>
            <Avatar>
              <AvatarImage src={imgLink} alt="avatar" />
            </Avatar>
          </div>
        </div>
      </div>

      {/* Right-side drawer for mobile */}
      {rightOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={closeRight}
          />
          <div className="fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={imgLink} alt="avatar" />
                </Avatar>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-xs text-slate-500">
                    Logistics Manager
                  </div>
                </div>
              </div>
              <button
                onClick={closeRight}
                className="p-1 rounded-md text-slate-600 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3">
              <Balance text="Available Balance" balance="3000" />
              <div className="flex flex-col gap-2">
                <Link href="/parcels/add-parcel/bulk-parcel">
                  <Button variant="default" size="default" className="w-full">
                    Add Bulk Parcel
                  </Button>
                </Link>
                <Link href="/parcels/add-parcel/single-parcel">
                  <Button variant="outline" size="default" className="w-full">
                    Add Single Parcel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RightSideHeader;