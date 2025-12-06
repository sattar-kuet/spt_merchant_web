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

const data = [
  { x: 1, y: 200 },
  { x: 2, y: 400 },
  { x: 3, y: 300 },
  { x: 4, y: 800 },
];

const GrowthChart = () => {
  return (
    <div className="px-4 py-3 md:px-5 md:py-4 xl:px-6 xl:py-5 bg-white rounded-md">
      <div style={{ outline: "none" }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart width={600} height={300} data={data}>
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
