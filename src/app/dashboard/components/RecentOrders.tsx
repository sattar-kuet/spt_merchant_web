import React from 'react'
import Link from 'next/link'
import RecentOrderSkeleton from '@/components/ui/RecentOrderSkeleton';


interface RecentOrderItems {
    orderId: string;
    customer: string;
    status: "Delivered" | "In-Progress" | "Failed";
}



const recentOrderItems: RecentOrderItems[] = [
    { orderId: "#A3G5-34", customer: "John Doe", status: "Delivered" },
    { orderId: "#A3G5-34", customer: "John Doe", status: "In-Progress" },
    { orderId: "#A3G5-34", customer: "John Doe", status: "Failed" },
]



const RecentOrders = () => {
    return (
        <div className='px-1 py-3 md:px-2 md:py-3 xl:px-4 xl:py-3 bg-white rounded-md w-full h-full flex flex-col '>
            <p className='text-base font-semibold'>RecentOrders</p>
            <div className='flex flex-col gap-3 mt-3'>
                {/* <RecentOrderSkeleton />
                <RecentOrderSkeleton />
                <RecentOrderSkeleton /> */}
                {
                    recentOrderItems.map((item, index) => (
                        <RecentOrderSkeleton key={index} item={item} />
                    ))
                }
            </div>

            <Link
                href="/"
                className='text-sm text-blue-600 mt-auto text-center hover:underline'
            >
                View All Orders
            </Link>
        </div>
    )
}

export default RecentOrders