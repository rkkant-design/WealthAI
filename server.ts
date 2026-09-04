import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { CONFIG } from "./server/config.js";

// Import modular API routers
import healthRouter from "./server/routes/health.js";
import stocksRouter from "./server/routes/stocks.js";
import marketRouter from "./server/routes/market.js";
import copilotRouter from "./server/routes/copilot.js";
import portfolioRouter from "./server/routes/portfolio.js";

async function startServer() {
  const app = express();
  const PORT = CONFIG.PORT;

  // Global Middlewares
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));

  // Basic CORS & Security Headers
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

  // Request logger for development
  if (CONFIG.NODE_ENV !== "production") {
    app.use((req: Request, _res: Response, next: NextFunction) => {
      console.log(`[API] ${req.method} ${req.path}`);
      next();
    });
  }

  // Mount API Endpoints
  app.use("/api", healthRouter);
  app.use("/api", stocksRouter);
  app.use("/api", marketRouter);
  app.use("/api", copilotRouter);
  app.use("/api/portfolio", portfolioRouter);

  // Global Error Handler for API
  app.use("/api", (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[API Error]", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message || "An unexpected error occurred",
    });
  });

  // Vite middleware for development vs static asset serving for production
  if (CONFIG.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(
      express.static(distPath, {
        maxAge: "1d",
        setHeaders: (res, filePath) => {
          if (filePath.includes("/assets/")) {
            // Immutable cache for fingerprinted JS/CSS/asset bundles
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          } else if (filePath.endsWith(".html")) {
            // HTML files should never be cached so users always get fresh app releases
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          }
        },
      })
    );
    app.get("*", (_req: Request, res: Response) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, CONFIG.HOST, () => {
    console.log(`🚀 WealthPilot AI production server running at http://${CONFIG.HOST}:${PORT}`);
    console.log(`📡 Environment: ${CONFIG.NODE_ENV} | Gemini Key: ${CONFIG.GEMINI_API_KEY ? "Configured" : "Not Detected"}`);
  });

  // Graceful shutdown handling for Cloud Run container lifecycle
  const handleShutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("Closed all active HTTP connections. Process exiting.");
      process.exit(0);
    });

    // Force exit if hanging after 8 seconds
    setTimeout(() => {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 8000).unref();
  };

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
}

startServer().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
