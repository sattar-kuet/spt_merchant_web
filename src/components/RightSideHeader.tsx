"use client";

import { FaBars } from "react-icons/fa6";
import { FaRegBell, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import Balance from "@/components/ui/Balance";
import { Avatar, AvatarImage } from "@/components/ui/Avatar";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useDashboardData } from "@/hooks/useDashboardData";

const imgLink = "https://avatars.githubusercontent.com/u/173485995?v=4&size=64";

const RightSideHeader = () => {
  const { isOpen, toggle } = useSidebar();
  const { user, logout } = useAuth();
  const { dashboardData, loading } = useDashboardData();
  const [rightOpen, setRightOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const openRight = () => setRightOpen(true);
  const closeRight = () => setRightOpen(false);

  const handleToggle = () => {
    setIsToggling(true);
    toggle();
    // Reset the toggle state after a short delay for visual feedback
    setTimeout(() => setIsToggling(false), 300);
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handleLogout = () => {
    logout();
    closeRight();
  };

  // Helper component for displaying balance with toggle
  const BalanceDisplay = ({ balance }: { balance: string }) => (
    <div className="bg-white flex gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md items-center">
      <p className="text-xs md:text-sm px-2 rounded-md transition-colors duration-200">
        Available Balance
      </p>
      {isBalanceVisible ? (
        <p className="text-xs md:text-sm px-2 rounded-md transition-colors duration-200">
          ${balance}
        </p>
      ) : (
        <p className="text-xs md:text-sm px-2 rounded-md transition-colors duration-200">
          ********
        </p>
      )}
      <button
        onClick={toggleBalanceVisibility}
        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
      >
        {isBalanceVisible ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
      </button>
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center w-full flex-row-reverse">
        <button
          className={`cursor-pointer bg-transparent border-none p-0 transition-all duration-300 md:hidden ${
            isToggling ? "scale-125 text-primary" : ""
          }`}
          onClick={handleToggle}
          aria-label="Toggle sidebar"
        >
          <FaBars size={18} />
        </button>
        <div className="flex gap-2 justify-center items-center">
          {user ? (
            <>
              <div className="hidden sm:block">
                <Link href="/parcels/add-parcel/bulk-parcel">
                  <Button
                    variant="default"
                    size="default"
                    className="text-xs sm:text-sm"
                  >
                    Add Bulk Parcel
                  </Button>
                </Link>
              </div>
              <div className="hidden sm:block">
                <Link href="/parcels/add-parcel/single-parcel">
                  <Button
                    variant="outline"
                    size="default"
                    className="text-xs sm:text-sm"
                  >
                    Add Single Parcel
                  </Button>
                </Link>
              </div>

              <div className="hidden sm:block">
                {loading ? (
                  <div className="bg-white flex gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md items-center">
                    <p className="text-xs md:text-sm px-2 rounded-md transition-colors duration-200">
                      Available Balance
                    </p>
                    <p className="text-xs md:text-sm px-2 rounded-md transition-colors duration-200">
                      Loading...
                    </p>
                  </div>
                ) : dashboardData ? (
                  <BalanceDisplay balance={dashboardData.balance.toFixed(2)} />
                ) : (
                  <BalanceDisplay balance="0.00" />
                )}
              </div>
              <FaRegBell size={20} />

              <div className="ml-2 cursor-pointer" onClick={openRight}>
                <Avatar>
                  <AvatarImage src={imgLink} alt="avatar" />
                </Avatar>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="default"
                  className="text-xs sm:text-sm"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="default"
                  size="default"
                  className="text-xs sm:text-sm"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right-side drawer for mobile */}
      {rightOpen && user && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={closeRight}
          />
          <div className="fixed top-0 right-0 z-50 h-full w-64 sm:w-72 bg-white shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={imgLink} alt="avatar" />
                </Avatar>
                <div className="max-w-[calc(100%-40px)]">
                  <div className="font-medium truncate">{user.name}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {user.email}
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
              {loading ? (
                <div className="bg-white flex gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md">
                  <p className="text-xs md:text-sm px-2 rounded-md transition-colors duration-200">
                    Available Balance
                  </p>
                  <p className="text-xs md:text-sm px-2 rounded-md transition-colors duration-200">
                    Loading...
                  </p>
                </div>
              ) : dashboardData ? (
                <BalanceDisplay balance={dashboardData.balance.toFixed(2)} />
              ) : (
                <BalanceDisplay balance="0.00" />
              )}
              <div className="flex flex-col gap-2">
                <Link href="/parcels/add-parcel/bulk-parcel">
                  <Button
                    variant="default"
                    size="default"
                    className="w-full text-xs sm:text-sm"
                  >
                    Add Bulk Parcel
                  </Button>
                </Link>
                <Link href="/parcels/add-parcel/single-parcel">
                  <Button
                    variant="outline"
                    size="default"
                    className="w-full text-xs sm:text-sm"
                  >
                    Add Single Parcel
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full text-xs sm:text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RightSideHeader;