import { IoCubeOutline } from "react-icons/io5";

interface RecentOrderItems {
    orderId: string;
    customer: string;
    status: "Delivered" | "In-Progress" | "Failed";
}


const RecentOrderSkeleton = ({ item }: { item: RecentOrderItems }) => {

      const statusColor =
    item.status === "Delivered"
      ? "text-green-500"
      : item.status === "In-Progress"
      ? "text-yellow-600"
      : "text-red-500";

      const statusBgColor =
    item.status === "Delivered"
      ? "bg-green-200"
      : item.status === "In-Progress"
      ? "bg-yellow-200"
      : "bg-red-200";


    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
                <IoCubeOutline size={35} color="#155dfc" />
                <div className="">
                    <p className="text-sm font-semibold">{item.orderId}</p>
                    <p className="text-xs text-gray-600">{item.customer}</p>
                </div>
            </div>
            <p className={`text-xs px-2 py-1 ${statusBgColor} ${statusColor} rounded-2xl`}>
                {item.status}
            </p>
        </div>
    )
}

export default RecentOrderSkeleton