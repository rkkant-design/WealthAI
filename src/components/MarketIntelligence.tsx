import React, { useState } from 'react';
import { 
  BarChart3, 
  Globe2, 
  Landmark, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  DollarSign, 
  Fuel, 
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';
import { SampleDataNotice, SampleBadge } from './SampleDataNotice';
import { LiveBadge, QuoteCard, PulseLoading, PulseError } from './LiveMarketWidgets';

export const MarketIntelligence: React.FC = () => {
  const { macroIndicators, marketPulse, marketPulseStatus, setActiveTab } = useWealth();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'macro' | 'global'>('overview');

  const hasLiveGlobal = !!marketPulse && marketPulse.global.length > 0;
  const regime = marketPulse?.regime ?? null;

  // USD/INR and crude are live on the Global Factors tab, so drop their stale sample cards here.
  const economicList = macroIndicators.filter(
    (m) => m.category === 'economic' && !(hasLiveGlobal && /usd|brent|crude/i.test(m.name))
  );

  const renderPulseState = () =>
    marketPulseStatus === 'loading' ? <PulseLoading /> : <PulseError />;

  return (
    <div id="market-intelligence-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Macro & Institutional Radar
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            India Market Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Macroeconomic context, monetary policy, institutional capital flows and global drivers.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            id="tab-market-overview"
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Market Overview
          </button>
          <button
            id="tab-economic-indicators"
            onClick={() => setActiveSubTab('macro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'macro'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Economic Indicators
          </button>
          <button
            id="tab-global-factors"
            onClick={() => setActiveSubTab('global')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'global'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Global Factors
          </button>
        </div>
      </div>

      {/* Market Overview Section */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <SampleDataNotice>
            The institutional flow figures (FII / DII) below are fixed examples and are not updated. The breadth and
            volatility panel further down is live.
          </SampleDataNotice>

          {/* Institutional Capital Flows (FII vs DII) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Domestic Institutional Investors (DII)
                </span>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Relentless Net Inflow
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Net buying (example)</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">+₹1,850 Cr</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Monthly SIP Run-Rate</span>
                  <span className="text-sm font-bold text-white font-mono">₹23,547 Cr / Mo</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Indian retail mutual fund inflows continue to create a structural liquidity floor, absorbing foreign sales and supporting large-cap index valuations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Foreign Institutional Investors (FII)
                </span>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Mixed / Selective
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Today's Net Flow</span>
                  <span className="text-2xl font-black text-slate-300 font-mono">-₹420 Cr</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">FII Debt Inflows (Bond Index)</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">+₹8,920 Cr</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Foreign investors are rotating out of high-multiple midcaps into Indian G-Secs following JP Morgan Emerging Market Bond Index inclusion.
              </p>
            </div>
          </div>

          {/* Sector breadth & volatility (live) */}
          {regime && marketPulse ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-white">Sector breadth & volatility</h3>
                  <p className="text-xs text-slate-400">How many NSE sector indices rose today, and how nervous the market is</p>
                </div>
                <LiveBadge asOf={marketPulse.asOf} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-xs text-emerald-400 font-bold block mb-1">Sectors up today</span>
                  <span className="text-2xl font-black text-white font-mono">{regime.sectorsUp}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">of {regime.sectorsTotal} sector indices</span>
                </div>
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                  <span className="text-xs text-rose-400 font-bold block mb-1">Sectors down today</span>
                  <span className="text-2xl font-black text-white font-mono">{regime.sectorsTotal - regime.sectorsUp}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">of {regime.sectorsTotal} sector indices</span>
                </div>
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
                  <span className="text-xs text-blue-400 font-bold block mb-1">India VIX (volatility)</span>
                  <span className="text-2xl font-black text-white font-mono">{regime.vix ?? '—'}</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">
                    {regime.volatility === 'Unknown' ? 'Unavailable' : `${regime.volatility} volatility`} (below 13 low · above 20 high)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            renderPulseState()
          )}
        </div>
      )}

      {/* Economic Indicators Section */}
      {activeSubTab === 'macro' && (
        <div className="space-y-4">
          <SampleDataNotice>
            These Indian economic indicators are fixed examples and may be months out of date.
            {hasLiveGlobal && ' Live USD/INR and crude oil prices are on the Global Factors tab.'}
          </SampleDataNotice>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Indian Domestic Macroeconomic Fundamentals</h3>
            </div>
            <SampleBadge />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {economicList.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{item.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.status === 'positive'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : item.status === 'neutral'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xl font-extrabold text-white font-mono">{item.value}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Factors Section */}
      {activeSubTab === 'global' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Global factors that move Indian stocks</h3>
            </div>
            {hasLiveGlobal && <LiveBadge asOf={marketPulse!.asOf} />}
          </div>

          {hasLiveGlobal ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketPulse!.global.map((q) => (
                <QuoteCard key={q.symbol} quote={q} />
              ))}
            </div>
          ) : (
            renderPulseState()
          )}
        </div>
      )}

      {/* Sector Navigation Quick Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 border border-blue-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">Looking for Sectoral Trends?</h4>
            <p className="text-[11px] text-slate-400">
              Inspect our comprehensive 15-sector valuation and momentum heatmap for Indian equities.
            </p>
          </div>
        </div>

        <button
          id="goto-sector-intelligence-btn"
          onClick={() => setActiveTab('sectors')}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all self-end sm:self-auto"
        >
          <span>Open Sector Intelligence</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
