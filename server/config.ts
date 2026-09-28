import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
  PORT: Number(process.env.PORT) || 3000,
  HOST: "0.0.0.0",
  NODE_ENV: process.env.NODE_ENV || "development",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  // Model ids are configurable so we never hardcode a stale name across files.
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-3.8-flash",
  GEMINI_FALLBACK_MODEL: process.env.GEMINI_FALLBACK_MODEL || "gemini-3.6-flash",
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  VERSION: "1.0.0",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  // Simple abuse protection for the unauthenticated Gemini/proxy endpoints.
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 30,
  COPILOT_RATE_LIMIT_MAX: Number(process.env.COPILOT_RATE_LIMIT_MAX) || 12,
};
