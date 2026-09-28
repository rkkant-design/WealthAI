import { Request, Response, NextFunction } from "express";
import { CONFIG } from "../config.js";

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * The public API endpoints (stock quotes, Gemini copilot) are unauthenticated
 * proxies to third-party services that cost money / can be abused, so we cap
 * per-client request volume. This is intentionally dependency-free (no redis)
 * because Cloud Run instances are short-lived; for multi-instance hardening,
 * move this to a shared store. Good enough to stop trivial scraping/quota burn.
 */
export function createRateLimiter(options?: { max?: number; windowMs?: number; keyPrefix?: string }) {
  const max = options?.max ?? CONFIG.RATE_LIMIT_MAX;
  const windowMs = options?.windowMs ?? CONFIG.RATE_LIMIT_WINDOW_MS;
  const keyPrefix = options?.keyPrefix ?? "default";
  const buckets = new Map<string, Bucket>();

  // Opportunistic cleanup so the map does not grow unbounded.
  const sweep = () => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  };

  return (req: Request, res: Response, next: NextFunction) => {
    const ip =
      (req.headers["x-forwarded-for"] as string || "").split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

    if (buckets.size > 5000) sweep();

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    const remaining = Math.max(0, max - bucket.count);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({
        error: "Too many requests. Please slow down and try again shortly.",
        retryAfterSeconds: retryAfter,
      });
    }

    next();
  };
}
