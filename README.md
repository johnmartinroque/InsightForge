# 📊 Insight Forge

A full-stack sales and inventory analytics platform combining a **React dashboard**, a **Supabase** data layer, and **two n8n AI Agent workflows** powered by Google Gemini — one that answers natural-language questions in a live chat widget, and one that autonomously generates and emails a formatted monthly PDF report.

---

## 🚀 Features

- 📈 **Overall Report** — aggregated KPIs, monthly revenue trend, top-5 revenue-by-category, and top-5 products by revenue, computed live across seven monthly Supabase tables
- 🗓️ **Monthly Report** — month picker with per-month KPIs and top/bottom 5 products by gross profit
- 💬 **AI Chat Assistant** — floating chat widget where users ask questions about the sales data in plain English and get back an explanation plus auto-generated charts
- 🧠 **AI Agent-Generated Reports** — a scheduled n8n **LangChain AI Agent** that autonomously pulls spreadsheet data, calculates KPIs, writes analysis text, ranks products, forecasts next month, and produces a fully designed PDF report — emailed and archived automatically, with zero manual work
- 🌗 Dark mode-aware charts (`prefers-color-scheme`)
- 🔐 Supabase Auth login/register with cross-tab session sync
- 📱 Responsive UI built with React & Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- React, React Router
- Tailwind CSS
- Recharts (Bar, Line, Pie)

### Backend / Data
- Supabase (Postgres tables `january`–`july`, Supabase Auth)

### Automation / AI (n8n)
- **LangChain AI Agent nodes** orchestrating Google Gemini
- Google Sheets Tool & Calculator Tool (agent-callable tools)
- PDF.co (HTML → PDF), Google Drive, SMTP email
- Webhook trigger (chat) + Schedule trigger (monthly report)

---

## 🧠 The n8n AI Agents — Core of the Project

This project runs **two separate n8n AI Agents**, both built on `@n8n/n8n-nodes-langchain.agent` with a Google Gemini chat model as the reasoning engine. The agent pattern is what lets these workflows go beyond simple "fetch data → format it" automation: each agent is given a goal, a set of callable tools, and a strict output contract, and it decides for itself which tools to call and in what order.

### 1. Chat Data-Analysis Agent (real-time, webhook-triggered)

Powers the chat widget in the dashboard.

- **Trigger:** `ChatInput.jsx` posts `{ email, text }` to an n8n webhook.
- **Reasoning:** the Gemini-backed agent interprets the free-text question, decides which monthly sheet(s)/tables are relevant, and plans the calculations needed to answer it.
- **Tools available to the agent:**
  - **Google Sheets / Data Tool** — lets the agent pull rows for any month on demand rather than the workflow pre-loading everything
  - **Calculator Tool** — used for aggregations, comparisons, and margin/growth math so the LLM isn't doing arithmetic by itself
  - **Conversation Memory** (email-keyed session) — keeps context across turns of the same conversation
- **Output contract:** the agent must return strict JSON — a plain-language `reply` plus an optional `charts` array (`type`, `title`, `labels`, `datasets`) so the frontend can render the exact chart type the agent chose (bar/line/pie) with Recharts.

### 2. Monthly Report Agent (scheduled, autonomous)

Generates the full Sales & Inventory PDF report every month with no human input.

- **Trigger:** `Monthly Schedule Trigger` (cron `0 6 1 * *` — 6 AM on the 1st of each month) → `Determine Current Month` computes the target month, date, and output filename.
- **Reasoning:** the agent is instructed to pull the current month's sheet **and** attempt the previous month's sheet (for trend/prediction purposes), decide whether prior data was actually available, and only include a prediction section if it was.
- **Tools available to the agent:**
  - **Google Sheets Tool** — fetches the exact sheet tab named after the target month (and the prior month, if it exists)
  - **Calculator Tool** — computes totals, averages, gross margins, and product rankings so figures are numerically reliable rather than model-estimated
- **Strict JSON output contract** enforced via a detailed system prompt, including:
  - `kpi` block (revenue, COGS, gross profit, average margin, units sold)
  - `analysisText` — a natural-language summary that must reference the actual KPI numbers
  - `prediction` — conditional forward-looking estimate, only populated when prior-month data was retrievable
  - `topMargin` / `lowMargin` — top and bottom 3 products by margin
  - `categoryRevenue` — full, unabbreviated category breakdown for charting
  - `recommendations` — exactly 3 problem/action pairs
  - Formatting rules baked into the prompt (no markdown fences, no `<`/`>` characters, peso-formatted currency, two-decimal percentages)
- **Post-processing:** a Code node (`Render Report Template`) parses the agent's JSON, strips any stray formatting, and deterministically renders it into a styled HTML report — including a hand-built SVG bar chart for category revenue, computed in code rather than left to the model, so pixel math is always correct.
- **Delivery pipeline:** HTML → **PDF.co** (HTML-to-PDF) → downloaded → **emailed via SMTP** and **uploaded to Google Drive**, fully unattended.

**Why an agent instead of a fixed pipeline?** Both workflows hand the LLM real tools (Sheets, Calculator) and a goal, rather than pre-fetching and hardcoding every value. This lets the same agent gracefully handle missing data (e.g. no previous month sheet yet), variable category counts, and open-ended user questions — while a strict JSON schema in the system prompt keeps the output machine-parseable for the frontend and PDF renderer downstream.

---

## 🏗️ Architecture

### Chat Assistant Flow

```text
                React Chat Widget
                      │
                POST { email, text }
                      │
               n8n Webhook Trigger
                      │
             Google Gemini AI Agent
              (LangChain Agent)
                      │
      ┌───────────────┴───────────────┐
      │                               │
Conversation Memory            Google Sheets Tool
 (Email Session)              + Calculator Tool
      │                               │
      └───────────────┬───────────────┘
                      │
        Agent decides tools + generates JSON
          { reply, charts: [...] }
                      │
             Respond to React Frontend
                      │
      Display Answer + Interactive Charts
```

### Monthly Report Flow

```text
        Monthly Schedule Trigger (1st, 6 AM)
                      │
             Determine Current Month
                      │
             Google Gemini AI Agent
              (LangChain Agent)
                      │
      ┌───────────────┴───────────────┐
      │                               │
 Google Sheets Tool              Calculator Tool
(current + previous month)      (KPIs, margins, ranks)
      │                               │
      └───────────────┬───────────────┘
                      │
        Agent generates structured JSON
                      │
        Render Report Template (Code node)
         → styled HTML + computed SVG chart
                      │
             PDF.co: HTML → PDF
                      │
              Download Generated PDF
                      │
        ┌─────────────┴─────────────┐
        │                           │
  Send Email (SMTP)         Upload to Google Drive
```

---

## 📊 Supported Charts

Charts are chosen by the AI agent (chat) or computed deterministically (monthly report):

| Chart | Used for |
|-------|----------|
| 📊 Bar | Revenue/profit/units by product or category |
| 📈 Line | Monthly revenue or profit trends |
| 🥧 Pie | Revenue share by category |

---

## 🗄️ Data Source

Live data lives in per-month Supabase tables (`january`–`july`) and mirrored Google Sheets tabs, both with the same schema:

| Column | Description |
|--------|-------------|
| Product Name | Product identifier |
| Category | Product category |
| Units Sold | Units sold in the month |
| Unit Cost / Unit Price | Cost and price per unit |
| Revenue | Total revenue |
| COGS | Cost of goods sold |
| Gross Profit | Revenue minus COGS |
| Gross Margin (%) | Profitability percentage |
| Stock Remaining | Inventory left *(chat agent only; excluded from the monthly report JSON by design)* |

---

## 📦 JSON Response Formats

**Chat Agent → Frontend**

```json
{
  "reply": "July generated the highest revenue.",
  "charts": [
    {
      "type": "bar",
      "title": "Revenue by Category",
      "labels": ["Rice", "Beverages", "Snacks"],
      "datasets": [{ "label": "Revenue", "data": [120000, 84000, 62000] }]
    }
  ]
}
```

**Monthly Report Agent → Render Template (excerpt)**

```json
{
  "month": "July",
  "kpi": {
    "totalRevenue": 1250000,
    "totalCOGS": 780000,
    "totalGrossProfit": 470000,
    "avgGrossMargin": 37.6,
    "totalUnitsSold": 8420
  },
  "analysisText": "Revenue reached ₱1,250,000 in July...",
  "prediction": { "available": true, "text": "Revenue is projected to rise..." },
  "topMargin": [{ "name": "Product A", "marginPct": 52.14 }],
  "lowMargin": [{ "name": "Product B", "marginPct": 8.02 }],
  "categoryRevenue": [{ "category": "Beverages", "revenue": 320000 }],
  "recommendations": [{ "problem": "Low margin on Product B", "action": "Review supplier pricing" }]
}
```

---

## 💡 Example Questions (Chat Assistant)

```
What was the highest selling product in March?
Show revenue trends from January to July.
Which category generated the highest profit?
Compare revenue between February and June.
What is the average gross margin for July?
Which month performed the best overall?
```

## 📸 Screenshots

### Dashboard — Overall Report
<img width="1850" height="884" alt="image" src="https://github.com/user-attachments/assets/190a58f3-9688-42a8-b9f5-3fbd2f273046" />
<img width="1821" height="494" alt="image" src="https://github.com/user-attachments/assets/db913be1-3ff9-4d3a-b2bd-bcfac0a3b777" />


### Monthly Report
<img width="1400" alt="Monthly Report" src="PASTE_URL_HERE" />
<img width="1828" height="584" alt="image" src="https://github.com/user-attachments/assets/0b36fa9b-a43b-4d87-b386-d5cda35da693" />



### AI Chat Assistant


### n8n AI Agent Workflow — Monthly Report Automation
<img width="1076" height="244" alt="image" src="https://github.com/user-attachments/assets/308f67a7-7170-4b2b-bb93-e51032d58c35" />

