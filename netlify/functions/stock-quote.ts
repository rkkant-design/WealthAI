import { resolveStockQuote } from "../../server/services/stockQuoteService.js";

// GET /api/stock-quote?query=... (mapped via netlify.toml)
export default async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const queryParam = (url.searchParams.get("symbol") || url.searchParams.get("query") || "").trim();
    if (!queryParam) {
      return Response.json({ error: "Missing stock symbol or search query" }, { status: 400 });
    }

    const result = await resolveStockQuote(queryParam);
    if (!result) {
      return Response.json(
        { error: `Could not fetch live market data for "${queryParam}". Please verify the NSE/BSE ticker.` },
        { status: 404 }
      );
    }

    return Response.json({
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
    console.error("Stock quote function error:", err);
    return Response.json({ error: err.message || "Failed to resolve quote" }, { status: 500 });
  }
};
