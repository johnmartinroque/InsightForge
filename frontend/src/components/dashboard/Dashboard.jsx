import OverallReport from "./OverallReport";
import MonthlyReport from "./MonthlyReport";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-3xl font-bold">Sales Dashboard</h1>

      <OverallReport />

      <MonthlyReport />
    </div>
  );
}
