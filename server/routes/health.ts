import { Router } from "express";
import { CONFIG } from "../config.js";

const router = Router();
const startTime = Date.now();

// GET /api/health
router.get("/health", (_req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    status: "healthy",
    product: "WealthPilot AI",
    version: CONFIG.VERSION,
    environment: CONFIG.NODE_ENV,
    uptime: `${uptimeSeconds}s`,
    hasGeminiKey: !!CONFIG.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

export default router;
