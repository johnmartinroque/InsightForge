import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import KPI from "./overall/KPI";
import RevenueTrend from "./overall/RevenueTrend";
import RevenueByCategory from "./overall/RevenueByCategory";
import TopProductByRevenue from "./overall/TopProductByRevenue";

const MONTHS = ["january", "february", "march", "april", "may", "june", "july"];

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
      Object.entries(categoryTotals)
        .map(([name, value]) => ({
          name,
          value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
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
      <KPI
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        totalUnits={totalUnits}
      />

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <RevenueTrend monthlyRevenue={monthlyRevenue} />
        <RevenueByCategory categoryData={categoryData} />
      </div>

      <TopProductByRevenue topProducts={topProducts} />
    </>
  );
}
