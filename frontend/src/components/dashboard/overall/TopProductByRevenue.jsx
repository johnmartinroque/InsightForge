import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function TopProductByRevenue({ topProducts }) {
  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow outline-1 outline-white/20">
      <h2 className="mb-4 text-lg font-semibold">Top 5 Products by Revenue</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
          <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
            {topProducts.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
