import { Router } from "express";
import { getMarketIndicesOverview } from "../services/marketIndicesService.js";

const router = Router();

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
