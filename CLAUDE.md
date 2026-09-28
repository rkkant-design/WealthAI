# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev           # tsx server.ts — Express + Vite middleware on http://localhost:3000
npm run lint          # tsc --noEmit (type check only; there is no ESLint and no test suite)
npm run build:client  # vite build -> dist/  (what Netlify runs)
npm run build         # client build + esbuild-bundled server -> dist/server.cjs (Cloud Run / Docker)
npm start             # node dist/server.cjs (requires NODE_ENV=production to serve dist/)
```

Local dev needs `.env` (copy `.env.example`; `GEMINI_API_KEY` is optional — AI features degrade to an "unavailable" state without it) and a filled `firebase-applet-config.json`.

## Architecture

WealthPilot AI is an NSE/BSE (Indian equities) research app: React 19 SPA + a small API that proxies Yahoo Finance (live prices) and Gemini (AI analysis + copilot).

### Two deployment targets share one set of services

- **Netlify (current production, https://aiwealthpilot.netlify.app):** `vite build` output served statically; each `/api/*` route is a separate Netlify Function in `netlify/functions/*`, mapped by redirects in `netlify.toml`. `server.ts` is **not** used on Netlify.
- **Cloud Run / Docker:** `server.ts` runs Express, mounts the routers in `server/routes/*`, and serves `dist/` (or Vite middleware in dev).

Both layers are thin wrappers over `server/services/*`, `server/gemini.ts`, and `server/config.ts`. **When adding or changing an API endpoint, update both the Express router and the matching Netlify function, and add a redirect in `netlify.toml` (API redirects must stay above the `/*` SPA fallback).** Some logic is duplicated between the two today (e.g. the copilot handler in `server/routes/copilot.ts` and `netlify/functions/copilot.ts`).

### Serverless constraints that shape the code

- Netlify Functions time out at ~10s. Gemini calls are kept inside that budget by capping `maxOutputTokens` (copilot 900, stock analysis 2048) and keeping prompts concise. If AI features start returning fallback/"unavailable" content on Netlify, this timeout is the first suspect — don't raise token limits without accounting for it.
- The in-memory rate limiter (`server/middleware/rateLimit.ts`) and the 6-hour stock-analysis cache (`server/services/stockAnalysisService.ts`) are per-process, so they don't persist across Netlify invocations. They only really work on the Express/Cloud Run path.
- Gemini model ids come from `CONFIG.GEMINI_MODEL` / `CONFIG.GEMINI_FALLBACK_MODEL` (env-configurable); every call tries the primary then the fallback. Don't hardcode model names elsewhere.

### Data honesty rules (product requirement)

- Prices, 52-week ranges and history are live (Yahoo Finance, `server/services/stockQuoteService.ts`). Day change must use `regularMarketPreviousClose`, not `chartPreviousClose` (the latter is the start of the chart range and produced a bogus −37% day change).
- Fundamentals, valuation, scores and recommendations are Gemini-generated per company in `stockAnalysisService.ts` and must stay flagged via `analysisSource: 'ai_estimate'`. When Gemini is unavailable the service returns `analysisSource: 'unavailable'` with neutral values — never invent company-specific numbers or reintroduce hardcoded "fundamentals" presented as real.
- Don't show demo/mock data (`src/data/mockData.ts`) as if it were the user's real portfolio; empty states should reflect the actual account.
- `/api/market-pulse` (`server/services/marketPulseService.ts`) supplies live global factors, NSE sector indices and a rule-based market reading (NIFTY vs 50-day average, India VIX bands, sector breadth). Failed symbols are omitted, never replaced with sample numbers. `/api/market-overview` returns `live: false` when it falls back to hardcoded indices — the client must not label those as live.
- Sections still backed by `mockData.ts` (FII/DII flows, Indian macro indicators, sector profile cards, opportunities, monthly plan, action cards, daily brief) must carry `SampleDataNotice` / `SampleBadge` (`src/components/SampleDataNotice.tsx`, plus the `SAMPLE_DATA_PAGES` map in `App.tsx`). Remove the label only when the section is wired to a real source.

### Frontend

- `src/context/WealthContext.tsx` is the single global store (auth state, active tab, portfolio, watchlist, alerts, profile, market overview, stock lookups) and is where the client calls `/api/*`. Most components read/write through `useWealth()`.
- Navigation is state-driven, not URL-routed: `activeTab` in the context selects the view in `src/App.tsx`. Logged-out users see `HomePage`/`LoginScreen` (via `authView`).
- Persistence is localStorage first (`wealthpilot_*` keys), with cloud sync to Firestore `users/{uid}` via helpers in `src/lib/firebase.ts`.
- `src/data/allStocksData.ts` is a client-side stock catalogue; `server/services/stockQuoteService.ts` has its own `KNOWN_INDIAN_STOCKS` symbol map for resolution.
- Styling is Tailwind v4 (via `@tailwindcss/vite`), dark slate theme. Form inputs are ≥16px to prevent mobile Safari zoom.

### Auth & security

- Auth is Firebase Authentication only (email/password + Google popup). The app must never store or compare passwords itself.
- `firestore.rules` restricts each user to `users/{uid}`; everything else is denied. There is intentionally no global `accounts` collection.
- `firebase-applet-config.json` holds the Firebase **web** config and is committed on purpose (it's public by design). `GEMINI_API_KEY` is server-side only and must never reach client code.

## Branches & deployment

Active work is on `production-hardening`, which Netlify deploys from. Netlify builds take ~2–4 minutes, so a stale bundle right after a push usually means it's still building. See `DEPLOYMENT.md` for Firebase/Netlify/Cloud Run setup and the production checklist.
