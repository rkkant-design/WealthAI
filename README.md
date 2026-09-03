# WealthPilot AI 🚀
### Enterprise-Grade NSE & BSE Investment Intelligence & Portfolio Copilot

WealthPilot AI is an AI-powered personal equity investment intelligence platform built specifically for long-term Indian retail and high-net-worth investors. It combines real-time NSE/BSE market data, institutional-grade fundamental valuation models (9-Factor Wealth Score), automated portfolio risk & concentration auditing, and a Gemini-powered investment copilot.

---

## 🌟 Key Features

1. **Live NSE & BSE Market Data Engine**:
   - Direct real-time quotes, 52-week highs/lows, daily changes, and historical price closes.
   - Comprehensive symbol resolution across NSE and BSE tickers with automatic ticker normalization.
   - **Penny Stock & Microcap Advisory Guard**: Automated risk detection for stocks trading under ₹20 or with microcap market capitalization (< ₹50 Cr), flagging illiquidity, promoter pledging, and operator risk.

2. **9-Factor Wealth Score & Valuation Engine**:
   - Evaluates fundamental business quality, return on capital (ROCE / ROE), balance sheet leverage, and cash flow generation.
   - Computes fair-value estimates, preferred entry zones, and margin-of-safety discounts.

3. **Gemini 2.5 Flash Investment Copilot**:
   - Grounded in disciplined long-term wealth accumulation principles (5–20 year retirement horizon).
   - Provides reasoned thesis breakdowns, margin-of-safety checks, and "what would change the recommendation" contrarian stress tests.

4. **Interactive Execution Engine**:
   - Order execution modal supporting Market and Limit order pricing, real-time STT & exchange transaction fee calculations, and cash reserve validation.

5. **Automated Portfolio Health & Risk Audit**:
   - Continuous sector concentration analysis (alerts when Banking, IT, or any single sector exceeds 25%).
   - One-click CSV and JSON export for tax filing and audit reporting.

6. **Systematic Monthly Allocation (SIP Planner)**:
   - Dynamic monthly budget allocation optimizer that prioritizes quality compounders trading in their preferred entry zones.

---

## 🏗️ Architecture & Tech Stack

```text
├── server/                     # Modular Node.js / Express Backend Architecture
│   ├── config.ts               # Environment and runtime configurations
│   ├── gemini.ts               # Google GenAI SDK client & prompts
│   ├── services/
│   │   ├── stockQuoteService.ts      # Live NSE/BSE quote & penny stock engine
│   │   ├── marketIndicesService.ts   # NIFTY 50, SENSEX, BANK NIFTY indices
│   │   └── ...
│   └── routes/
│       ├── health.ts           # /api/health endpoint
│       ├── stocks.ts           # /api/stock-quote & /api/stock-search
│       ├── market.ts           # /api/market-overview
│       ├── copilot.ts          # /api/copilot (Gemini intelligence)
│       └── portfolio.ts        # /api/portfolio/export-csv & /api/portfolio/audit
├── src/                        # Modern React 19 Frontend
│   ├── components/             # Reusable UI modules (Analyzer, Portfolio, SIP, Modals)
│   ├── context/                # Global state management (WealthContext)
│   ├── data/                   # Indian equities database & financial history
│   └── types.ts                # TypeScript strict interface definitions
├── server.ts                   # Express server entry point with Vite middleware
├── Dockerfile                  # Multi-stage production container setup
└── package.json                # Dependencies and build scripts
```

- **Frontend**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Lucide Icons, Recharts, Motion.
- **Backend**: Node.js 22, Express 4.21, `@google/genai` TypeScript SDK.
- **Build System**: Vite client build + `esbuild` bundled CJS server (`dist/server.cjs`).

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20+ or 22+
- npm 10+

### 2. Installation
```bash
git clone <your-repository-url>
cd wealthpilot-ai
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and set your configuration:
```bash
cp .env.example .env
```
Inside `.env`:
```env
PORT=3000
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Containerization

### Standard Build
```bash
npm run build
npm start
```

### Docker Build & Run
```bash
# Build the production Docker image
docker build -t wealthpilot-ai .

# Run container on port 3000
docker run -p 3000:3000 -e GEMINI_API_KEY="your-key" wealthpilot-ai
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status, uptime, and Gemini readiness. |
| `GET` | `/api/market-overview` | Real-time NIFTY 50, SENSEX, and market session status. |
| `GET` | `/api/stock-quote?query=:symbol` | Live NSE/BSE stock quote, 52W range, and wealth score. |
| `GET` | `/api/stock-search?q=:query` | Search autocomplete for Indian equities. |
| `POST` | `/api/copilot` | Context-aware AI investment advisory powered by Gemini. |
| `POST` | `/api/portfolio/audit` | Comprehensive concentration & penny stock portfolio audit. |
| `POST` | `/api/portfolio/export-csv` | Generates a downloadable CSV portfolio performance report. |

---

## 🚢 Exporting to GitHub

You can push this product to your personal or organization GitHub repository using either method:

### Option A: 1-Click AI Studio Export (Recommended)
1. In the AI Studio interface, open the **Settings** or **Project** menu in the top-right corner.
2. Select **Export to GitHub** (or **Download ZIP**).
3. Authorize your GitHub account and specify your target repository name. AI Studio will automatically push all source files and history.

### Option B: Using Git CLI
```bash
# Initialize remote (replace with your GitHub repository URL)
git remote add origin https://github.com/<your-username>/wealthpilot-ai.git

# Rename branch to main
git branch -M main

# Push to your GitHub repository
git push -u origin main
```

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
