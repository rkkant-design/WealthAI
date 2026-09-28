import { getMarketPulse } from "../../server/services/marketPulseService.js";

// GET /api/market-pulse (mapped via netlify.toml)
export default async (): Promise<Response> => {
  try {
    const data = await getMarketPulse();
    return Response.json(data, {
      // Let the CDN reuse a result for a few minutes; function instances don't share memory.
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  } catch (err: any) {
    console.error("Market pulse function error:", err);
    return Response.json({ error: "Failed to fetch market pulse" }, { status: 500 });
  }
};
