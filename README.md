# 📊 AI Data Analysis Assistant

An AI-powered data analysis assistant that enables users to ask natural language questions about sales and inventory data. The application uses a React frontend, an n8n AI workflow, Google Gemini, and Google Sheets to provide business insights with automatically generated charts.

---

## 🚀 Features

- 💬 Chat interface for asking questions about sales data
- 📈 Automatic chart generation (Bar, Line, Pie)
- 🧠 AI-powered data analysis using Google Gemini
- 📊 Reads live data directly from Google Sheets
- 🗓️ Supports monthly sales analysis (January – July)
- 💾 Conversation memory using email-based sessions
- 🔗 Webhook integration between React and n8n
- 📱 Responsive modern UI built with React & Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Recharts

### Backend / Automation
- n8n
- Google Gemini
- Google Sheets API
- Webhooks

---

# Architecture

```text
                React Frontend
                      │
                POST Request
                      │
               n8n Webhook Trigger
                      │
               Validate Request
                      │
                Google Gemini AI
              (LangChain Agent)
                      │
      ┌───────────────┴───────────────┐
      │                               │
Conversation Memory          Google Sheets Tool
 (Email Session)             (Sales Dataset)
      │                               │
      └───────────────┬───────────────┘
                      │
            AI Generates JSON Response
                      │
          Format & Validate JSON Output
                      │
             Respond to React Frontend
                      │
      Display Answer + Interactive Charts
```

---

# How It Works

1. User enters their email address and question.
2. React sends the request to an n8n webhook.
3. n8n validates the request.
4. Google Gemini receives the prompt.
5. The AI reads data from Google Sheets when necessary.
6. Gemini performs calculations and analysis.
7. The AI returns:
   - Business-friendly explanation
   - Chart configuration (if appropriate)
8. React renders the response and visualizes the charts using Recharts.

---

# Supported Charts

The AI automatically determines the appropriate visualization.

### 📊 Bar Chart

Used for comparing values between products or categories.

Examples:

- Revenue by Product
- Gross Profit by Category
- Units Sold by Product

---

### 📈 Line Chart

Used for trends over time.

Examples:

- Monthly Revenue
- Monthly Gross Profit
- Sales Trend

---

### 🥧 Pie Chart

Used for share-of-whole analysis.

Examples:

- Revenue Share by Category
- Product Contribution
- Category Distribution

---

# AI Capabilities

The assistant can answer questions such as:

- What was the highest selling product in March?
- Show revenue trends from January to July.
- Which category generated the highest profit?
- Compare revenue between February and June.
- Which products have the lowest remaining stock?
- Show the top 5 products by gross profit.
- What is the average gross margin for July?
- Which month performed the best overall?

---

# Data Source

The AI reads data from Google Sheets with separate tabs for each month.

| Month |
|-------|
| January |
| February |
| March |
| April |
| May |
| June |
| July |

Each sheet contains:

| Column |
|--------|
| Product Name |
| Category |
| Units Sold |
| Unit Cost |
| Unit Price |
| Revenue |
| COGS |
| Gross Profit |
| Gross Margin (%) |
| Stock Remaining |

---

# JSON Response Format

The AI returns structured JSON for the frontend.

```json
{
  "reply": "July generated the highest revenue.",
  "charts": [
    {
      "type": "bar",
      "title": "Revenue by Category",
      "labels": [
        "Rice",
        "Beverages",
        "Snacks"
      ],
      "datasets": [
        {
          "label": "Revenue",
          "data": [
            120000,
            84000,
            62000
          ]
        }
      ]
    }
  ]
}
```

---

# Frontend Features

- Email-based conversation sessions
- Auto-scroll chat
- Loading indicator
- Error handling
- Responsive layout
- Interactive charts
- Multiple charts per response
- Clean chat UI

---

# n8n Workflow

The workflow consists of:

- Webhook Trigger
- Request Validation
- Google Gemini AI Agent
- Conversation Memory
- Google Sheets Tool
- JSON Formatter
- Webhook Response

The workflow ensures that:

- User input is validated
- AI always fetches live spreadsheet data
- Monthly tabs are selected dynamically
- Responses are returned in a consistent JSON format
- Invalid responses are normalized before reaching the frontend

---

# Example Questions

```
What was the highest revenue product in July?

Compare revenue between January and July.

Show revenue by category.

Which products have the lowest stock remaining?

Which category generated the highest gross profit?

Show a monthly revenue trend.

What products have the highest gross margin?

Compare gross profit across all months.
```

---


# Demo

<img width="1419" height="525" alt="image" src="https://github.com/user-attachments/assets/73ff8c39-a50c-4bac-a6d7-d74083c7b9d7" />
<img width="1541" height="482" alt="image" src="https://github.com/user-attachments/assets/2ec8ef59-5376-4312-ae23-e7a1d9cebc9b" />


---

