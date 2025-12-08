import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardItem {
  title: string;
  amount: number;
  progress: string;
  status: "growing" | "equal" | "warning";
}

const getStatusVariant = (status: DashboardItem["status"]) => {
  switch (status) {
    case "growing":
      return "default";
    case "equal":
      return "secondary";
    case "warning":
      return "destructive";
    default:
      return "default";
  }
};

const InfoSkeleton = ({ item, bg }: { item: DashboardItem; bg: string }) => {
  const statusVariant = getStatusVariant(item.status);

  return (
    <Card className={bg}>
      <CardContent className="p-4 flex flex-col gap-2">
        <p className="text-sm text-gray-500">{item.title}</p>
        <p className="text-3xl font-semibold">{item.amount}</p>
        <Badge variant={statusVariant}>{item.progress}</Badge>
      </CardContent>
    </Card>
  );
};

export default InfoSkeleton;
