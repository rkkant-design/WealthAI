export type RecommendationType = 
  | 'BUY' 
  | 'ACCUMULATE' 
  | 'WATCH' 
  | 'HOLD' 
  | 'REVIEW' 
  | 'SELL' 
  | 'AVOID';

export interface InvestorProfile {
  name: string;
  market: string;
  riskProfile: 'Low' | 'Medium' | 'High';
  investmentHorizon: string;
  primaryObjective: string;
  goal: string;
  monthlyBudget: number;
  investmentStyle: string;
  tradingPreference: string;
  preferredSectors: string[];
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  high52: number;
  low52: number;
  sparkline: number[];
}

export interface MarketRegime {
  status: 'CAUTIOUSLY POSITIVE' | 'BULLISH EXPANSION' | 'CONSOLIDATION' | 'DEFENSIVE';
  confidence: number;
  indicators: {
    marketTrend: 'Positive' | 'Neutral' | 'Negative';
    marketBreadth: 'Positive' | 'Neutral' | 'Negative';
    volatility: 'Low' | 'Moderate' | 'High';
    fiiFlow: 'Positive' | 'Mixed' | 'Negative';
    diiFlow: 'Positive' | 'Neutral' | 'Negative';
    earningsTrend: 'Positive' | 'Neutral' | 'Negative';
    valuation: 'Attractive' | 'Fair' | 'Elevated' | 'Expensive';
  };
  aiMarketView: string;
  date: string;
}

export interface MacroIndicator {
  category: 'economic' | 'global';
  name: string;
  value: string;
  subtext: string;
  status: 'positive' | 'neutral' | 'caution';
  trend: 'up' | 'down' | 'flat';
}

export interface SectorData {
  id: string;
  name: string;
  trend: 'Positive' | 'Neutral' | 'Negative';
  valuation: 'Cheap' | 'Fair' | 'Slightly Expensive' | 'Expensive';
  momentum: 'Strong' | 'Moderate' | 'Weak';
  earnings: 'Positive' | 'Mixed' | 'Weak';
  risk: 'Low' | 'Medium' | 'High';
  aiOutlook: 'Positive' | 'Neutral' | 'Cautious';
  weightInNifty: number;
  description: string;
  topStock: string;
}

export interface FinancialMetricYear {
  year: string;
  revenue: number; // in Cr
  profit: number; // in Cr
  eps: number;
  roce: number; // in %
  fcf: number; // in Cr
  operatingMargin: number; // in %
}

export interface StockEvidence {
  signal: string;
  sourceType: string;
  date: string;
  data: string;
  aiConfidence: number;
  whyItMatters: string;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  marketCap: string; // e.g. "₹19.4 Lakh Cr"
  marketCapCategory: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Micro Cap' | 'Penny Stock';
  currentPrice: number;
  change: number;
  changePercent: number;
  week52High: number;
  week52Low: number;
  wealthScore: number;
  isPennyStock?: boolean;
  isLiveExchangeData?: boolean;
  exchange?: 'NSE' | 'BSE';
  lastUpdatedTime?: string;
  pennyStockWarning?: string;
  historicalCloses?: { date: string; close: number }[];
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
  financialHistory: FinancialMetricYear[];
  valuationEngine: {
    currentPe: number;
    historicalPe5YrAvg: number;
    sectorPe: number;
    peg: number;
    pb: number;
    evEbitda: number;
    dividendYield: number;
    status: 'ATTRACTIVE' | 'FAIR' | 'SLIGHTLY EXPENSIVE' | 'EXPENSIVE';
    explanation: string;
  };
  entryPointEngine: {
    currentPrice: number;
    preferredEntryLow: number;
    preferredEntryHigh: number;
    strongBuyZone: number;
    fairValueEstimate: number;
    entryRating: RecommendationType;
    entryScore: number;
    distanceToPreferredZonePercent: number;
    inZone: boolean;
    reasons: string[];
  };
  recommendation: {
    type: RecommendationType;
    suggestedAmount: number;
    portfolioFitScore: number;
    risk: 'Low' | 'Medium' | 'High';
    horizon: string;
    confidence: number;
    whyFitsYou: string[];
    whyNotBuy: string[];
    whatWouldChangeMind: string[];
  };
  riskAnalysis: {
    overall: 'LOW' | 'MEDIUM' | 'HIGH';
    businessRisk: number; // 0-100
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
  evidence: StockEvidence[];
}

export interface PortfolioItem {
  id: string;
  stockSymbol: string;
  stockName: string;
  sector: string;
  marketCapCategory: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Micro Cap' | 'Penny Stock';
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  purchaseDate: string;
  investmentReason: string;
  investmentThesis: string;
  recommendation: 'HOLD' | 'REVIEW' | 'ACCUMULATE' | 'SELL';
  convictionScore: number;
  recommendationReason: string;
  thesisStatus: 'INTACT' | 'WEAKENING' | 'MONITOR';
  returnsPercent: number;
  returnsValue: number;
  totalInvested: number;
  currentValue: number;
  weightInPortfolio: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  sector: string;
  score: number;
  currentPrice: number;
  entryZone: string;
  distanceToBuyZone: string;
  inBuyZone: boolean;
  valuation: string;
  action: RecommendationType;
  addedDate: string;
  targetPrice?: number;
}

export interface MonthlyPlanAllocation {
  id: string;
  assetName: string;
  symbol?: string;
  action: 'BUY' | 'ACCUMULATE' | 'HOLD' | 'WAIT';
  amount: number;
  reason: string;
  sector: string;
  portfolioFitScore: number;
}

export interface AlertItem {
  id: string;
  type: 'BUY_ZONE' | 'VALUATION' | 'THESIS' | 'PORTFOLIO' | 'OPPORTUNITY';
  title: string;
  message: string;
  symbol?: string;
  timestamp: string;
  severity: 'positive' | 'warning' | 'critical' | 'info';
  read: boolean;
  actionLabel?: string;
  targetTab?: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  category?: 'recommendation' | 'thesis' | 'risk' | 'portfolio' | 'market';
  suggestedFollowUps?: string[];
}
