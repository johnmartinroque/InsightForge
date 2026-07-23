import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import MonthlyReportHeader from "./monthly/MonthlyReportHeader";
import MonthlySummaryCards from "./monthly/MonthlySummaryCards";
import ProfitList from "./monthly/ProfitList";

const MONTH_OPTIONS = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
];

function formatCurrency(value) {
  return `₱${Number(value || 0).toLocaleString()}`;
}

export default function MonthlyReport() {
  const [monthReports, setMonthReports] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const responses = await Promise.all(
        MONTH_OPTIONS.map(({ value }) => supabase.from(value).select("*")),
      );

      const reports = responses
        .map((res, index) => {
          const month = MONTH_OPTIONS[index];
          const data = res.data ?? [];

          if (!data.length) return null;

          const totals = data.reduce(
            (acc, item) => {
              acc.revenue += Number(item.Revenue || 0);
              acc.profit += Number(item["Gross Profit"] || 0);
              acc.units += Number(item["Units Sold"] || 0);
              return acc;
            },
            { revenue: 0, profit: 0, units: 0 },
          );

          const products = data
            .map((item) => ({
              name: item["Product Name"],
              profit: Number(item["Gross Profit"] || 0),
              revenue: Number(item.Revenue || 0),
              category: item.Category,
            }))
            .sort((a, b) => b.profit - a.profit);

          return {
            value: month.value,
            label: month.label,
            ...totals,
            products,
          };
        })
        .filter(Boolean);

      setMonthReports(reports);

      if (reports.length > 0) {
        setSelectedMonth((current) => {
          if (current && reports.some((report) => report.value === current)) {
            return current;
          }
          return reports[reports.length - 1].value;
        });
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const selectedReport = useMemo(
    () =>
      monthReports.find((report) => report.value === selectedMonth) ||
      monthReports[monthReports.length - 1],
    [monthReports, selectedMonth],
  );

  const topProfits = selectedReport?.products?.slice(0, 5) ?? [];
  const lowestProfits =
    selectedReport?.products
      ?.slice()
      .sort((a, b) => a.profit - b.profit)
      .slice(0, 5) ?? [];

  if (loading) {
    return (
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow">
        <p className="text-sm text-gray-500">Loading monthly report...</p>
      </div>
    );
  }

  if (!selectedReport) {
    return null;
  }

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow outline outline-1 outline-white/20 ">
      <MonthlyReportHeader
        selectedMonth={selectedMonth}
        monthReports={monthReports}
        onMonthChange={setSelectedMonth}
      />

      <MonthlySummaryCards
        selectedReport={selectedReport}
        formatCurrency={formatCurrency}
      />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ProfitList
          title="Top 3 Highest Profit"
          items={topProfits}
          formatCurrency={formatCurrency}
        />

        <ProfitList
          title="Top 3 Lowest Profit"
          items={lowestProfits}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
