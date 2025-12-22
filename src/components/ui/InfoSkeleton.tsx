import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardItem {
  title: string;
  amount: number;
  progress: string;
  status: "growing" | "equal" | "warning";
}

const getIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case "total orders":
      return <Package className="text-violet-600" size={20} />;
    case "delivered":
      return <CheckCircle2 className="text-green-600" size={20} />;
    case "in-progress":
      return <Clock className="text-orange-500" size={20} />;
    case "failed":
      return <AlertCircle className="text-red-600" size={20} />;
    default:
      return <Package size={20} />;
  }
};

const getStatusIcon = (status: DashboardItem["status"]) => {
  switch (status) {
    case "growing":
      return <TrendingUp size={12} className="mr-0.5" />;
    case "equal":
      return <Minus size={12} className="mr-0.5" />;
    case "warning":
      return <TrendingDown size={12} className="mr-0.5" />;
  }
};

const InfoSkeleton = ({ item, bg }: { item: DashboardItem; bg: string }) => {
  const Icon = getIcon(item.title);
  const StatusIcon = getStatusIcon(item.status);

  return (
    <Card className={cn(
      "group transition-all duration-300 shadow-md hover:shadow-xl border-none overflow-hidden relative",
      bg,
      "bg-opacity-40 backdrop-blur-sm"
    )}>
      {/* Decorative background shape - smaller and more subtle */}
      <div className="absolute -right-2 -top-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500" />

      <CardContent className="p-3 flex flex-col gap-1 relative z-10">
        <div className="flex items-center justify-between">
          <div className="p-1.5 bg-white/80 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
            {Icon}
          </div>
          <Badge
            variant={item.status === "warning" ? "destructive" : item.status === "equal" ? "secondary" : "default"}
            className={cn(
              "font-medium px-1.5 py-0 text-[9px] rounded-full flex items-center",
              item.status === "growing" && "bg-green-500/20 text-green-700 hover:bg-green-500/30",
              item.status === "equal" && "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30",
              item.status === "warning" && "bg-red-500/20 text-red-700 hover:bg-red-500/30 border-none"
            )}
          >
            {StatusIcon}
            {item.progress}
          </Badge>
        </div>

        <div className="mt-1">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight leading-none mb-0.5">{item.title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-xl font-extrabold text-slate-900 tabular-nums leading-none">
              {item.amount.toLocaleString()}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoSkeleton;
