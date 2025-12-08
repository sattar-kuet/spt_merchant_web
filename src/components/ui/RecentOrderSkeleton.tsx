import { IoCubeOutline } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentOrderItems {
  orderId: string;
  customer: string;
  status: "Delivered" | "In-Progress" | "Failed";
}

const getStatusVariant = (status: RecentOrderItems["status"]) => {
  switch (status) {
    case "Delivered":
      return "default";
    case "In-Progress":
      return "secondary";
    case "Failed":
      return "destructive";
    default:
      return "default";
  }
};

const RecentOrderSkeleton = ({ item }: { item: RecentOrderItems }) => {
  const statusVariant = getStatusVariant(item.status);

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <IoCubeOutline size={35} className="text-primary" />
            <div className="">
              <p className="text-sm font-semibold">{item.orderId}</p>
              <p className="text-xs text-gray-600">{item.customer}</p>
            </div>
          </div>
          <Badge variant={statusVariant}>{item.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrderSkeleton;