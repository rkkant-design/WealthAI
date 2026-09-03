import React, { useState } from 'react';
import { 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Filter,
  Search
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const SectorIntelligence: React.FC = () => {
  const { sectors, setSelectedStockSymbol, setActiveTab } = useWealth();
  const [outlookFilter, setOutlookFilter] = useState<'All' | 'Positive' | 'Neutral' | 'Cautious'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSectors = sectors.filter((s) => {
    const matchesOutlook = outlookFilter === 'All' || s.aiOutlook === outlookFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOutlook && matchesSearch;
  });

  const getOutlookBadgeClass = (outlook: string) => {
    switch (outlook) {
      case 'Positive':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Neutral':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Cautious':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getValuationBadgeClass = (val: string) => {
    switch (val) {
      case 'Cheap':
        return 'text-emerald-400';
      case 'Fair':
        return 'text-blue-400';
      case 'Slightly Expensive':
        return 'text-amber-400';
      case 'Expensive':
        return 'text-rose-400';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div id="sector-intelligence-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Sectoral Heatmap & Allocations
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            NSE Sector Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Deep dive across 15 core Indian industrial and consumer sectors to determine valuation attractiveness.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              id="sector-search-input"
              type="text"
              placeholder="Search sectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            {(['All', 'Positive', 'Neutral', 'Cautious'] as const).map((filter) => (
              <button
                key={filter}
                id={`filter-sector-${filter.toLowerCase()}`}
                onClick={() => setOutlookFilter(filter)}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  outlookFilter === filter
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSectors.map((sector) => (
          <div
            key={sector.id}
            id={`sector-card-${sector.id}`}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between space-y-4 group"
          >
            <div>
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors">
                    {sector.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    NIFTY 50 Weight: <strong className="text-slate-200 font-mono">{sector.weightInNifty}%</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getOutlookBadgeClass(
                      sector.aiOutlook
                    )}`}
                  >
                    AI: {sector.aiOutlook}
                  </span>
                </div>
              </div>

              {/* 5 Metric Attributes */}
              <div className="grid grid-cols-5 gap-1.5 my-3 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Trend</span>
                  <span className="font-bold text-[11px] text-emerald-400">{sector.trend}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Valuation</span>
                  <span className={`font-bold text-[11px] ${getValuationBadgeClass(sector.valuation)}`}>
                    {sector.valuation}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Momentum</span>
                  <span className="font-bold text-[11px] text-white">{sector.momentum}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Earnings</span>
                  <span className="font-bold text-[11px] text-emerald-400">{sector.earnings}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Risk</span>
                  <span
                    className={`font-bold text-[11px] ${
                      sector.risk === 'Low'
                        ? 'text-emerald-400'
                        : sector.risk === 'Medium'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {sector.risk}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {sector.description}
              </p>
            </div>

            {/* Bottom Recommendation Anchor */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Key Leaders: <strong className="text-slate-200">{sector.topStock}</strong>
              </span>

              <button
                id={`explore-sector-leaders-${sector.id}`}
                onClick={() => {
                  if (sector.id === 'it') setSelectedStockSymbol('TCS');
                  else if (sector.id === 'pharma') setSelectedStockSymbol('SUNPHARMA');
                  else if (sector.id === 'energy') setSelectedStockSymbol('RELIANCE');
                  else if (sector.id === 'banking') setSelectedStockSymbol('ICICIBANK');
                  else if (sector.id === 'infra') setSelectedStockSymbol('LT');
                  else if (sector.id === 'consumer') setSelectedStockSymbol('TITAN');
                  else setSelectedStockSymbol('RELIANCE');
                  setActiveTab('analyzer');
                }}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <span>Analyze Leader</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
