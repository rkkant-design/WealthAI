import type { LiveQuote, LiveMarketRegime, MarketPulse } from "../../src/types.js";

/*
 * Live market pulse from Yahoo Finance: global factors that move Indian
 * equities, NSE sector indices, and a market reading derived from them with
 * simple, disclosed rules (no hardcoded values, no AI). Anything that fails to
 * load is simply omitted — we never substitute sample numbers.
 */

const YAHOO_HEADERS = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" };
const FETCH_TIMEOUT_MS = 6000; // keep well inside the ~10s serverless limit
const CACHE_TTL_MS = 5 * 60 * 1000;

interface ChartData {
  price: number;
  prevClose: number;
  closes: number[];
}

async function fetchChart(symbol: string, range: "5d" | "1mo" | "3mo"): Promise<ChartData | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${range}`,
      { headers: YAHOO_HEADERS, signal: controller.signal }
    );
    if (!res.ok) return null;
    const data: any = await res.json();
    const result = data.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta || typeof meta.regularMarketPrice !== "number") return null;

    const closes: number[] = (result?.indicators?.quote?.[0]?.close || []).filter(
      (c: number | null): c is number => typeof c === "number"
    );
    const price = meta.regularMarketPrice;
    // Same rule as the index service: never use chartPreviousClose first — on
    // multi-day ranges it is the close before the window, not yesterday.
    const secondLast = closes.length >= 2 ? closes[closes.length - 2] : undefined;
    const prevClose = meta.regularMarketPreviousClose ?? meta.previousClose ?? secondLast ?? price;
    return { price, prevClose, closes };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const round = (n: number, dp = 2) => Number(n.toFixed(dp));

function toQuote(
  def: { symbol: string; name: string; prefix?: string; suffix?: string; description?: string },
  chart: ChartData | null
): LiveQuote | null {
  if (!chart) return null;
  const change = chart.price - chart.prevClose;
  const first = chart.closes[0];
  return {
    symbol: def.symbol,
    name: def.name,
    value: round(chart.price),
    change: round(change),
    changePercent: chart.prevClose ? round((change / chart.prevClose) * 100) : 0,
    change1mPercent: first ? round(((chart.price - first) / first) * 100) : null,
    prefix: def.prefix,
    suffix: def.suffix,
    description: def.description,
  };
}

const GLOBAL_FACTORS = [
  { symbol: "INR=X", name: "USD / INR", prefix: "₹", description: "A weaker rupee raises import costs; it helps exporters like IT and pharma." },
  { symbol: "BZ=F", name: "Brent crude oil", prefix: "$", suffix: " /bbl", description: "India imports most of its oil, so higher prices feed inflation." },
  { symbol: "^TNX", name: "US 10-year yield", suffix: "%", description: "Higher US yields tend to pull foreign money out of emerging markets." },
  { symbol: "DX-Y.NYB", name: "US Dollar Index", description: "A stronger dollar usually puts pressure on the rupee." },
  { symbol: "GC=F", name: "Gold", prefix: "$", suffix: " /oz", description: "Often rises when investors are nervous." },
  { symbol: "^GSPC", name: "S&P 500 (US)", description: "Global risk mood often starts in US markets." },
];

// NSE sectoral indices as listed on Yahoo Finance.
const SECTOR_INDICES = [
  { symbol: "^NSEBANK", name: "Banking" },
  { symbol: "NIFTY_FIN_SERVICE.NS", name: "Financial Services" },
  { symbol: "^CNXIT", name: "IT" },
  { symbol: "^CNXPHARMA", name: "Pharma" },
  { symbol: "^CNXAUTO", name: "Auto" },
  { symbol: "^CNXFMCG", name: "FMCG" },
  { symbol: "^CNXMETAL", name: "Metals" },
  { symbol: "^CNXENERGY", name: "Energy" },
  { symbol: "^CNXREALTY", name: "Realty" },
  { symbol: "^CNXINFRA", name: "Infrastructure" },
  { symbol: "^CNXPSUBANK", name: "PSU Banks" },
  { symbol: "^CNXMEDIA", name: "Media" },
];

function deriveRegime(nifty: ChartData | null, vixChart: ChartData | null, sectors: LiveQuote[]): LiveMarketRegime | null {
  if (!nifty) return null;

  // Trend: NIFTY vs its 50-day simple moving average (±2% band = sideways).
  let trend: LiveMarketRegime["trend"] = "Sideways";
  let trendDetail = "Not enough price history to compare with the 50-day average.";
  const window = nifty.closes.slice(-50);
  if (window.length >= 40) {
    const sma = window.reduce((a, b) => a + b, 0) / window.length;
    const gap = ((nifty.price - sma) / sma) * 100;
    trend = gap > 2 ? "Uptrend" : gap < -2 ? "Downtrend" : "Sideways";
    trendDetail = `NIFTY 50 is ${Math.abs(round(gap, 1))}% ${gap >= 0 ? "above" : "below"} its 50-day average.`;
  }

  // Volatility: India VIX bands.
  const vix = vixChart ? round(vixChart.price) : null;
  const volatility: LiveMarketRegime["volatility"] =
    vix === null ? "Unknown" : vix < 13 ? "Low" : vix <= 20 ? "Normal" : "High";

  // Breadth: share of sector indices up today.
  const sectorsUp = sectors.filter((s) => s.changePercent > 0).length;
  const sectorsTotal = sectors.length;
  const upShare = sectorsTotal ? sectorsUp / sectorsTotal : 0;
  const breadth: LiveMarketRegime["breadth"] =
    sectorsTotal === 0 ? "Unknown" : upShare >= 0.65 ? "Positive" : upShare <= 0.35 ? "Negative" : "Mixed";

  const parts = [
    `The market is in ${trend === "Uptrend" ? "an uptrend" : trend === "Downtrend" ? "a downtrend" : "a sideways phase"}: ${trendDetail}`,
    vix !== null ? `Volatility is ${volatility.toLowerCase()} (India VIX ${vix}).` : "",
    sectorsTotal ? `${sectorsUp} of ${sectorsTotal} sector indices rose today.` : "",
  ];

  return { trend, trendDetail, volatility, vix, breadth, sectorsUp, sectorsTotal, summary: parts.filter(Boolean).join(" ") };
}

let cache: { data: MarketPulse; expiresAt: number } | null = null;

export async function getMarketPulse(): Promise<MarketPulse> {
  if (cache && cache.expiresAt > Date.now()) return cache.data;

  const [globalCharts, sectorCharts, niftyChart, vixChart] = await Promise.all([
    Promise.all(GLOBAL_FACTORS.map((g) => fetchChart(g.symbol, "1mo"))),
    Promise.all(SECTOR_INDICES.map((s) => fetchChart(s.symbol, "1mo"))),
    fetchChart("^NSEI", "3mo"),
    fetchChart("^INDIAVIX", "5d"),
  ]);

  const global = GLOBAL_FACTORS.map((g, i) => toQuote(g, globalCharts[i])).filter((q): q is LiveQuote => q !== null);
  const sectors = SECTOR_INDICES.map((s, i) => toQuote(s, sectorCharts[i])).filter((q): q is LiveQuote => q !== null);

  const data: MarketPulse = {
    asOf: new Date().toISOString(),
    global,
    sectors,
    regime: deriveRegime(niftyChart, vixChart, sectors),
  };

  // Only cache a useful result, so a transient Yahoo failure isn't pinned for 5 minutes.
  if (global.length > 0 || sectors.length > 0) {
    cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  }
  return data;
}
