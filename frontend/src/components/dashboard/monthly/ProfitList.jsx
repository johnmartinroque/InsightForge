export default function ProfitList({ title, items, formatCurrency }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm shadow-sm"
          >
            <span className="font-medium text-gray-700">{item.name}</span>
            <span className="font-semibold">{formatCurrency(item.profit)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
