"use client";

import { useState } from "react";
import InfoSkeleton from "@/components/ui/InfoSkeleton";
import RecentOrders from "./components/RecentOrders";
import GrowthChart from "./components/GrowthChart";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SectionHeading = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className={cn("inline-block w-1.5 h-5 rounded-full", color)} />
    <p className="text-lg font-bold text-slate-800">{children}</p>
  </div>
);

type InsightTab = "parcel" | "financial";

const InsightTabs = ({
  active,
  onChange,
}: {
  active: InsightTab;
  onChange: (tab: InsightTab) => void;
}) => (
  <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 self-start sm:self-auto">
    {(
      [
        { key: "parcel", label: "Parcel Insights" },
        { key: "financial", label: "Financial Insights" },
      ] as const
    ).map((tab) => (
      <button
        key={tab.key}
        type="button"
        onClick={() => onChange(tab.key)}
        className={cn(
          "px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer",
          active === tab.key
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const Dashboard = () => {
  const {
    formattedDashboardItems,
    loading,
    error,
    dashboardData
  } = useDashboardData();
  const [activeTab, setActiveTab] = useState<InsightTab>("parcel");

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="my-8 px-4 flex flex-col gap-3 w-full border-black">
          <div>
            <p className="text-2xl sm:text-3xl font-semibold">Dashboard</p>
            <p className="text-sm text-slate-500 mt-1">
              Loading your dashboard data...
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Card
                key={index}
                className={cn(
                  "animate-pulse border-none shadow-md bg-slate-100/50",
                  "p-3 flex flex-col gap-1"
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="w-7 h-7 bg-slate-200 rounded-lg" />
                  <div className="w-8 h-4 bg-slate-200 rounded-full" />
                </div>
                <div className="mt-1 space-y-1">
                  <div className="h-2 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="my-8 flex flex-col gap-3 w-full">
          <div>
            <p className="text-2xl sm:text-3xl font-semibold">Dashboard</p>
            <p className="text-sm text-slate-500 mt-1">
              Error loading dashboard data
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="my-8 px-4 flex flex-col gap-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Dashboard
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Here&apos;s an overview of your parcel
            </p>
          </div>
          <InsightTabs active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Section 1: KPI cards (2x2) + Recent Orders */}
        {activeTab === "parcel" && (
          <div>
            <SectionHeading color="bg-gradient-to-b from-blue-400 to-violet-400">
              Parcel Insights
            </SectionHeading>
            <div className="flex flex-col lg:flex-row w-full gap-3">
              <div className="lg:w-1/2">
                <div className="grid grid-cols-2 gap-3">
                  {formattedDashboardItems.slice(0, 4).map((item) => (
                    <InfoSkeleton key={item.title} item={item} />
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2">
                <RecentOrders />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: COD cards + Earnings chart */}
        {activeTab === "financial" && (
          <div>
            <SectionHeading color="bg-gradient-to-b from-pink-400 to-fuchsia-400">
              Financial Insights
            </SectionHeading>
            <div className="flex flex-col lg:flex-row w-full gap-3">
              <div className="lg:w-1/2 grid grid-cols-1 gap-3 content-start">
                {formattedDashboardItems.slice(4, 6).map((item) => (
                  <InfoSkeleton key={item.title} item={item} />
                ))}
              </div>
              <div className="lg:w-1/2">
                <GrowthChart />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
