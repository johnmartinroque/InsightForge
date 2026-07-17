export default function KPI({ totalRevenue, totalProfit, totalUnits }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-xl bg-white p-6 shadow outline-1 outline-white/20">
        <p className="text-gray-500">Total Revenue</p>
        <h2 className="text-3xl font-bold text-blue-600">
          ₱{totalRevenue.toLocaleString()}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow outline-1 outline-white/20">
        <p className="text-gray-500">Gross Profit</p>
        <h2 className="text-3xl font-bold text-green-600">
          ₱{totalProfit.toLocaleString()}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow outline-1 outline-white/20">
        <p className="text-gray-500">Units Sold</p>
        <h2 className="text-3xl font-bold text-orange-500">
          {totalUnits.toLocaleString()}
        </h2>
      </div>
    </div>
  );
}
