import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Truck,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardItem {
  title: string;
  amount: number;
  progress: string;
  status: "growing" | "equal" | "warning";
  isCurrency?: boolean;
}

// Light, cheerful theme per card - never a deep/dark fill, only soft tints
// with a saturated icon accent, keyed by title so color never depends on
// array order.
const THEMES: Record<
  string,
  { card: string; iconBg: string; icon: string; glow: string }
> = {
  "total orders": {
    card: "bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100",
    iconBg: "bg-blue-500",
    icon: "text-white",
    glow: "bg-blue-300/30",
  },
  delivered: {
    card: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100",
    iconBg: "bg-emerald-500",
    icon: "text-white",
    glow: "bg-emerald-300/30",
  },
  "in-progress": {
    card: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100",
    iconBg: "bg-amber-500",
    icon: "text-white",
    glow: "bg-amber-300/30",
  },
  failed: {
    card: "bg-gradient-to-br from-rose-50 to-red-50 border-rose-100",
    iconBg: "bg-rose-500",
    icon: "text-white",
    glow: "bg-rose-300/30",
  },
  "delivery cod": {
    card: "bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-100",
    iconBg: "bg-violet-500",
    icon: "text-white",
    glow: "bg-violet-300/30",
  },
  "cod in progress": {
    card: "bg-gradient-to-br from-pink-50 to-fuchsia-50 border-pink-100",
    iconBg: "bg-pink-500",
    icon: "text-white",
    glow: "bg-pink-300/30",
  },
};

const DEFAULT_THEME = {
  card: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200",
  iconBg: "bg-slate-500",
  icon: "text-white",
  glow: "bg-slate-300/30",
};

const getTheme = (title: string) => THEMES[title.toLowerCase()] ?? DEFAULT_THEME;

const getIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case "total orders":
      return <Package size={18} />;
    case "delivered":
      return <CheckCircle2 size={18} />;
    case "in-progress":
      return <Clock size={18} />;
    case "failed":
      return <AlertCircle size={18} />;
    case "delivery cod":
      return <Truck size={18} />;
    case "cod in progress":
      return <Wallet size={18} />;
    default:
      return <Package size={18} />;
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

const InfoSkeleton = ({ item }: { item: DashboardItem; bg?: string }) => {
  const theme = getTheme(item.title);
  const Icon = getIcon(item.title);
  const StatusIcon = getStatusIcon(item.status);

  return (
    <Card
      className={cn(
        "group transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 border overflow-hidden relative",
        theme.card
      )}
    >
      {/* Decorative glow */}
      <div
        className={cn(
          "absolute -right-3 -top-3 w-20 h-20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500",
          theme.glow
        )}
      />

      <CardContent className="p-3 flex flex-col gap-1 relative z-10">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300",
              theme.iconBg,
              theme.icon
            )}
          >
            {Icon}
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "font-medium px-1.5 py-0 text-[9px] rounded-full flex items-center border-none",
              item.status === "growing" && "bg-emerald-500/15 text-emerald-700",
              item.status === "equal" && "bg-slate-500/15 text-slate-600",
              item.status === "warning" && "bg-rose-500/15 text-rose-700"
            )}
          >
            {StatusIcon}
            {item.progress}
          </Badge>
        </div>

        <div className="mt-1">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight leading-none mb-0.5">
            {item.title}
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-xl font-extrabold text-slate-900 tabular-nums leading-none">
              {item.isCurrency ? `৳${(item.amount ?? 0).toLocaleString()}` : (item.amount ?? 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoSkeleton;
