import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function RevenueTrend({ monthlyRevenue }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow outline-1 outline-white/20">
      <h2 className="mb-4 text-lg font-semibold">Revenue Trend</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
