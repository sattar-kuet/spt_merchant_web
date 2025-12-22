"use client";

import InfoSkeleton from "@/components/ui/InfoSkeleton";
import RecentOrders from "./components/RecentOrders";
import GrowthChart from "./components/GrowthChart";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const colors = [
  "bg-violet-500/10 border-violet-200/50",
  "bg-green-500/10 border-green-200/50",
  "bg-orange-500/10 border-orange-200/50",
  "bg-red-500/10 border-red-200/50",
];

const Dashboard = () => {
  const {
    formattedDashboardItems,
    loading,
    error,
    dashboardData
  } = useDashboardData();

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
            {[1, 2, 3, 4].map((index) => (
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
      <div className="my-8 px-4 flex flex-col gap-3 w-full">
        <div className="flex  flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-2xl sm:text-3xl font-semibold">Dashboard</p>
            <p className="text-sm text-slate-500 mt-1">
              Here&apos;s an overview of your parcel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {formattedDashboardItems.map((item, index) => (
            <InfoSkeleton key={item.title} item={item} bg={colors[index]} />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-3">
          <div className="lg:w-4/6">
            <GrowthChart />
          </div>
          <div className="lg:w-2/6">
            <RecentOrders />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;