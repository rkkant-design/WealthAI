import { getMarketIndicesOverview } from "../../server/services/marketIndicesService.js";

// GET /api/market-overview (mapped via netlify.toml)
export default async (): Promise<Response> => {
  try {
    const data = await getMarketIndicesOverview();
    return Response.json({ status: "success", ...data });
  } catch (err: any) {
    console.error("Market overview function error:", err);
    return Response.json({ error: "Failed to fetch market overview" }, { status: 500 });
  }
};
