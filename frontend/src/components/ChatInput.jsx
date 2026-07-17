import React, { useState, useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Palette used for per-category coloring (bars within a single-series chart,
// and pie slices) in LIGHT mode. Cycles if there are more categories than colors.
const CATEGORY_COLORS_LIGHT = [
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

// Brighter / higher-contrast variant for DARK mode so slices/bars pop
// against a dark background instead of looking muddy.
const CATEGORY_COLORS_DARK = [
  "#38bdf8",
  "#fbbf24",
  "#34d399",
  "#f87171",
  "#a78bfa",
  "#f472b6",
  "#2dd4bf",
  "#fb923c",
];

// Palette used when a chart has multiple series (each series gets one color) in LIGHT mode.
const SERIES_COLORS_LIGHT = [
  "#0f172a",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#ef4444",
];

// Dark-mode variant: swaps the near-black first color (invisible on dark bg)
// for a bright white/cyan, and brightens the rest.
const SERIES_COLORS_DARK = [
  "#f8fafc",
  "#38bdf8",
  "#fbbf24",
  "#34d399",
  "#f87171",
];

// Hook: tracks whether the system is in dark mode, live-updating on change.
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event) => setIsDark(event.matches);
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  return isDark;
}

// Turns { labels: [...], datasets: [{ label, data }] } into
// [{ name: label, [datasetLabel]: value, ... }] for recharts.
function toChartRows(chart) {
  if (
    !chart ||
    !Array.isArray(chart.labels) ||
    !Array.isArray(chart.datasets)
  ) {
    return [];
  }
  return chart.labels.map((label, i) => {
    const row = { name: label };
    chart.datasets.forEach((ds) => {
      row[ds.label] = Array.isArray(ds.data) ? ds.data[i] : null;
    });
    return row;
  });
}

// Angled tick so long product names don't get dropped for overlapping.
function AngledTick({ x, y, payload, fill }) {
  return (
    <text
      x={x}
      y={y}
      dy={10}
      textAnchor="end"
      fill={fill}
      fontSize={11}
      transform={`rotate(-35, ${x}, ${y})`}
    >
      {payload.value}
    </text>
  );
}

function ChartCard({ chart, isDark }) {
  if (!chart || !chart.type) return null;
  const rows = toChartRows(chart);
  if (rows.length === 0) return null;
  const seriesKeys = (chart.datasets || []).map((ds) => ds.label);
  const singleSeries = seriesKeys.length === 1;

  const CATEGORY_COLORS = isDark ? CATEGORY_COLORS_DARK : CATEGORY_COLORS_LIGHT;
  const SERIES_COLORS = isDark ? SERIES_COLORS_DARK : SERIES_COLORS_LIGHT;
  const gridStroke = isDark ? "#334155" : "#e2e8f0";
  const tickFill = isDark ? "#cbd5e1" : "#666";
  const tooltipStyle = isDark
    ? {
        backgroundColor: "#1e293b",
        border: "1px solid #334155",
        color: "#f1f5f9",
        fontSize: 12,
      }
    : undefined;
  const legendStyle = { fontSize: 12, color: isDark ? "#cbd5e1" : undefined };

  return (
    <div
      className={`w-full rounded-xl border p-4 ${
        isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
      }`}
    >
      {chart.title && (
        <p
          className={`mb-2 text-sm font-semibold ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {chart.title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={360}>
        {chart.type === "line" ? (
          <LineChart data={rows} margin={{ bottom: 45 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis
              dataKey="name"
              interval={0}
              height={60}
              tick={<AngledTick fill={tickFill} />}
            />
            <YAxis tick={{ fontSize: 12, fill: tickFill }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={legendStyle} />
            {seriesKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        ) : chart.type === "pie" ? (
          <PieChart>
            <Pie
              data={rows}
              dataKey={seriesKeys[0]}
              nameKey="name"
              outerRadius={130}
              label={{ fontSize: 12, fill: tickFill }}
            >
              {rows.map((_, i) => (
                <Cell
                  key={i}
                  fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={legendStyle} />
          </PieChart>
        ) : (
          <BarChart data={rows} margin={{ bottom: 45 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis
              dataKey="name"
              interval={0}
              height={60}
              tick={<AngledTick fill={tickFill} />}
            />
            <YAxis tick={{ fontSize: 12, fill: tickFill }} />
            <Tooltip contentStyle={tooltipStyle} />
            {!singleSeries && <Legend wrapperStyle={legendStyle} />}
            {singleSeries ? (
              <Bar dataKey={seriesKeys[0]} radius={[4, 4, 0, 0]}>
                {rows.map((_, i) => (
                  <Cell
                    key={i}
                    fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                  />
                ))}
              </Bar>
            ) : (
              seriesKeys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={SERIES_COLORS[i % SERIES_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function ChatInput() {
  const isDark = useIsDarkMode();
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]); // { role: 'user' | 'agent' | 'error', content: string, charts?: object[] }
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    const outgoing = text.trim();
    setMessages((prev) => [...prev, { role: "user", content: outgoing }]);
    setText("");
    setIsSending(true);

    try {
      const response = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), text: outgoing }),
      });

      const raw = await response.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { reply: raw };
      }

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      const replyText =
        data.reply ?? data.output ?? "The agent responded with no content.";
      // Support the current "charts" array, and fall back to a legacy
      // single "chart" field just in case an older workflow version replies.
      const charts = Array.isArray(data.charts)
        ? data.charts
        : data.chart
          ? [data.chart]
          : [];

      setMessages((prev) => [
        ...prev,
        { role: "agent", content: replyText, charts },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: error.message || "Something went wrong." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-full w-full max-w-[2200px] mx-auto flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {" "}
      <header className="flex items-center gap-2 border-b border-slate-200 bg-slate-900 px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
        <h1 className="text-sm font-semibold tracking-wide text-white">
          Data Analysis Assistant
        </h1>
      </header>
      <div className="hidden border-b border-slate-200 px-4 py-2">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full max-w-xs rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-400"
        />
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-400">
            Ask a question about the product data to get started.
          </p>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-slate-900 text-white"
                  : message.role === "error"
                    ? "border border-red-200 bg-red-50 text-red-700"
                    : "border border-slate-200 bg-slate-50 "
              }`}
            >
              {message.content}
            </div>
            {message.role === "agent" &&
              message.charts &&
              message.charts.length > 0 && (
                <div className="mt-3 flex w-full max-w-[85%] flex-col gap-4">
                  {message.charts.map((chart, chartIndex) => (
                    <ChartCard key={chartIndex} chart={chart} isDark={isDark} />
                  ))}
                </div>
              )}
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-slate-200 px-4 py-3"
      >
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ask about the product data..."
          className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          disabled={isSending || !text.trim()}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
