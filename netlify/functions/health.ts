import { CONFIG } from "../../server/config.js";

// GET /api/health (mapped via netlify.toml)
export default async (): Promise<Response> => {
  return Response.json({
    status: "healthy",
    product: "WealthPilot AI",
    version: CONFIG.VERSION,
    environment: CONFIG.NODE_ENV,
    platform: "netlify-functions",
    hasGeminiKey: !!CONFIG.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
};
