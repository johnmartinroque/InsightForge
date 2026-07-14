import OverallReport from "./OverallReport";
import MonthlyReport from "./MonthlyReport";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-3xl font-bold">Sales Dashboard</h1>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Overall Report</h2>
          <p className="text-sm text-gray-500">High-level KPIs and trends</p>
        </div>
        <div className="space-y-6">
          <OverallReport />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Monthly Report</h2>
          <p className="text-sm text-gray-500">Month-by-month breakdown</p>
        </div>
        <div className="space-y-6">
          <MonthlyReport />
        </div>
      </section>
    </div>
  );
}
