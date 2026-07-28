import { IoCubeOutline } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RecentOrderItems {
  orderId: string;
  customer: string;
  status: "Delivered" | "In-Progress" | "Failed";
}

const STATUS_THEME: Record<RecentOrderItems["status"], { badge: string; icon: string; iconBg: string }> = {
  Delivered: {
    badge: "bg-emerald-100 text-emerald-700",
    icon: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  "In-Progress": {
    badge: "bg-amber-100 text-amber-700",
    icon: "text-amber-600",
    iconBg: "bg-amber-50",
  },
  Failed: {
    badge: "bg-rose-100 text-rose-700",
    icon: "text-rose-600",
    iconBg: "bg-rose-50",
  },
};

const RecentOrderSkeleton = ({ item }: { item: RecentOrderItems }) => {
  const theme = STATUS_THEME[item.status] ?? STATUS_THEME["In-Progress"];

  return (
    <Card className="border-slate-100 hover:shadow-md transition-shadow duration-200 py-0">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className={cn("p-1.5 rounded-lg", theme.iconBg)}>
              <IoCubeOutline size={16} className={theme.icon} />
            </div>
            <div className="">
              <p className="text-xs font-semibold leading-tight">{item.orderId}</p>
              <p className="text-[11px] text-gray-600 leading-tight">{item.customer}</p>
            </div>
          </div>
          <span
            className={cn(
              "text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
              theme.badge
            )}
          >
            {item.status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrderSkeleton;
