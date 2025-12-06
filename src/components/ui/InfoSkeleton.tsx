
interface DashboardItem {
  title: string;
  amount: number;
  progress: string;
  status: "growing" | "equal" | "warning";
}

const InfoSkeleton = ({ item,bg }: { item: DashboardItem, bg: string } ) => {
  // Determine color based on status
  const progressColor =
    item.status === "growing"
      ? "text-green-500"
      : item.status === "equal"
      ? "text-yellow-600"
      : "text-red-500";

  return (
    <div className={`p-4 rounded-lg shadow-sm flex flex-col gap-2 ${bg}`}>
      <p className="text-sm text-gray-500">{item.title}</p>
      <p className="text-3xl font-semibold">{item.amount}</p>
      <p className={`text-sm font-medium ${progressColor}`}>{item.progress}</p>
    </div>
  );
};

export default InfoSkeleton;
