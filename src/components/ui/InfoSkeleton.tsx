
interface DashboardItem {
  title: string;
  amount: number;
  progress: string;
  status: "growing" | "equal" | "warning";
}

const InfoSkeleton = ({ item }: { item: DashboardItem }) => {
  // Determine color based on status
  const progressColor =
    item.status === "growing"
      ? "text-green-500"
      : item.status === "equal"
      ? "text-yellow-600"
      : "text-red-500";

  return (
    <div className="px-4 py-3 md:px-5 md:py-4 xl:px-6 xl:py-5 bg-white rounded-md w-full">
      <p className="text-sm text-gray-500">{item.title}</p>
      <p className="text-3xl font-semibold">{item.amount}</p>
      <p className={`text-sm font-medium ${progressColor}`}>{item.progress}</p>
    </div>
  );
};

export default InfoSkeleton;
