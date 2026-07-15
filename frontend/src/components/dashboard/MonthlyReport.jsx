import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

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
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow ">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Monthly Report</h2>
          <p className="text-sm text-gray-500">
            Review month-by-month performance and highlight profit leaders.
          </p>
        </div>

        <select
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none dark:focus:border-blue-500"
        >
          {monthReports.map((report) => (
            <option key={report.value} value={report.value}>
              {report.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm">Revenue</p>
          <p className="text-xl font-semibold">
            {formatCurrency(selectedReport.revenue)}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 ">
          <p className="text-sm ">Gross Profit</p>
          <p className="text-xl font-semibold">
            {formatCurrency(selectedReport.profit)}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 ">
          <p className="text-sm">Units Sold</p>
          <p className="text-xl font-semibold">
            {selectedReport.units.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 ">
          <h3 className="mb-3 font-semibold">Top 3 Highest Profit</h3>
          <ul className="space-y-2">
            {topProfits.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm shadow-sm"
              >
                <span className="font-medium text-gray-700 ">{item.name}</span>
                <span className="font-semibold ">
                  {formatCurrency(item.profit)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4  ">
          <h3 className="mb-3 font-semibold">Top 3 Lowest Profit</h3>
          <ul className="space-y-2">
            {lowestProfits.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm shadow-sm"
              >
                <span className="font-medium ">{item.name}</span>
                <span className="font-semibold">
                  {formatCurrency(item.profit)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
