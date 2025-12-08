import InfoSkeleton from "@/components/ui/InfoSkeleton";
import RecentOrders from "./components/RecentOrders";
import GrowthChart from "./components/GrowthChart";
import ProtectedRoute from "@/components/ProtectedRoute";

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

const colors = [
  "bg-orange-200",
  "bg-orange-300",
  "bg-orange-400",
  "bg-orange-400",
];

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div className="my-8 flex flex-col gap-3 w-full">
        <div>
          <p className="text-3xl font-semibold">Dashboard</p>
          <p className="text-sm text-slate-500 mt-1">
            Here&apos;s an overview of your parcel
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {dashboardInfo.map((item, index) => (
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