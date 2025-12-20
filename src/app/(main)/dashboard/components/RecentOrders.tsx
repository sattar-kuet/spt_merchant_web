import React from 'react'
import Link from 'next/link'
import RecentOrderSkeleton from '@/components/ui/RecentOrderSkeleton';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardContent } from '@/components/ui/card';

const RecentOrders = () => {
  const { formattedRecentOrders, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="px-1 py-3 md:px-2 md:py-3 xl:px-4 xl:py-3 bg-white rounded-md w-full h-full flex flex-col">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3 mt-3">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mt-auto mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="px-1 py-3 md:px-2 md:py-3 xl:px-4 xl:py-3 bg-white rounded-md w-full h-full flex flex-col">
      <p className="text-base font-semibold">Recent Orders</p>
      <div className="flex flex-col gap-3 mt-3 flex-grow">
        {formattedRecentOrders.length > 0 ? (
          formattedRecentOrders.map((item, index) => (
            <RecentOrderSkeleton key={index} item={item} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
            <p className="text-lg font-medium">No orders available</p>
            <p className="text-sm mt-1">
              There are no recent orders to display
            </p>
          </div>
        )}
      </div>

      <Link
        href="/parcels"
        className="text-sm text-primary mt-auto text-center hover:underline"
      >
        View All Orders
      </Link>
    </div>
  );
}

export default RecentOrders
