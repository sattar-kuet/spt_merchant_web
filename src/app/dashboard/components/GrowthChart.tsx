"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { x: 1, y: 200 },
  { x: 2, y: 400 },
  { x: 3, y: 300 },
  { x: 4, y: 800 },
];

const GrowthChart = () => {
  return (
    <div className='px-4 py-3 md:px-5 md:py-4 xl:px-6 xl:py-5 bg-white rounded-md'>
      <div style={{ outline: 'none' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#0ea5e9" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GrowthChart;