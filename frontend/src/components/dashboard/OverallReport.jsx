import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { supabase } from "../../lib/supabaseClient";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const MONTHS = ["january", "february", "march"];

export default function OverallReport() {
  const [loading, setLoading] = useState(true);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);

    const responses = await Promise.all(
      MONTHS.map((month) => supabase.from(month).select("*")),
    );

    let revenue = 0;
    let profit = 0;
    let units = 0;

    const monthly = [];
    const categoryTotals = {};
    const productTotals = {};

    responses.forEach((res, index) => {
      if (!res.data) return;

      let monthRevenue = 0;

      res.data.forEach((item) => {
        revenue += Number(item.Revenue);
        profit += Number(item["Gross Profit"]);
        units += Number(item["Units Sold"]);

        monthRevenue += Number(item.Revenue);

        categoryTotals[item.Category] =
          (categoryTotals[item.Category] || 0) + Number(item.Revenue);

        productTotals[item["Product Name"]] =
          (productTotals[item["Product Name"]] || 0) + Number(item.Revenue);
      });

      monthly.push({
        month: MONTHS[index].charAt(0).toUpperCase() + MONTHS[index].slice(1),
        revenue: monthRevenue,
      });
    });

    setTotalRevenue(revenue);
    setTotalProfit(profit);
    setTotalUnits(units);

    setMonthlyRevenue(monthly);

    setCategoryData(
      Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
      })),
    );

    setTopProducts(
      Object.entries(productTotals)
        .map(([name, revenue]) => ({
          name,
          revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    );

    setLoading(false);
  }

  if (loading)
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        Loading overall report...
      </div>
    );

  return (
    <>
      {/* KPI */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold text-blue-600">
            ₱{totalRevenue.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Gross Profit</p>
          <h2 className="text-3xl font-bold text-green-600">
            ₱{totalProfit.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Units Sold</p>
          <h2 className="text-3xl font-bold text-orange-500">
            {totalUnits.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
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

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Revenue by Category</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">
          Top 5 Products by Revenue
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
