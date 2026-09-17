import { getGeminiClient } from "../gemini.js";
import { CONFIG } from "../config.js";

/**
 * Company-specific fundamental/valuation analysis.
 *
 * IMPORTANT (data integrity): earlier versions returned an IDENTICAL hardcoded
 * block for every non-penny stock and labelled it "live institutional data".
 * That was misleading. This service instead asks Gemini to produce a genuinely
 * company-specific ESTIMATE from the live price context, and every caller must
 * surface it as an AI estimate (`analysisSource: 'ai_estimate'`), never as
 * audited exchange data. When Gemini is unavailable we return a neutral,
 * clearly-unavailable fallback rather than inventing specific numbers.
 */

export type AnalysisSource = "ai_estimate" | "unavailable";

export interface StockAnalysisInput {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  changePercent: number;
  week52High: number;
  week52Low: number;
  marketCap: string;
  marketCapCategory: string;
  isPennyStock: boolean;
  historicalCloses: { date: string; close: number }[];
}

export interface StockAnalysis {
  analysisSource: AnalysisSource;
  wealthScore: number;
  scoreBreakdown: {
    fundamentalQuality: number;
    growth: number;
    financialStrength: number;
    competitiveAdvantage: number;
    management: number;
    valuation: number;
    marketTrend: number;
    entryPoint: number;
    portfolioFit: number;
  };
  fundamentals: {
    revenueGrowth5Yr: string;
    profitGrowth5Yr: string;
    epsGrowth: string;
    roe: string;
    roce: string;
    operatingMargin: string;
    debtToEquity: string;
    freeCashFlow: string;
    dividendYield: string;
  };
  financialHistory: {
    year: string;
    revenue: number;
    profit: number;
    eps: number;
    roce: number;
    fcf: number;
    operatingMargin: number;
  }[];
  valuationEngine: {
    currentPe: number;
    historicalPe5YrAvg: number;
    sectorPe: number;
    peg: number;
    pb: number;
    evEbitda: number;
    dividendYield: number;
    status: "ATTRACTIVE" | "FAIR" | "SLIGHTLY EXPENSIVE" | "EXPENSIVE";
    explanation: string;
  };
  entryPointEngine: {
    currentPrice: number;
    preferredEntryLow: number;
    preferredEntryHigh: number;
    strongBuyZone: number;
    fairValueEstimate: number;
    entryRating: string;
    entryScore: number;
    distanceToPreferredZonePercent: number;
    inZone: boolean;
    reasons: string[];
  };
  recommendation: {
    type: string;
    suggestedAmount: number;
    portfolioFitScore: number;
    risk: "Low" | "Medium" | "High";
    horizon: string;
    confidence: number;
    whyFitsYou: string[];
    whyNotBuy: string[];
    whatWouldChangeMind: string[];
  };
  riskAnalysis: {
    overall: "LOW" | "MEDIUM" | "HIGH";
    businessRisk: number;
    valuationRisk: number;
    debtRisk: number;
    sectorRisk: number;
    regulatoryRisk: number;
    marketRisk: number;
    managementRisk: number;
  };
  investmentThesis: {
    summary: string;
    validIf: string[];
    reconsiderIf: string[];
  };
}

interface CacheEntry {
  data: StockAnalysis;
  expiresAt: number;
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h – fundamentals move slowly; keeps Gemini cost/latency down
const cache = new Map<string, CacheEntry>();

const round = (n: number, dp = 2) => Number(n.toFixed(dp));

/**
 * Entry zones are pure math off the live price / 52w range, so we compute them
 * deterministically rather than asking the model to invent them.
 */
function deriveEntryPoints(input: StockAnalysisInput) {
  const p = input.currentPrice;
  const low = input.isPennyStock ? p * 0.7 : p * 0.92;
  const high = input.isPennyStock ? p * 0.85 : p * 1.02;
  const strong = input.isPennyStock ? p * 0.6 : p * 0.85;
  const fair = input.isPennyStock ? p * 0.8 : p * 1.15;
  const inZone = !input.isPennyStock && p >= low && p <= high;
  const distance = inZone ? 0 : round(Math.abs(((p - high) / p) * 100), 1);
  return {
    preferredEntryLow: round(low),
    preferredEntryHigh: round(high),
    strongBuyZone: round(strong),
    fairValueEstimate: round(fair),
    inZone,
    distanceToPreferredZonePercent: distance,
  };
}

/**
 * Neutral, honest fallback used when Gemini is unavailable. It does NOT fabricate
 * company-specific numbers; scores are neutral and text says analysis is pending.
 */
function buildNeutralFallback(input: StockAnalysisInput): StockAnalysis {
  const entry = deriveEntryPoints(input);
  const penny = input.isPennyStock;
  return {
    analysisSource: "unavailable",
    wealthScore: penny ? 22 : 50,
    scoreBreakdown: {
      fundamentalQuality: penny ? 20 : 50,
      growth: 50,
      financialStrength: penny ? 20 : 50,
      competitiveAdvantage: 50,
      management: 50,
      valuation: 50,
      marketTrend: 50,
      entryPoint: entry.inZone ? 60 : 45,
      portfolioFit: penny ? 15 : 50,
    },
    fundamentals: {
      revenueGrowth5Yr: "Not available",
      profitGrowth5Yr: "Not available",
      epsGrowth: "Not available",
      roe: "Not available",
      roce: "Not available",
      operatingMargin: "Not available",
      debtToEquity: "Not available",
      freeCashFlow: "Not available",
      dividendYield: "Not available",
    },
    financialHistory: [],
    valuationEngine: {
      currentPe: 0,
      historicalPe5YrAvg: 0,
      sectorPe: 0,
      peg: 0,
      pb: 0,
      evEbitda: 0,
      dividendYield: 0,
      status: "FAIR",
      explanation:
        "AI fundamental analysis is temporarily unavailable. Live price and 52-week range are shown; please verify fundamentals from a primary source (company filings / exchange) before acting.",
    },
    entryPointEngine: {
      currentPrice: input.currentPrice,
      ...entry,
      entryRating: "REVIEW",
      entryScore: entry.inZone ? 55 : 45,
      reasons: [
        "Entry zone derived from live price and 52-week range.",
        "Fundamental scoring unavailable — treat as incomplete.",
      ],
    },
    recommendation: {
      type: penny ? "AVOID" : "REVIEW",
      suggestedAmount: 0,
      portfolioFitScore: penny ? 15 : 50,
      risk: penny ? "High" : "Medium",
      horizon: "5+ Years",
      confidence: 40,
      whyFitsYou: [],
      whyNotBuy: [
        "Automated fundamental analysis was unavailable for this request.",
        "Do not act on incomplete data — re-run analysis or verify manually.",
      ],
      whatWouldChangeMind: ["Successful generation of full fundamental analysis."],
    },
    riskAnalysis: {
      overall: penny ? "HIGH" : "MEDIUM",
      businessRisk: penny ? 85 : 50,
      valuationRisk: 50,
      debtRisk: penny ? 70 : 50,
      sectorRisk: 50,
      regulatoryRisk: 50,
      marketRisk: 50,
      managementRisk: 50,
    },
    investmentThesis: {
      summary: penny
        ? `${input.name} is a microcap/penny stock. Speculative and generally unsuitable for long-term retirement wealth creation.`
        : `Full AI thesis for ${input.name} is temporarily unavailable. Review the live price context and verify fundamentals independently.`,
      validIf: [],
      reconsiderIf: [],
    },
  };
}

// Robustly pull a JSON object out of a model response that may include code
// fences or surrounding prose.
function extractJson(text: string): any {
  const cleaned = text
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1));
    }
    throw new Error("No JSON object found in model response");
  }
}

function buildPrompt(input: StockAnalysisInput): string {
  const recentCloses = input.historicalCloses.slice(-10).map((c) => c.close);
  return `You are an equity research engine for Indian (NSE/BSE) stocks. Produce a company-specific fundamental & valuation ESTIMATE for the stock below, grounded in your knowledge of the company and the live market context provided. These are best-effort estimates, NOT audited figures.

Company: ${input.name} (${input.symbol})
Sector: ${input.sector}
Market cap: ${input.marketCap} (${input.marketCapCategory})
Live price: ₹${input.currentPrice} (today ${input.changePercent >= 0 ? "+" : ""}${input.changePercent}%)
52-week range: ₹${input.week52Low} – ₹${input.week52High}
Recent closes: ${recentCloses.join(", ")}
Penny/microcap flag: ${input.isPennyStock}

Return ONLY minified JSON (no markdown) with EXACTLY these keys and value types:
{
 "wealthScore": number 0-100,
 "scoreBreakdown": {"fundamentalQuality":n,"growth":n,"financialStrength":n,"competitiveAdvantage":n,"management":n,"valuation":n,"marketTrend":n,"entryPoint":n,"portfolioFit":n} (each 0-100),
 "fundamentals": {"revenueGrowth5Yr":s,"profitGrowth5Yr":s,"epsGrowth":s,"roe":s,"roce":s,"operatingMargin":s,"debtToEquity":s,"freeCashFlow":s,"dividendYield":s} (short strings e.g. "14.2% CAGR"),
 "financialHistory": [ {"year":"FY22","revenue":n,"profit":n,"eps":n,"roce":n,"fcf":n,"operatingMargin":n}, ... 5 entries FY22..FY26E, revenue/profit/fcf in ₹ Cr ],
 "valuationEngine": {"currentPe":n,"historicalPe5YrAvg":n,"sectorPe":n,"peg":n,"pb":n,"evEbitda":n,"dividendYield":n,"status":"ATTRACTIVE|FAIR|SLIGHTLY EXPENSIVE|EXPENSIVE","explanation":s},
 "recommendation": {"type":"STRONG BUY|BUY|ACCUMULATE|WATCH|HOLD|REVIEW|AVOID","portfolioFitScore":n,"risk":"Low|Medium|High","horizon":s,"confidence":n,"whyFitsYou":[s],"whyNotBuy":[s],"whatWouldChangeMind":[s]},
 "riskAnalysis": {"overall":"LOW|MEDIUM|HIGH","businessRisk":n,"valuationRisk":n,"debtRisk":n,"sectorRisk":n,"regulatoryRisk":n,"marketRisk":n,"managementRisk":n} (each 0-100),
 "investmentThesis": {"summary":s,"validIf":[s],"reconsiderIf":[s]}
}
Ground the numbers in the real company. For penny/microcap or loss-making names, be appropriately cautious. Long-term retirement investor lens (5-20y), strict margin of safety, no intraday speculation.`;
}

function coerceNumber(v: unknown, fallback = 0): number {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : fallback;
}

function clampScore(v: unknown): number {
  return Math.max(0, Math.min(100, Math.round(coerceNumber(v, 50))));
}

/**
 * Assemble a validated StockAnalysis from raw Gemini JSON, merging in the
 * deterministic entry-point math. Throws if the payload is unusable so the
 * caller falls back to the neutral analysis.
 */
function assembleFromRaw(raw: any, input: StockAnalysisInput): StockAnalysis {
  if (!raw || typeof raw !== "object" || !raw.scoreBreakdown || !raw.recommendation) {
    throw new Error("Gemini analysis payload missing required fields");
  }
  const entry = deriveEntryPoints(input);
  const sb = raw.scoreBreakdown || {};
  const ra = raw.riskAnalysis || {};
  const rec = raw.recommendation || {};
  const ve = raw.valuationEngine || {};

  const financialHistory = Array.isArray(raw.financialHistory)
    ? raw.financialHistory.slice(0, 5).map((h: any) => ({
        year: String(h?.year ?? ""),
        revenue: coerceNumber(h?.revenue),
        profit: coerceNumber(h?.profit),
        eps: coerceNumber(h?.eps),
        roce: coerceNumber(h?.roce),
        fcf: coerceNumber(h?.fcf),
        operatingMargin: coerceNumber(h?.operatingMargin),
      }))
    : [];

  const validStatus = ["ATTRACTIVE", "FAIR", "SLIGHTLY EXPENSIVE", "EXPENSIVE"];
  const status = validStatus.includes(ve.status) ? ve.status : "FAIR";
  const overall = ["LOW", "MEDIUM", "HIGH"].includes(ra.overall) ? ra.overall : "MEDIUM";
  const risk = ["Low", "Medium", "High"].includes(rec.risk) ? rec.risk : "Medium";

  const asStrArr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 5) : [];

  return {
    analysisSource: "ai_estimate",
    wealthScore: clampScore(raw.wealthScore),
    scoreBreakdown: {
      fundamentalQuality: clampScore(sb.fundamentalQuality),
      growth: clampScore(sb.growth),
      financialStrength: clampScore(sb.financialStrength),
      competitiveAdvantage: clampScore(sb.competitiveAdvantage),
      management: clampScore(sb.management),
      valuation: clampScore(sb.valuation),
      marketTrend: clampScore(sb.marketTrend),
      entryPoint: clampScore(sb.entryPoint),
      portfolioFit: clampScore(sb.portfolioFit),
    },
    fundamentals: {
      revenueGrowth5Yr: String(raw.fundamentals?.revenueGrowth5Yr ?? "N/A"),
      profitGrowth5Yr: String(raw.fundamentals?.profitGrowth5Yr ?? "N/A"),
      epsGrowth: String(raw.fundamentals?.epsGrowth ?? "N/A"),
      roe: String(raw.fundamentals?.roe ?? "N/A"),
      roce: String(raw.fundamentals?.roce ?? "N/A"),
      operatingMargin: String(raw.fundamentals?.operatingMargin ?? "N/A"),
      debtToEquity: String(raw.fundamentals?.debtToEquity ?? "N/A"),
      freeCashFlow: String(raw.fundamentals?.freeCashFlow ?? "N/A"),
      dividendYield: String(raw.fundamentals?.dividendYield ?? "N/A"),
    },
    financialHistory,
    valuationEngine: {
      currentPe: coerceNumber(ve.currentPe),
      historicalPe5YrAvg: coerceNumber(ve.historicalPe5YrAvg),
      sectorPe: coerceNumber(ve.sectorPe),
      peg: coerceNumber(ve.peg),
      pb: coerceNumber(ve.pb),
      evEbitda: coerceNumber(ve.evEbitda),
      dividendYield: coerceNumber(ve.dividendYield),
      status,
      explanation: String(ve.explanation ?? "AI valuation estimate."),
    },
    entryPointEngine: {
      currentPrice: input.currentPrice,
      ...entry,
      entryRating: String(rec.type ?? "REVIEW"),
      entryScore: clampScore(sb.entryPoint),
      reasons: asStrArr(raw.entryPointEngine?.reasons).length
        ? asStrArr(raw.entryPointEngine?.reasons)
        : ["Entry zone derived from live price and 52-week range."],
    },
    recommendation: {
      type: String(rec.type ?? "REVIEW"),
      suggestedAmount: Math.max(0, Math.round(coerceNumber(rec.suggestedAmount, 0))),
      portfolioFitScore: clampScore(rec.portfolioFitScore),
      risk,
      horizon: String(rec.horizon ?? "5+ Years"),
      confidence: clampScore(rec.confidence),
      whyFitsYou: asStrArr(rec.whyFitsYou),
      whyNotBuy: asStrArr(rec.whyNotBuy),
      whatWouldChangeMind: asStrArr(rec.whatWouldChangeMind),
    },
    riskAnalysis: {
      overall,
      businessRisk: clampScore(ra.businessRisk),
      valuationRisk: clampScore(ra.valuationRisk),
      debtRisk: clampScore(ra.debtRisk),
      sectorRisk: clampScore(ra.sectorRisk),
      regulatoryRisk: clampScore(ra.regulatoryRisk),
      marketRisk: clampScore(ra.marketRisk),
      managementRisk: clampScore(ra.managementRisk),
    },
    investmentThesis: {
      summary: String(raw.investmentThesis?.summary ?? `AI thesis estimate for ${input.name}.`),
      validIf: asStrArr(raw.investmentThesis?.validIf),
      reconsiderIf: asStrArr(raw.investmentThesis?.reconsiderIf),
    },
  };
}

export async function generateStockAnalysis(input: StockAnalysisInput): Promise<StockAnalysis> {
  const cacheKey = input.symbol.toUpperCase();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const ai = getGeminiClient();
  if (!ai) {
    return buildNeutralFallback(input);
  }

  const prompt = buildPrompt(input);
  // Ask for JSON in the prompt (not via responseMimeType, which some models
  // reject) and try the primary model, then the fallback — same pattern as the
  // copilot route, which works reliably.
  // Cap the model call so the parent (serverless) function does not hit its
  // ~10s timeout — degrade to the neutral fallback instead.
  const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> =>
    Promise.race([
      p,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error("analysis timeout")), ms)),
    ]);

  const callModel = async (model: string, ms: number): Promise<string> => {
    const response = await withTimeout(
      ai.models.generateContent({ model, contents: prompt, config: { temperature: 0.3 } }),
      ms
    );
    return response.text || "";
  };

  try {
    let text = "";
    const start = Date.now();
    try {
      text = await callModel(CONFIG.GEMINI_MODEL, 8500);
    } catch (primaryErr: any) {
      console.warn(`Analysis primary model error (${CONFIG.GEMINI_MODEL}):`, primaryErr?.message);
      // Only try the fallback model if the primary failed fast (a real API error,
      // not a timeout) — otherwise we would blow the serverless time budget.
      if (Date.now() - start < 3000) {
        text = await callModel(CONFIG.GEMINI_FALLBACK_MODEL, 5000);
      } else {
        throw primaryErr;
      }
    }
    const raw = extractJson(text);
    const analysis = assembleFromRaw(raw, input);
    cache.set(cacheKey, { data: analysis, expiresAt: Date.now() + CACHE_TTL_MS });
    return analysis;
  } catch (err: any) {
    console.warn(`Stock analysis generation failed for ${input.symbol}:`, err?.message);
    return buildNeutralFallback(input);
  }
}
