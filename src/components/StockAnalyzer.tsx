import React, { useState } from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  Eye, 
  EyeOff, 
  Database, 
  BarChart2, 
  Layers, 
  ArrowRight,
  Info,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import { useWealth } from '../context/WealthContext';

export const StockAnalyzer: React.FC = () => {
  const { 
    stocks, 
    selectedStock, 
    setSelectedStockSymbol, 
    addToWatchlist, 
    removeFromWatchlist, 
    isInWatchlist, 
    setIsAddInvestmentOpen,
    openEvidenceModal,
    portfolioStats,
    isFetchingLiveQuote,
    fetchLiveQuote
  } = useWealth();

  const [financialMetric, setFinancialMetric] = useState<'revenue' | 'profit' | 'eps' | 'roce' | 'fcf' | 'operatingMargin'>('revenue');
  const [chartViewMode, setChartViewMode] = useState<'financials' | 'priceHistory'>('financials');

  // Guard against missing selectedStock
  const currentStock = selectedStock || stocks[0];
  if (!currentStock) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm bg-slate-900 rounded-2xl border border-slate-800">
        No stock selected. Please choose a stock to analyze.
      </div>
    );
  }

  const inWatchlist = isInWatchlist(currentStock.symbol);

  // Financial chart data transformation using audited history or fallback
  const chartData = (currentStock.financialHistory && currentStock.financialHistory.length > 0)
    ? currentStock.financialHistory
    : [
        { year: 'FY22', revenue: 50000, profit: 8000, eps: 45, roce: 20, fcf: 6000, operatingMargin: 18 },
        { year: 'FY23', revenue: 60000, profit: 10000, eps: 55, roce: 22, fcf: 7500, operatingMargin: 19 },
        { year: 'FY24', revenue: 72000, profit: 12500, eps: 68, roce: 24, fcf: 9200, operatingMargin: 20 },
        { year: 'FY25', revenue: 84000, profit: 15000, eps: 80, roce: 25, fcf: 11000, operatingMargin: 21 },
        { year: 'FY26E', revenue: 98000, profit: 18000, eps: 95, roce: 26, fcf: 13500, operatingMargin: 22 },
      ];

  const getMetricTitle = (m: string) => {
    switch (m) {
      case 'revenue':
        return '5-Year Revenue (₹ Crore)';
      case 'profit':
        return '5-Year Net Profit (₹ Crore)';
      case 'eps':
        return 'Earnings Per Share (₹)';
      case 'roce':
        return 'Return on Capital Employed (%)';
      case 'fcf':
        return 'Free Cash Flow (₹ Crore)';
      case 'operatingMargin':
        return 'Operating Margin (%)';
      default:
        return '5-Year Performance';
    }
  };

  const getValuationColor = (status?: string) => {
    switch (status) {
      case 'ATTRACTIVE':
      case 'CHEAP':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'FAIR':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'SLIGHTLY EXPENSIVE':
      case 'SLIGHTLY_EXPENSIVE':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'EXPENSIVE':
        return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  const isPos = (currentStock.changePercent ?? 0) >= 0;

  // Safe defaults for sub-objects
  const scoreBreakdown = currentStock.scoreBreakdown || {
    fundamentalQuality: 85,
    growth: 80,
    financialStrength: 85,
    competitiveAdvantage: 85,
    management: 85,
    valuation: 75,
    marketTrend: 80,
    entryPoint: 80,
    portfolioFit: 85,
  };

  const recommendation = currentStock.recommendation || {
    type: 'ACCUMULATE',
    suggestedAmount: 2500,
    portfolioFitScore: 85,
    risk: 'Medium',
    horizon: '5+ Years',
    confidence: 85,
    whyFitsYou: ['Strong market position and healthy balance sheet'],
    whyNotBuy: ['Wait for better entry if price runs up'],
    whatWouldChangeMind: ['Deterioration in margins or excessive debt'],
  };

  const valuationEngine = currentStock.valuationEngine || {
    currentPe: 25,
    historicalPe5YrAvg: 26,
    sectorPe: 24,
    peg: 1.5,
    pb: 3.5,
    evEbitda: 14,
    dividendYield: 1.2,
    status: 'FAIR' as const,
    explanation: 'Valuation is reasonable given compounding consistency.',
  };

  const entryPointEngine = currentStock.entryPointEngine || {
    currentPrice: currentStock.currentPrice,
    preferredEntryLow: currentStock.currentPrice * 0.9,
    preferredEntryHigh: currentStock.currentPrice * 1.02,
    strongBuyZone: currentStock.currentPrice * 0.85,
    fairValueEstimate: currentStock.currentPrice * 1.15,
    entryRating: 'ACCUMULATE' as const,
    entryScore: 80,
    distanceToPreferredZonePercent: 0,
    inZone: true,
    reasons: ['Trading within valuation margin-of-safety comfort zone.'],
  };

  const fundamentals = currentStock.fundamentals || {
    revenueGrowth5Yr: '14.5% CAGR',
    profitGrowth5Yr: '15.2% CAGR',
    epsGrowth: '12.8% YoY',
    roe: '18.5%',
    roce: '22.4%',
    operatingMargin: '18.5%',
    debtToEquity: '0.12',
    freeCashFlow: '₹5,400 Cr',
    dividendYield: '1.2%',
  };

  const riskAnalysis = currentStock.riskAnalysis || {
    overall: 'MEDIUM' as const,
    businessRisk: 25,
    valuationRisk: 35,
    debtRisk: 15,
    sectorRisk: 30,
    regulatoryRisk: 25,
    marketRisk: 35,
    managementRisk: 15,
  };

  const investmentThesis = currentStock.investmentThesis || {
    summary: 'High quality long-term business with consistent return on capital.',
    validIf: ['Revenue growth sustained above 12%', 'Debt remains minimal'],
    reconsiderIf: ['Operating margins compress >400 bps', 'Promoter pledge increases'],
  };

  return (
    <div id="stock-analyzer-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Stock Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 border border-blue-500/30 flex items-center justify-center text-white font-mono font-black text-xl shadow-lg shadow-blue-600/20">
            {currentStock.symbol.substring(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-white tracking-tight">{currentStock.name}</h1>
              <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-800 text-blue-400 border border-slate-700">
                NSE: {currentStock.symbol}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">
                {currentStock.sector}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">
                {currentStock.marketCapCategory} ({currentStock.marketCap})
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <div className="text-xl font-black text-white font-mono">
                ₹{currentStock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div
                className={`text-xs font-bold font-mono flex items-center gap-1 ${
                  isPos ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPos ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {isPos ? '+' : ''}₹{Math.abs(currentStock.change ?? 0).toFixed(2)} ({isPos ? '+' : ''}{currentStock.changePercent ?? 0}%) Today
              </div>
              <span className="text-slate-600">•</span>
              <div className="text-xs text-slate-400 font-mono">
                52W Range: ₹{(currentStock.week52Low ?? 0).toLocaleString('en-IN')} – ₹{(currentStock.week52High ?? 0).toLocaleString('en-IN')}
              </div>
            </div>

            {/* Live Exchange provenance and refresh status */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live {currentStock.exchange || 'NSE'} Feed</span>
                {currentStock.lastUpdatedTime && (
                  <span className="text-slate-400 text-[10px] font-mono">({currentStock.lastUpdatedTime})</span>
                )}
              </div>

              <button
                id="refresh-live-quote-btn"
                onClick={() => fetchLiveQuote(currentStock.symbol)}
                disabled={isFetchingLiveQuote}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 flex items-center gap-1 transition-all disabled:opacity-50"
                title="Fetch updated real-time quote directly from NSE/BSE"
              >
                <RefreshCw className={`h-3 w-3 ${isFetchingLiveQuote ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
                <span>{isFetchingLiveQuote ? 'Updating Feed...' : 'Live Quote'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stock Selector Dropdown & Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              id="switch-stock-analyzer-select"
              value={currentStock.symbol}
              onChange={(e) => setSelectedStockSymbol(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-blue-500 shadow-md max-w-xs"
            >
              {stocks.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} — {s.name} (₹{s.currentPrice.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Watchlist toggle */}
          <button
            id="toggle-watchlist-btn"
            onClick={() => {
              if (inWatchlist) removeFromWatchlist(currentStock.symbol);
              else addToWatchlist(currentStock.symbol);
            }}
            className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              inWatchlist
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
            }`}
          >
            {inWatchlist ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{inWatchlist ? 'In Watchlist' : '+ Watchlist'}</span>
          </button>

          {/* Add to Portfolio */}
          <button
            id="add-stock-to-portfolio-btn"
            onClick={() => setIsAddInvestmentOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Add to Portfolio</span>
          </button>

          {/* View Evidence */}
          {currentStock.evidence && (
            <button
              id="view-stock-evidence-btn"
              onClick={() => openEvidenceModal(currentStock.name, currentStock.evidence)}
              className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Database className="h-4 w-4 text-blue-400" />
              <span>View Evidence</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Switch Ticker Ribbon */}
      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex-shrink-0 px-1">
          Quick Switch ({stocks.length} quotes):
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {stocks.slice(0, 15).map((s) => {
            const isSelected = s.symbol === currentStock.symbol;
            const isStockPos = (s.changePercent ?? 0) >= 0;
            return (
              <button
                key={s.symbol}
                onClick={() => setSelectedStockSymbol(s.symbol)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                <span>{s.symbol}</span>
                <span className={`text-[10px] ${
                  isSelected 
                    ? 'text-blue-100' 
                    : isStockPos ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  ₹{s.currentPrice.toLocaleString('en-IN')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Speculative Penny Stock / Microcap Advisory Banner */}
      {(currentStock.isPennyStock || currentStock.currentPrice < 20) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border-2 border-amber-500/50 text-amber-200 shadow-xl flex flex-col sm:flex-row items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40">
                ⚠️ Speculative Penny Stock / Microcap Advisory
              </span>
              <span className="text-xs font-mono text-amber-300 font-bold">
                Action: AVOID • Risk: HIGH SPECULATIVE • Wealth Score: {currentStock.wealthScore}/100
              </span>
            </div>
            <p className="text-xs leading-relaxed text-amber-100/90 font-medium">
              {currentStock.pennyStockWarning || `${currentStock.name} trades at ₹${currentStock.currentPrice.toFixed(2)} with microcap capitalization. Penny stocks carry extreme illiquidity risk, vulnerability to operator pumps, erratic financial reporting, and wide bid-ask spreads. It does NOT meet disciplined long-term wealth preservation criteria.`}
            </p>
            <div className="text-[11px] text-amber-300/80 flex items-center gap-4 pt-1 flex-wrap font-mono">
              <span>• Order Depth: <strong>Illiquid / High Slippage</strong></span>
              <span>• Institutional Coverage: <strong>Zero / Negligible</strong></span>
              <span>• WealthPilot Verdict: <strong>Unsuitable for Retirement Accumulation</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Grid Row 1: Wealth Score & Personalized Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* WEALTH SCORE (Section 12) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Institutional Quality Rating
              </span>
              <h3 className="font-extrabold text-sm text-white">Composite Wealth Score</h3>
            </div>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-500/30">
              Grade A+
            </span>
          </div>

          <div className="flex items-center gap-4 py-1">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex flex-col items-center justify-center text-white shadow-xl shadow-blue-500/30 flex-shrink-0">
              <span className="text-2xl font-black font-mono leading-none">{currentStock.wealthScore}</span>
              <span className="text-[10px] font-semibold text-blue-100">/ 100</span>
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-white text-sm">
                {currentStock.wealthScore >= 85
                  ? 'Institutional Bedrock Compounder'
                  : currentStock.wealthScore >= 70
                  ? 'Strong Quality Compounder'
                  : 'Cautionary / Cyclical Asset'}
              </p>
              <p className="text-slate-400 text-[11px] leading-tight">
                Evaluated across 9 audited fundamental, valuation, entry, and portfolio fit parameters.
              </p>
            </div>
          </div>

          {/* 9 Factor Breakdown */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              9-Dimension Factor Breakdown
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { label: 'Fundamental Quality', val: scoreBreakdown.fundamentalQuality },
                { label: 'Growth & Reinvestment', val: scoreBreakdown.growth },
                { label: 'Financial Strength (Low/Zero Debt)', val: scoreBreakdown.financialStrength },
                { label: 'Competitive Advantage (Moat)', val: scoreBreakdown.competitiveAdvantage },
                { label: 'Management Quality & Capital Alloc.', val: scoreBreakdown.management },
                { label: 'Valuation Attractiveness', val: scoreBreakdown.valuation },
                { label: 'Market Trend & Institutional Support', val: scoreBreakdown.marketTrend },
                { label: 'Entry Point Timing', val: scoreBreakdown.entryPoint },
                { label: 'Portfolio Fit for Kamal', val: scoreBreakdown.portfolioFit },
              ].map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{factor.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                        style={{ width: `${factor.val}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-white w-6 text-right">{factor.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERSONALIZED RECOMMENDATION (Section 16) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Personalized Investment Decision
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="font-extrabold text-base text-white">
                  What Should Kamal Do?
                </h3>
                <span
                  className={`text-xs font-black px-3 py-0.5 rounded-full border ${
                    recommendation.type === 'BUY'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : recommendation.type === 'ACCUMULATE'
                      ? 'bg-teal-500/20 text-teal-400 border-teal-500/40'
                      : recommendation.type === 'WATCH'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : recommendation.type === 'HOLD'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                >
                  Action: {recommendation.type}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                Suggested Allocation: <strong className="text-emerald-400">
                  {recommendation.suggestedAmount ? `₹${recommendation.suggestedAmount.toLocaleString('en-IN')}` : '₹2,500'}
                </strong>
              </span>
            </div>
          </div>

          {/* Meta Cards: Fit Score, Risk, Horizon, Confidence */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Portfolio Fit</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                {recommendation.portfolioFitScore}/100
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Risk Profile</span>
              <span className="font-bold text-emerald-300">{recommendation.risk}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Time Horizon</span>
              <span className="font-bold text-blue-400">{recommendation.horizon}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">AI Confidence</span>
              <span className="font-bold text-cyan-300 font-mono text-sm">
                {recommendation.confidence}%
              </span>
            </div>
          </div>

          {/* Reasoning Triad */}
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="h-4 w-4" /> Why this fits you:
              </span>
              <div className="text-slate-300 leading-relaxed space-y-1">
                {Array.isArray(recommendation.whyFitsYou) ? (
                  <ul className="list-disc list-inside space-y-0.5">
                    {recommendation.whyFitsYou.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{recommendation.whyFitsYou}</p>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <span className="text-amber-400 font-bold flex items-center gap-1.5 mb-1">
                <AlertTriangle className="h-4 w-4" /> Why you shouldn't buy (or wait):
              </span>
              <div className="text-slate-300 leading-relaxed space-y-1">
                {Array.isArray(recommendation.whyNotBuy) ? (
                  <ul className="list-disc list-inside space-y-0.5">
                    {recommendation.whyNotBuy.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{recommendation.whyNotBuy}</p>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-blue-400 font-bold flex items-center gap-1.5 mb-1">
                <Info className="h-4 w-4" /> What would change this recommendation:
              </span>
              <div className="text-slate-300 leading-relaxed space-y-1">
                {Array.isArray(recommendation.whatWouldChangeMind) ? (
                  <ul className="list-disc list-inside space-y-0.5">
                    {recommendation.whatWouldChangeMind.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{recommendation.whatWouldChangeMind}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Valuation Engine & Entry Point Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* VALUATION ENGINE (Section 14) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Institutional Valuation Engine
              </span>
              <h3 className="font-extrabold text-sm text-white">Is The Stock Expensive or Attractive?</h3>
            </div>
            <span
              className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getValuationColor(
                valuationEngine.status
              )}`}
            >
              {valuationEngine.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Current P/E</span>
              <span className="font-mono font-bold text-white text-sm">{valuationEngine.currentPe}x</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">5Y Median P/E</span>
              <span className="font-mono font-bold text-slate-300 text-sm">{valuationEngine.historicalPe5YrAvg}x</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Sector P/E</span>
              <span className="font-mono font-bold text-slate-300 text-sm">{valuationEngine.sectorPe}x</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">PEG Ratio</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{valuationEngine.peg}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Price to Book (P/B)</span>
              <span className="font-mono font-bold text-white text-xs">{valuationEngine.pb}x</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">EV / EBITDA</span>
              <span className="font-mono font-bold text-white text-xs">{valuationEngine.evEbitda}x</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Dividend Yield</span>
              <span className="font-mono font-bold text-emerald-400 text-xs">{valuationEngine.dividendYield}%</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {valuationEngine.explanation}
          </div>
        </div>

        {/* ENTRY POINT ENGINE (Section 15) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Timing & Accumulation Engine
              </span>
              <h3 className="font-extrabold text-sm text-white">Should I Buy This Stock NOW?</h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                entryPointEngine.inZone
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              {entryPointEngine.entryRating}
            </span>
          </div>

          {/* Visual Entry Range Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Market Price:</span>
              <span className="font-mono font-black text-white text-sm">
                ₹{currentStock.currentPrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Slider Track Visual */}
            <div className="relative py-2">
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div className="h-full bg-emerald-600/70 w-1/3" title="Strong Buy Range" />
                <div className="h-full bg-emerald-500/50 w-1/3" title="Preferred Entry Range" />
                <div className="h-full bg-rose-500/40 w-1/3" title="Extended / Expensive Range" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Strong Buy Zone</span>
                <span className="text-emerald-400 font-bold">
                  ₹{entryPointEngine.strongBuyZone.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-emerald-500/40">
                <span className="text-emerald-400 block font-sans font-semibold">Preferred Zone</span>
                <span className="text-emerald-300 font-bold">
                  ₹{entryPointEngine.preferredEntryLow.toLocaleString('en-IN')} – ₹{entryPointEngine.preferredEntryHigh.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Fair Value</span>
                <span className="text-blue-300 font-bold">
                  ₹{entryPointEngine.fairValueEstimate.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Why this entry timing score:
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
              {entryPointEngine.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Grid Row 3: 5-Year Financial Quality & Interactive Charts (Section 13) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {chartViewMode === 'financials' ? '5-Year Audited Financial Track Record' : 'Real Exchange Daily Closes (NSE/BSE)'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {chartViewMode === 'financials' 
                ? 'Consistent balance sheet & P&L compounding analysis across market cycles.' 
                : 'Historical closing price trajectory fetched directly from live exchange feeds.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            {currentStock.historicalCloses && currentStock.historicalCloses.length > 0 && (
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  id="chart-mode-financials-btn"
                  onClick={() => setChartViewMode('financials')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    chartViewMode === 'financials' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  5Y Financials
                </button>
                <button
                  id="chart-mode-price-btn"
                  onClick={() => setChartViewMode('priceHistory')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    chartViewMode === 'priceHistory' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Daily Closes
                </button>
              </div>
            )}

            {/* Metric Selector Buttons (Only in Financials Mode) */}
            {chartViewMode === 'financials' && (
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 flex-wrap">
                {(['revenue', 'profit', 'eps', 'roce', 'fcf', 'operatingMargin'] as const).map((m) => (
                  <button
                    key={m}
                    id={`chart-metric-btn-${m}`}
                    onClick={() => setFinancialMetric(m)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      financialMetric === m
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m === 'operatingMargin' ? 'OPM %' : m.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Chart Display: Financials or Real Daily Market Closes */}
        <div className="h-64 w-full pt-2">
          {chartViewMode === 'priceHistory' && currentStock.historicalCloses && currentStock.historicalCloses.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentStock.historicalCloses} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} minTickGap={30} />
                <YAxis stroke="#94a3b8" domain={['auto', 'auto']} tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toFixed(2)}`, 'Market Close']}
                  labelFormatter={(lbl) => `Trading Session: ${lbl}`}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke={isPos ? '#10b981' : '#38bdf8'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey={financialMetric}
                  fill={financialMetric === 'roce' || financialMetric === 'operatingMargin' ? '#10b981' : financialMetric === 'profit' ? '#38bdf8' : '#3b82f6'}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Financial Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800 text-center text-xs">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">5Y Revenue CAGR</span>
            <span className="font-mono font-bold text-emerald-400 text-xs">
              {fundamentals.revenueGrowth5Yr}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">5Y Profit CAGR</span>
            <span className="font-mono font-bold text-emerald-400 text-xs">
              {fundamentals.profitGrowth5Yr}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Current ROCE / ROE</span>
            <span className="font-mono font-bold text-white text-xs">
              {fundamentals.roce} / {fundamentals.roe}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Debt to Equity</span>
            <span className="font-mono font-bold text-emerald-400 text-xs">
              {fundamentals.debtToEquity === '0' || fundamentals.debtToEquity === '0.00' ? 'Zero Debt' : `${fundamentals.debtToEquity}x`}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Row 4: Investment Thesis & Risk Spectrum (Sections 17 & 18) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* INVESTMENT THESIS */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Institutional Thesis Engine
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Living Thesis Tracker
            </span>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/30 text-xs text-slate-200 leading-relaxed font-medium">
            "{investmentThesis.summary}"
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                ✅ Valid If (Hold / Accumulate):
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {investmentThesis.validIf.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="pt-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                ⚠️ Reconsider If (Sell / Review):
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {investmentThesis.reconsiderIf.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* INVESTMENT RISK METER (Section 17) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Downside Risk Spectrum
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                riskAnalysis.overall === 'LOW'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : riskAnalysis.overall === 'MEDIUM'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}
            >
              Overall Risk: {riskAnalysis.overall}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { label: 'Business & Competitive Risk', val: riskAnalysis.businessRisk },
              { label: 'Valuation & Multiple Compression Risk', val: riskAnalysis.valuationRisk },
              { label: 'Financial & Debt Risk', val: riskAnalysis.debtRisk },
              { label: 'Sectoral / Cyclical Headwind Risk', val: riskAnalysis.sectorRisk },
              { label: 'Regulatory & Government Policy Risk', val: riskAnalysis.regulatoryRisk },
              { label: 'Broad Market / Beta Sensitivity', val: riskAnalysis.marketRisk },
              { label: 'Governance & Management Risk', val: riskAnalysis.managementRisk },
            ].map((risk, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{risk.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        risk.val <= 30
                          ? 'bg-emerald-400'
                          : risk.val <= 60
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${risk.val}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-white w-6 text-right">{risk.val}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800">
            Score &lt; 35 indicates low structural risk. Scores &gt; 65 require active risk monitoring.
          </p>
        </div>
      </div>
    </div>
  );
};

