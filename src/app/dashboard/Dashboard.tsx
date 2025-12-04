import React from "react";
import InfoSkeleton from "../../components/ui/InfoSkeleton";
import GrowthChart from "./components/GrowthChart";
import RecentOrders from "./components/RecentOrders";

interface DashboardItem {
  title: string;
  amount: number;
  progress: string;
  status: "growing" | "equal" | "warning";
}

const dashboardInfo: DashboardItem[] = [
  {
    title: "Total Orders",
    amount: 310,
    progress: "+21%",
    status: "growing",
  },
  {
    title: "Delivered",
    amount: 285,
    progress: "+3.0%",
    status: "growing",
  },
  {
    title: "In-Progress",
    amount: 15,
    progress: "-2%",
    status: "equal",
  },
  {
    title: "Failed",
    amount: 10,
    progress: "-2%",
    status: "warning",
  },
];

const Dashboard = () => {
  return (
    <div className="my-8 flex flex-col gap-3 w-full">
      <div>
        <p className="text-3xl font-semibold">Dashboard</p>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s an overview of your parcel
        </p>
      </div>

      <div className="flex gap-3">
        {dashboardInfo.map((item) => (
          <InfoSkeleton key={item.title} item={item} />
        ))}
      </div>

      <div className="flex w-full gap-3">
        <div className="w-4/6">
          <GrowthChart />
        </div>
        <div className="w-2/6">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
