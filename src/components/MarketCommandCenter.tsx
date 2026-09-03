import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Target, 
  Eye, 
  Clock, 
  Layers, 
  Briefcase,
  ChevronRight,
  Info
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const MarketCommandCenter: React.FC = () => {
  const { 
    investorProfile, 
    marketIndices, 
    marketRegime, 
    portfolioStats, 
    monthlyPlan, 
    setActiveTab, 
    setSelectedStockSymbol,
    setIsDailyBriefingOpen,
    openReviewModal,
    portfolio
  } = useWealth();

  const apexChemHolding = portfolio.find((p) => p.stockSymbol === 'APEXCHEM') || portfolio[portfolio.length - 1];

  return (
    <div id="market-command-center" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Advisory Session • NSE India
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good Morning, {investorProfile.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here's what the Indian equity market means for your portfolio today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="open-60s-brief-banner-btn"
            onClick={() => setIsDailyBriefingOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
          >
            <Sparkles className="h-4 w-4 text-cyan-200" />
            <span>Open 60-Second Daily Brief</span>
          </button>
        </div>
      </div>

      {/* Five Index Cards */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Key NSE Benchmarks & Volatility
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Demo Market Data
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {marketIndices.map((idx) => {
            const isPos = idx.change >= 0;
            return (
              <div
                key={idx.symbol}
                id={`index-card-${idx.symbol.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveTab('market')}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:bg-slate-850 group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-300 font-mono group-hover:text-blue-400 transition-colors">
                    {idx.symbol}
                  </span>
                  <span
                    className={`text-[11px] font-bold font-mono flex items-center gap-0.5 ${
                      isPos ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPos ? '+' : ''}
                    {idx.changePercent}%
                  </span>
                </div>
                <div className="text-base font-extrabold text-white font-mono tracking-tight">
                  {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-slate-800/60">
                  <span>52W: {idx.low52.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  <span>{idx.high52.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Executive Summary Brief Card (Section 38) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Your Investment Brief & Executive Summary
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Personalized for Kamal
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Market Regime</span>
            <span className="font-bold text-emerald-400">Cautious Positive</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Your Portfolio</span>
            <span className="font-bold text-emerald-300">Healthy (84/100)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Best Action</span>
            <span className="font-bold text-blue-400">Accumulation</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Monthly Budget</span>
            <span className="font-bold text-white font-mono">₹15,000</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Deploy Now</span>
            <span className="font-bold text-emerald-400 font-mono">₹12,000</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Tactical Wait</span>
            <span className="font-bold text-amber-400 font-mono">₹3,000</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Top Opportunity</span>
            <span className="font-bold text-cyan-300">TCS / Sun Pharma</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-rose-900/40">
            <span className="text-[10px] text-rose-400 block mb-0.5">Requires Review</span>
            <span className="font-bold text-rose-300">Apex Specialty</span>
          </div>
        </div>
      </div>

      {/* Hero Market Regime Section (Section 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Large Market Regime Hero */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Current NSE India Environment
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
                  🟢 {marketRegime.status}
                </h2>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold">
                  Confidence: {marketRegime.confidence}%
                </span>
              </div>
            </div>

            <button
              id="view-market-analysis-btn"
              onClick={() => setActiveTab('market')}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <span>View Market Analysis</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </button>
          </div>

          {/* 7 Supporting Indicators Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Market Trend</span>
              <span className="font-bold text-emerald-400">{marketRegime.indicators.marketTrend}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Breadth</span>
              <span className="font-bold text-slate-300">{marketRegime.indicators.marketBreadth}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Volatility</span>
              <span className="font-bold text-amber-400">{marketRegime.indicators.volatility}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">FII Flow</span>
              <span className="font-bold text-slate-300">{marketRegime.indicators.fiiFlow}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">DII Flow</span>
              <span className="font-bold text-emerald-400">{marketRegime.indicators.diiFlow}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Earnings</span>
              <span className="font-bold text-emerald-400">{marketRegime.indicators.earningsTrend}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-amber-500/30">
              <span className="text-[10px] text-amber-400 block">Valuation</span>
              <span className="font-bold text-amber-300">{marketRegime.indicators.valuation}</span>
            </div>
          </div>

          {/* AI Market View Box */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI Market View for Kamal
            </span>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{marketRegime.aiMarketView}"
            </p>
          </div>
        </div>

        {/* Right Col: Portfolio Health Gauge */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Portfolio Vitality
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                XIRR: {portfolioStats.xirr}%
              </span>
            </div>

            <div className="flex items-center gap-4 my-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <span className="text-xl font-black font-mono leading-none">{portfolioStats.healthScore}</span>
                <span className="text-[9px] font-semibold text-emerald-100">/ 100</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Overall Health: Strong</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Portfolio Value: <strong className="text-white font-mono">₹{portfolioStats.currentValue.toLocaleString('en-IN')}</strong>
                </p>
                <p className="text-[11px] text-emerald-400 font-semibold font-mono">
                  Gain: +₹{portfolioStats.totalGain.toLocaleString('en-IN')} (+{portfolioStats.gainPercent}%)
                </p>
              </div>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Banking Sector Exposure</span>
                <span className="font-bold text-amber-400 font-mono">{portfolioStats.bankingExposurePercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full" 
                  style={{ width: `${Math.min(100, portfolioStats.bankingExposurePercent)}%` }} 
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">
                ⚠️ Financials are above 35% cap. Deploy new capital into IT & Healthcare.
              </p>
            </div>
          </div>

          <button
            id="open-portfolio-from-command-btn"
            onClick={() => setActiveTab('portfolio')}
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Inspect Portfolio Analytics</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* TODAY'S PERSONAL ACTION (Section 7 & 39) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              What should you do today?
            </h2>
            <p className="text-xs text-slate-400">
              Clear, disciplined actions matched specifically to your ₹15K budget and risk profile.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">
            5 Action Categories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. BUY */}
          <div
            id="action-card-buy"
            onClick={() => setSelectedStockSymbol('TCS')}
            className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/10 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🟢 BUY NOW
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">2 Stocks</span>
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
              Attractive Entry Points
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              <strong>TCS</strong> & <strong>Sun Pharma</strong> are fundamentally pristine and resting inside preferred entry zones.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <span>View Stock Intelligence</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* 2. ACCUMULATE */}
          <div
            id="action-card-accumulate"
            onClick={() => setSelectedStockSymbol('RELIANCE')}
            className="p-4 rounded-xl bg-slate-900 border border-teal-500/40 hover:border-teal-400 hover:bg-teal-950/10 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded font-bold text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30">
                🟢 ACCUMULATE
              </span>
              <span className="text-xs font-mono font-bold text-teal-400">4 Stocks</span>
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
              Gradual Position Building
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              <strong>Reliance, L&T, Bharti Airtel</strong> are inside accumulation ranges; allocate in systematic tranches.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-teal-400 flex items-center gap-1">
              <span>Inspect Accumulation Tranches</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* 3. WATCH */}
          <div
            id="action-card-watch"
            onClick={() => setActiveTab('watchlist')}
            className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/10 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded font-bold text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                🟡 WATCH
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">7 Stocks</span>
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
              High Quality, Stretched Price
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              <strong>Titan, Trent, Polycab</strong> are strong companies but currently expensive. Wait for margin of safety.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
              <span>View Watchlist Distances</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* 4. HOLD */}
          <div
            id="action-card-hold"
            onClick={() => setActiveTab('portfolio')}
            className="p-4 rounded-xl bg-slate-900 border border-blue-500/40 hover:border-blue-400 hover:bg-blue-950/10 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded font-bold text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                🔵 HOLD
              </span>
              <span className="text-xs font-mono font-bold text-blue-400">4 Holdings</span>
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
              Intact Long-Term Thesis
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              <strong>HDFC Bank & ICICI Bank</strong> are compounding smoothly (+32% gain). Do not sell simply because price rose.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-blue-400 flex items-center gap-1">
              <span>Check Thesis Checklist</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* 5. REVIEW */}
          <div
            id="action-card-review"
            onClick={() => openReviewModal(apexChemHolding)}
            className="p-4 rounded-xl bg-slate-900 border border-rose-500/40 hover:border-rose-400 hover:bg-rose-950/20 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded font-bold text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30">
                🔴 REVIEW
              </span>
              <span className="text-xs font-mono font-bold text-rose-400">1 Alert</span>
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
              Requires Structured Decision
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              <strong>Apex Specialty Chem:</strong> Operating margin halved and debt spiked. Reassess original thesis.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-rose-400 flex items-center gap-1">
              <span>Open Decision Tool</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>

      {/* MONTHLY ₹15,000 INVESTMENT PLAN (Section 8) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Your Monthly ₹15,000 Investment Plan
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Current Cycle
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Available Budget: <strong className="text-white font-mono">₹15,000</strong> • AI Recommended Deployment: <strong className="text-emerald-400 font-mono">₹12,000</strong>
            </p>
          </div>

          <button
            id="view-full-plan-btn"
            onClick={() => setActiveTab('plan')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <span>Customize Allocation Plan</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Plan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="pb-2.5">Stock / Asset</th>
                <th className="pb-2.5">Sector</th>
                <th className="pb-2.5">AI Action</th>
                <th className="pb-2.5 text-right">Allocation</th>
                <th className="pb-2.5 pl-4">Strategic Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {monthlyPlan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 font-bold text-white font-mono flex items-center gap-2">
                    {item.assetName}
                  </td>
                  <td className="py-3 text-slate-400">{item.sector}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        item.action === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.action === 'ACCUMULATE'
                          ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.action}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-extrabold text-white text-xs">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 pl-4 text-slate-300 text-[11px] leading-relaxed max-w-md">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-750 font-bold">
                <td className="pt-3 text-white text-xs" colSpan={3}>
                  Total Monthly Capital Allocation:
                </td>
                <td className="pt-3 text-right font-mono font-black text-emerald-400 text-sm">
                  ₹15,000
                </td>
                <td className="pt-3 pl-4 text-[10px] text-slate-400 italic">
                  💡 "You don't have to invest the entire amount if attractive entry points are unavailable."
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
