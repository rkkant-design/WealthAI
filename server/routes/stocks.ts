import { Router } from "express";
import { resolveStockQuote, KNOWN_INDIAN_STOCKS } from "../services/stockQuoteService.js";

const router = Router();

// GET /api/stock-quote?query=...
router.get("/stock-quote", async (req, res) => {
  try {
    const queryParam = (req.query.symbol as string || req.query.query as string || "").trim();
    if (!queryParam) {
      return res.status(400).json({ error: "Missing stock symbol or search query" });
    }

    const result = await resolveStockQuote(queryParam);
    if (!result) {
      return res.status(404).json({
        error: `Could not fetch live market data for "${queryParam}". Please verify the NSE/BSE ticker.`
      });
    }

    // Honest labelling: the PRICE is a live exchange feed, but the fundamental
    // analysis is an AI estimate (or unavailable). Do not conflate the two.
    return res.json({
      source: "live_price_feed",
      priceSource: "yahoo_finance_live",
      analysisSource: result.stock.analysisSource || "ai_estimate",
      disclaimer:
        "Price, 52-week range and history are live market data. Fundamentals, valuation, scores and recommendations are AI-generated estimates for research/education only — not audited data or investment advice.",
      exchange: result.exchange,
      symbol: result.baseSymbol,
      ticker: result.matchedSymbol,
      stock: result.stock,
    });
  } catch (err: any) {
    console.error("Stock quote router error:", err);
    return res.status(500).json({ error: err.message || "Failed to resolve quote" });
  }
});

// GET /api/stock-search?q=...
router.get("/stock-search", async (req, res) => {
  try {
    const q = (req.query.q as string || "").trim().toUpperCase();
    if (!q) {
      return res.json({ results: [] });
    }

    // Match known stocks
    const matches = Object.entries(KNOWN_INDIAN_STOCKS)
      .filter(([key, val]) => key.includes(q) || val.name.toUpperCase().includes(q) || val.symbol.includes(q))
      .map(([, val]) => ({
        symbol: val.symbol,
        name: val.name,
        sector: val.sector,
        isPenny: val.isPenny || false,
        marketCap: val.approxMcap,
      }));

    // Deduplicate by symbol
    const unique = Array.from(new Map(matches.map(m => [m.symbol, m])).values());
    return res.json({ results: unique.slice(0, 8) });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
