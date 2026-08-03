# 📊 InsightForge

A full-stack sales & inventory analytics platform combining a **React + Tailwind CSS** dashboard with a **Supabase** backend and an **n8n AI Agent** for natural-language data analysis. Users can explore KPIs, monthly breakdowns, and top/bottom performers visually — or simply ask the built-in AI chat assistant a question in plain English and get back a business-friendly answer complete with auto-generated charts.

![status](https://img.shields.io/badge/status-active-brightgreen)
![react](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![tailwind](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css&logoColor=white)
![supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-Workflow%20Automation-EA4B71?logo=n8n&logoColor=white)

---

## ✨ Features

- **AI Chat Assistant** — a floating chat widget backed by an n8n AI Agent (Google Gemini) that reads live data from Google Sheets, reasons over one or more months, and replies with text **and** dynamically rendered Recharts visualizations (bar, line, or pie).
- **Overall Report** — total revenue, gross profit, and units sold at a glance, plus a revenue trend line chart, a top-5 category pie chart, and a top-5 products bar chart.
- **Monthly Report** — a month picker with summary cards (revenue, gross profit, units sold) and side-by-side "Top 3 Highest Profit" / "Top 3 Lowest Profit" product lists.
- **Authentication** — Supabase email/password auth with a "remember me" persisted session.
- **Dark mode support** — charts and UI adapt automatically to `prefers-color-scheme`.

---

## 🏗️ Architecture

```
┌──────────────────────┐        ┌───────────────────────────┐        ┌──────────────────┐
│   React Dashboard     │──────▶│   Supabase (Postgres)      │        │   Google Sheets    │
│  (Overall + Monthly)  │◀──────│  one table per month       │        │  one tab per month  │
└──────────────────────┘        └───────────────────────────┘        └──────────────────┘
          │                                                                    ▲
          │  POST { text }                                             │
          ▼                                                                   │
┌──────────────────────┐        ┌───────────────────────────┐        ┌──────────────────┐
│   Chat Widget         │──────▶│   n8n Webhook               │──────▶│  Google Sheets Tool │
│   (ChatInput.jsx)     │◀──────│   → If → AI Agent → Format  │◀──────│  (per-month lookup) │
└──────────────────────┘        └───────────────────────────┘        └──────────────────┘
                                             │
                                             ▼
                                 ┌───────────────────────────┐
                                 │  Google Gemini (via        │
                                 │  LangChain) + Buffer       │
                                 │  Window Memory             │
                                 └───────────────────────────┘
```

- The **dashboard** reads pre-aggregated sales rows directly from Supabase (one table per month: `january` … `july`).
- The **chat widget** talks to a separate n8n webhook, which drives an AI Agent that queries **Google Sheets** (not Supabase) as its source of truth for conversational analysis, then returns a strict JSON payload the frontend renders as chat bubbles + charts.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Tailwind CSS, Recharts |
| Backend / DB | Supabase (Postgres + Auth) |
| Automation / AI | n8n, Google Gemini (LangChain node), Google Sheets |
| Data source (chat agent) | Google Sheets — one tab per month |
| Data source (dashboard) | Supabase — one table per month |

---

## 🔁 n8n Workflow: AI Data Analysis Agent

This workflow powers the in-app chat assistant. It exposes a webhook that accepts a user's question, routes it through validation, and hands it to a Gemini-powered LangChain agent equipped with a Google Sheets tool.

### Workflow steps

1. **Webhook** — `POST` endpoint that accepts `{ email, text }` from the chat widget.
2. **If (validation)** — checks that `body.text` exists and is non-empty.
   - ❌ Fails → **Respond Error** returns `400` with `{ "error": "Message text is required." }`.
   - ✅ Passes → continues to the AI Agent.
3. **AI Agent** (LangChain Agent node, powered by **Google Gemini Chat Model**)
   - System prompt instructs the agent that the spreadsheet has **one tab per month** (January–July), with columns: `Product Name, Category, Units Sold, Unit Cost, Unit Price, Revenue, COGS, Gross Profit, Gross Margin (%), Stock Remaining`.
   - The agent decides which month(s) are relevant to the question, calls the **Google Sheets Tool** once per month tab needed, and performs any aggregation (sums, averages, comparisons) itself rather than trusting single cells blindly.
   - The agent is instructed to reply with **strict JSON only** — no markdown fences, no preamble — shaped as:
     ```json
     {
       "reply": "business-friendly text answer",
       "charts": [
         {
           "type": "bar | line | pie",
           "title": "Chart title",
           "labels": ["Label A", "Label B"],
           "datasets": [{ "label": "Series name", "data": [123, 456] }]
         }
       ]
     }
     ```
   - Chart-type rules are baked into the prompt: **bar** for category comparisons within a snapshot, **line** for month-over-month trends, **pie** for share-of-whole breakdowns, and **separate chart objects** for naturally distinct groupings (e.g. "highest vs. lowest").
4. **Google Sheets Tool** — a LangChain tool node the agent calls with a dynamic `Sheet` parameter (`$fromAI`) to pick which month tab to read.
5. **Simple Memory (Buffer Window)** — maintains short-term conversational context per session.
6. **Format Agent Output (Code node)** — defensively parses the agent's raw output:
   - Extracts the first `{...}` JSON block in case the model added stray text.
   - Falls back to `{ reply: rawText, charts: [] }` if parsing fails.
   - Normalizes both the current `charts` array and a legacy single `chart` object into one consistent `charts` array.
7. **Respond Success** — returns the final `{ reply, charts }` JSON to the webhook caller.

### Why the Code node matters

LLM output isn't always perfectly clean JSON — models can prepend commentary or wrap responses in markdown fences. The **Format Agent Output** node guarantees the frontend always receives a predictable, safely-parsed shape, so the chat UI never crashes on a malformed response.

### Importing the workflow

1. In n8n, go to **Workflows → Import from File** and select `sales-dashboard-agent.json`.
2. Reconnect credentials for:
   - **Google Gemini (PaLM) API**
   - **Google Sheets OAuth2**
3. Update the **Google Sheets Tool** node's `documentId` to point at your own spreadsheet (one tab per month, same column layout as above).
4. Activate the workflow and copy the **Webhook URL** — this becomes `VITE_N8N_WEBHOOK_URL` in the frontend `.env`.

---

## 🖥️ Frontend

### Pages & Components

```
src/
├── pages/
│   └── Home.jsx                     # renders <Dashboard />
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.jsx            # page shell: Overall + Monthly sections
│   │   ├── OverallReport.jsx        # KPIs, revenue trend, category pie, top products
│   │   ├── overall/
│   │   │   ├── KPI.jsx
│   │   │   ├── RevenueTrend.jsx
│   │   │   ├── RevenueByCategory.jsx
│   │   │   └── TopProductByRevenue.jsx
│   │   ├── MonthlyReport.jsx        # month selector + summary + profit lists
│   │   └── monthly/
│   │       ├── MonthlyReportHeader.jsx
│   │       ├── MonthlySummaryCards.jsx
│   │       └── ProfitList.jsx
│   ├── ChatWidget.jsx                # floating launcher + panel
│   ├── ChatInput.jsx                 # chat UI, calls the n8n webhook, renders charts
│   ├── LoginForm.jsx
│   └── RegisterForm.jsx
└── lib/
    ├── supabaseClient.js
    └── auth.js
```

### Key implementation notes

- **`OverallReport.jsx` / `MonthlyReport.jsx`** each fetch all seven month tables from Supabase in parallel (`Promise.all`), then aggregate revenue, gross profit, and units sold client-side.
- **`ChatInput.jsx`** posts `{ email, text }` to the n8n webhook, parses the JSON response, and renders each returned chart with a shared `ChartCard` component built on **Recharts** (bar / line / pie), with full light/dark theming via `prefers-color-scheme`.
- **`ChatWidget.jsx`** is a lightweight floating action button that toggles a modal-style chat panel.
- **Auth** uses `supabase.auth.signInWithPassword` / `signUp`, storing a lightweight user object via `storeUserInfo` (persisted in `localStorage` when "remember me" is checked).

---

## ⚙️ Setup

### Prerequisites

- Node.js 18+
- A Supabase project with one table per month (`january` … `july`) containing the columns listed above
- An n8n instance (cloud or self-hosted) with the workflow imported and activated
- A Google Cloud project with Gemini API access and Google Sheets OAuth credentials

### Environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/your-webhook-id
```

### Install & run

```bash
npm install
npm run dev
```

---


---

## 📸 Screenshots


### AI Chat Assistant
![Chat Assistant](./screenshots/chat-assistant.png)
*Ask questions in plain English and get back answers with auto-generated charts.*

### Overall Report
![Overall Report](./screenshots/overall-report.png)
*KPI cards, revenue trend, top categories, and top products at a glance.*

### Monthly Report
![Monthly Report](./screenshots/monthly-report.png)
*Month-by-month breakdown with highest/lowest profit products.*


### Dark Mode
![Dark Mode](./screenshots/dark-mode.png)
*Fully themed dashboard and charts for light/dark preference.*
