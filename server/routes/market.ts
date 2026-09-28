import { Router } from "express";
import { getMarketIndicesOverview } from "../services/marketIndicesService.js";
import { getMarketPulse } from "../services/marketPulseService.js";

const router = Router();

// GET /api/market-pulse — live global factors, sector indices and derived regime
router.get("/market-pulse", async (_req, res) => {
  try {
    const data = await getMarketPulse();
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.json(data);
  } catch (err: any) {
    console.error("Market pulse error:", err);
    return res.status(500).json({ error: "Failed to fetch market pulse" });
  }
});

// GET /api/market-overview
router.get("/market-overview", async (_req, res) => {
  try {
    const data = await getMarketIndicesOverview();
    return res.json({
      status: "success",
      ...data,
    });
  } catch (err: any) {
    console.error("Market overview error:", err);
    return res.status(500).json({ error: "Failed to fetch market overview" });
  }
});

export default router;
