"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

const GrowthChart = () => {
  const { formattedEarningData, chartLoading, chartError, fetchChartData } = useDashboardData();
  const [chartType, setChartType] = useState<'daily' | 'monthly'>('daily');

  const handleToggleChart = (type: 'daily' | 'monthly') => {
    setChartType(type);
    fetchChartData(type);
  };

  if (chartLoading) {
    return (
      <div className="px-4 py-3 md:px-5 md:py-4 xl:px-6 xl:py-5 bg-white rounded-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (chartError) {
    return (
      <div className="px-4 py-3 md:px-5 md:py-4 xl:px-6 xl:py-5 bg-white rounded-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Earnings</h3>
            <p className="text-sm text-gray-500">
              {chartType === 'daily' ? 'Last 7 days' : 'Last 7 months'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleToggleChart('daily')}
            >
              Weekly
            </Button>
            <Button
              variant={chartType === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleToggleChart('monthly')}
            >
              Monthly
            </Button>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{chartError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 md:px-5 md:py-4 xl:px-6 xl:py-5 bg-white rounded-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold">Earnings</h3>
          <p className="text-sm text-gray-500">
            {chartType === 'daily' ? 'Last 7 days' : 'Last 7 months'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleToggleChart('daily')}
          >
            Weekly
          </Button>
          <Button
            variant={chartType === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleToggleChart('monthly')}
          >
            Monthly
          </Button>
        </div>
      </div>
      <div style={{ outline: "none" }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedEarningData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="y" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;