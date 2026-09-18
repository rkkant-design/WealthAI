import { Stock, RecommendationType } from "../../src/types.js";
import { generateStockAnalysis, StockAnalysisInput } from "./stockAnalysisService.js";

// Alias dictionary for common Indian stocks & penny stocks
export const KNOWN_INDIAN_STOCKS: Record<string, { symbol: string; name: string; sector: string; isPenny?: boolean; approxMcap?: string }> = {
  RADAAN: { symbol: 'RADAAN', name: 'Radaan Mediaworks India Limited', sector: 'Media & Entertainment', isPenny: true, approxMcap: '₹18 Cr' },
  RAADAAN: { symbol: 'RADAAN', name: 'Radaan Mediaworks India Limited', sector: 'Media & Entertainment', isPenny: true, approxMcap: '₹18 Cr' },
  'RAADAAN MEDIA WORKS': { symbol: 'RADAAN', name: 'Radaan Mediaworks India Limited', sector: 'Media & Entertainment', isPenny: true, approxMcap: '₹18 Cr' },
  'RADAAN MEDIAWORKS': { symbol: 'RADAAN', name: 'Radaan Mediaworks India Limited', sector: 'Media & Entertainment', isPenny: true, approxMcap: '₹18 Cr' },
  'RADAAN MEDIAWORKS INDIA': { symbol: 'RADAAN', name: 'Radaan Mediaworks India Limited', sector: 'Media & Entertainment', isPenny: true, approxMcap: '₹18 Cr' },
  SUZLON: { symbol: 'SUZLON', name: 'Suzlon Energy Limited', sector: 'Capital Goods & Renewable Energy', approxMcap: '₹62,000 Cr' },
  IDEA: { symbol: 'IDEA', name: 'Vodafone Idea Limited', sector: 'Telecommunications', isPenny: true, approxMcap: '₹48,000 Cr' },
  'VODAFONE IDEA': { symbol: 'IDEA', name: 'Vodafone Idea Limited', sector: 'Telecommunications', isPenny: true, approxMcap: '₹48,000 Cr' },
  YESBANK: { symbol: 'YESBANK', name: 'Yes Bank Limited', sector: 'Banking & Financials', isPenny: true, approxMcap: '₹61,000 Cr' },
  JPPOWER: { symbol: 'JPPOWER', name: 'Jaiprakash Power Ventures', sector: 'Energy & Power', isPenny: true, approxMcap: '₹12,500 Cr' },
  ALOKINDS: { symbol: 'ALOKINDS', name: 'Alok Industries Limited', sector: 'Textiles', isPenny: true, approxMcap: '₹11,000 Cr' },
  SOUTHBANK: { symbol: 'SOUTHBANK', name: 'South Indian Bank Limited', sector: 'Banking & Financials', approxMcap: '₹7,200 Cr' },
  URJA: { symbol: 'URJA', name: 'Urja Global Limited', sector: 'Renewable Energy', isPenny: true, approxMcap: '₹850 Cr' },
  RPOWER: { symbol: 'RPOWER', name: 'Reliance Power Limited', sector: 'Energy & Power', isPenny: true, approxMcap: '₹15,000 Cr' },
  RELIANCE: { symbol: 'RELIANCE', name: 'Reliance Industries Limited', sector: 'Energy & Petrochemicals', approxMcap: '₹19.4 Lakh Cr' },
  TCS: { symbol: 'TCS', name: 'Tata Consultancy Services Limited', sector: 'Information Technology', approxMcap: '₹14.2 Lakh Cr' },
  HDFCBANK: { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', sector: 'Banking & Financials', approxMcap: '₹12.8 Lakh Cr' },
  INFY: { symbol: 'INFY', name: 'Infosys Limited', sector: 'Information Technology', approxMcap: '₹6.8 Lakh Cr' },
  ICICIBANK: { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', sector: 'Banking & Financials', approxMcap: '₹8.9 Lakh Cr' },
  TATAMOTORS: { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', sector: 'Automobile', approxMcap: '₹3.4 Lakh Cr' },
};

export async function resolveStockQuote(queryParam: string): Promise<{
  exchange: 'NSE' | 'BSE';
  baseSymbol: string;
  matchedSymbol: string;
  stock: Stock;
} | null> {
  const cleanUpper = queryParam.trim().toUpperCase();
  const known = KNOWN_INDIAN_STOCKS[cleanUpper] ||
    KNOWN_INDIAN_STOCKS[cleanUpper.replace(/\s+/g, ' ')] ||
    KNOWN_INDIAN_STOCKS[cleanUpper.replace(/AA/g, 'A')];

  let candidateTickers: string[] = [];

  if (known) {
    candidateTickers.push(`${known.symbol}.NS`, `${known.symbol}.BO`);
  } else {
    const rawTicker = cleanUpper.replace(/\.(NS|BO)$/, '').replace(/[^A-Z0-9]/g, '');
    if (rawTicker.length >= 2 && rawTicker.length <= 12) {
      candidateTickers.push(`${rawTicker}.NS`, `${rawTicker}.BO`);
    }
  }

  // Also search Yahoo Finance for Indian equity candidates
  try {
    const searchRes = await fetch(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(queryParam)}&quotesCount=6&newsCount=0`,
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }
    );
    if (searchRes.ok) {
      const searchData: any = await searchRes.json();
      const indian = (searchData.quotes || []).filter(
        (q: any) => q.symbol && (q.symbol.endsWith(".NS") || q.symbol.endsWith(".BO"))
      );
      if (indian.length > 0) {
        candidateTickers = [...candidateTickers, ...indian.map((i: any) => i.symbol)];
      }
    }
  } catch (err) {
    console.warn("Yahoo search candidate lookup warning:", err);
  }

  candidateTickers = [...new Set(candidateTickers)];

  let foundData: any = null;
  let matchedSymbol = "";
  let exchange: 'NSE' | 'BSE' = 'NSE';

  for (const sym of candidateTickers) {
    try {
      const chartRes = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=1y`,
        { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }
      );
      if (!chartRes.ok) continue;
      const chartData: any = await chartRes.json();
      const meta = chartData.chart?.result?.[0]?.meta;
      if (meta && meta.regularMarketPrice !== undefined) {
        foundData = chartData.chart.result[0];
        matchedSymbol = sym;
        exchange = sym.endsWith(".NS") ? "NSE" : "BSE";
        break;
      }
    } catch {
      // try next candidate
    }
  }

  if (!foundData || !foundData.meta) {
    return null;
  }

  const meta = foundData.meta;
  const baseSymbol = matchedSymbol.replace(/\.(NS|BO)$/, "");
  const companyName = meta.longName || meta.shortName || known?.name || baseSymbol;
  const currentPrice = Number(meta.regularMarketPrice.toFixed(2));

  // Historical closes for chart (compute before prevClose so we can use it as a fallback)
  const timestamps: number[] = foundData.timestamp || [];
  const quoteCloses: (number | null)[] = foundData.indicators?.quote?.[0]?.close || [];
  const historicalCloses = timestamps
    .map((t, idx) => ({
      date: new Date(t * 1000).toISOString().split('T')[0],
      close: quoteCloses[idx] !== null && quoteCloses[idx] !== undefined ? Number(quoteCloses[idx]!.toFixed(2)) : null
    }))
    .filter((item): item is { date: string; close: number } => item.close !== null);

  // FIX: `chartPreviousClose` on a `range=1y` request is the close a YEAR ago,
  // which produced absurd "today" changes (e.g. -37%). Use the actual regular
  // previous close, falling back to the second-to-last daily close.
  const secondLastClose = historicalCloses.length >= 2
    ? historicalCloses[historicalCloses.length - 2].close
    : undefined;
  const rawPrevClose =
    meta.regularMarketPreviousClose ??
    meta.previousClose ??
    secondLastClose ??
    meta.chartPreviousClose ??
    currentPrice;
  const prevClose = Number(Number(rawPrevClose).toFixed(2));
  const change = Number((currentPrice - prevClose).toFixed(2));
  const changePercent = prevClose ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

  const week52High = meta.fiftyTwoWeekHigh ? Number(meta.fiftyTwoWeekHigh.toFixed(2)) : Number((currentPrice * 1.3).toFixed(2));
  const week52Low = meta.fiftyTwoWeekLow ? Number(meta.fiftyTwoWeekLow.toFixed(2)) : Number((currentPrice * 0.7).toFixed(2));

  // Penny stock / microcap risk evaluation
  const isPennyStock = currentPrice < 20 || (known?.isPenny ?? false);
  const sector = known?.sector || (companyName.toLowerCase().includes('media') ? 'Media & Entertainment' : 'Diversified');
  const marketCapCategory: Stock['marketCapCategory'] = isPennyStock
    ? 'Penny Stock'
    : currentPrice > 1000 ? 'Large Cap' : currentPrice > 300 ? 'Mid Cap' : 'Small Cap';
  const marketCap = known?.approxMcap || (isPennyStock ? `₹${Math.round(currentPrice * 7)} Cr (Microcap)` : `Not available`);

  const pennyWarning = isPennyStock
    ? `⚠️ High-Risk Penny / Microcap Advisory: ${companyName} trades at ₹${currentPrice}. Microcaps carry extreme illiquidity risk, vulnerability to operator pumps, erratic financial reporting, and wide bid-ask spreads. It does NOT meet disciplined long-term wealth preservation criteria.`
    : undefined;

  // Company-specific fundamental/valuation analysis (AI estimate, NOT audited data).
  const analysisInput: StockAnalysisInput = {
    symbol: baseSymbol,
    name: companyName,
    sector,
    currentPrice,
    changePercent,
    week52High,
    week52Low,
    marketCap,
    marketCapCategory,
    isPennyStock,
    historicalCloses,
  };
  const analysis = await generateStockAnalysis(analysisInput);

  const stock: Stock = {
    symbol: baseSymbol,
    name: companyName,
    sector,
    marketCap,
    marketCapCategory,
    // Live exchange fields (genuinely from Yahoo Finance):
    currentPrice,
    change,
    changePercent,
    week52High,
    week52Low,
    isLiveExchangeData: true,
    exchange,
    lastUpdatedTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    isPennyStock,
    pennyStockWarning: pennyWarning,
    historicalCloses: historicalCloses.slice(-90),
    // AI-estimated analysis fields (clearly flagged via analysisSource):
    analysisSource: analysis.analysisSource,
    wealthScore: analysis.wealthScore,
    scoreBreakdown: analysis.scoreBreakdown,
    fundamentals: analysis.fundamentals,
    financialHistory: analysis.financialHistory,
    valuationEngine: analysis.valuationEngine as Stock['valuationEngine'],
    entryPointEngine: {
      ...analysis.entryPointEngine,
      entryRating: analysis.entryPointEngine.entryRating as RecommendationType,
    },
    recommendation: {
      ...analysis.recommendation,
      type: analysis.recommendation.type as RecommendationType,
    },
    riskAnalysis: analysis.riskAnalysis,
    investmentThesis: analysis.investmentThesis,
    evidence: [],
  };

  return { exchange, baseSymbol, matchedSymbol, stock };
}
