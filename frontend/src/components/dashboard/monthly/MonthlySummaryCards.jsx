export default function MonthlySummaryCards({
  selectedReport,
  formatCurrency,
}) {
  if (!selectedReport) return null;

  const cards = [
    {
      label: "Revenue",
      value: formatCurrency(selectedReport.revenue),
    },
    {
      label: "Gross Profit",
      value: formatCurrency(selectedReport.profit),
    },
    {
      label: "Units Sold",
      value: selectedReport.units.toLocaleString(),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-sm">{card.label}</p>
          <p className="text-xl font-semibold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
