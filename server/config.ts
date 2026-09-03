import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
  PORT: Number(process.env.PORT) || 3000,
  HOST: "0.0.0.0",
  NODE_ENV: process.env.NODE_ENV || "development",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  VERSION: "1.0.0",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
};
