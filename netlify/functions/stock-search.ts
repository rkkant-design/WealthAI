import { KNOWN_INDIAN_STOCKS } from "../../server/services/stockQuoteService.js";

// GET /api/stock-search?q=... (mapped via netlify.toml)
export default async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim().toUpperCase();
    if (!q) {
      return Response.json({ results: [] });
    }

    const matches = Object.entries(KNOWN_INDIAN_STOCKS)
      .filter(([key, val]) => key.includes(q) || val.name.toUpperCase().includes(q) || val.symbol.includes(q))
      .map(([, val]) => ({
        symbol: val.symbol,
        name: val.name,
        sector: val.sector,
        isPenny: val.isPenny || false,
        marketCap: val.approxMcap,
      }));

    const unique = Array.from(new Map(matches.map((m) => [m.symbol, m])).values());
    return Response.json({ results: unique.slice(0, 8) });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
