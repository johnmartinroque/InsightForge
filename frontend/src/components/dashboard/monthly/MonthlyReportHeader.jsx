export default function MonthlyReportHeader({
  selectedMonth,
  monthReports,
  onMonthChange,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-lg font-semibold">Monthly Report</h2>
        <p className="text-sm text-gray-500">
          Review month-by-month performance and highlight profit leaders.
        </p>
      </div>

      <select
        value={selectedMonth}
        onChange={(event) => onMonthChange(event.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none dark:focus:border-blue-500"
      >
        {monthReports.map((report) => (
          <option key={report.value} value={report.value}>
            {report.label}
          </option>
        ))}
      </select>
    </div>
  );
}
