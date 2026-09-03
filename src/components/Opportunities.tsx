import React, { useState } from 'react';
import { 
  Sparkles, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  PlusCircle, 
  TrendingUp, 
  Database,
  Layers
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const Opportunities: React.FC = () => {
  const { 
    stocks, 
    setSelectedStockSymbol, 
    addToWatchlist, 
    isInWatchlist, 
    removeFromWatchlist, 
    setIsAddInvestmentOpen,
    openEvidenceModal
  } = useWealth();

  const [activeCategory, setActiveCategory] = useState<
    'quality' | 'valuation' | 'entry' | 'compounders' | 'avoid'
  >('entry');

  const [sectorFilter, setSectorFilter] = useState('All');
  const [marketCapFilter, setMarketCapFilter] = useState('All');

  // Filter logic per opportunity archetype
  const filteredStocks = stocks.filter((stock) => {
    // Category match
    let matchesCat = true;
    if (activeCategory === 'quality') {
      matchesCat = (stock.wealthScore ?? 0) >= 85;
    } else if (activeCategory === 'valuation') {
      matchesCat = stock.valuationEngine?.status === 'ATTRACTIVE' || stock.valuationEngine?.status === 'FAIR';
    } else if (activeCategory === 'entry') {
      matchesCat = (stock.entryPointEngine?.inZone ?? false) || stock.recommendation?.type === 'BUY' || stock.recommendation?.type === 'ACCUMULATE';
    } else if (activeCategory === 'compounders') {
      const roceNum = parseFloat(stock.fundamentals?.roce || '0');
      matchesCat = roceNum >= 18;
    } else if (activeCategory === 'avoid') {
      matchesCat = stock.recommendation?.type === 'WATCH' || stock.recommendation?.type === 'REVIEW' || stock.recommendation?.type === 'AVOID';
    }

    // Sector & Market Cap matches
    const matchesSector = sectorFilter === 'All' || stock.sector === sectorFilter;
    const matchesCap = marketCapFilter === 'All' || stock.marketCapCategory === marketCapFilter;

    return matchesCat && matchesSector && matchesCap;
  });

  const categories = [
    { id: 'entry', label: '🎯 Best Entry Points (Buy Now)', desc: 'Stocks currently trading inside preferred accumulation zones' },
    { id: 'quality', label: '🏆 Highest Quality Compounders', desc: 'Bedrock balance sheets with top moat & management' },
    { id: 'valuation', label: '💎 Best Valuation / Margin of Safety', desc: 'Fairly priced relative to historical cash generation' },
    { id: 'compounders', label: '🚀 High ROCE Compounders (20%+)', desc: 'High capital efficiency creating compounding shareholder wealth' },
    { id: 'avoid', label: '⚠️ Avoid / Overvalued for Now', desc: 'Elevated multiples or weakening operational metrics' },
  ];

  const uniqueSectors = ['All', ...Array.from(new Set(stocks.map((s) => s.sector)))];

  return (
    <div id="opportunities-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Institutional Screener & Opportunity Radar
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            NSE Stock Opportunities
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Curated ideas filtered by fundamentals, fair value margin of safety, and timing zones.
          </p>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`opportunity-tab-${cat.id}`}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-xs leading-tight mb-1">{cat.label}</div>
            <div className={`text-[10px] leading-tight ${activeCategory === cat.id ? 'text-blue-100' : 'text-slate-400'}`}>
              {cat.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 flex-wrap text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-semibold">Sector:</span>
            <select
              id="filter-opp-sector"
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              {uniqueSectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-semibold">Market Cap:</span>
            <select
              id="filter-opp-market-cap"
              value={marketCapFilter}
              onChange={(e) => setMarketCapFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Market Caps</option>
              <option value="Large Cap">Large Cap</option>
              <option value="Mid Cap">Mid Cap</option>
              <option value="Small Cap">Small Cap</option>
            </select>
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          Showing <strong className="text-white">{filteredStocks.length}</strong> matching companies
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStocks.map((stock) => {
          const inWatchlist = isInWatchlist(stock.symbol);
          return (
            <div
              key={stock.symbol}
              id={`opp-card-${stock.symbol}`}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-white group-hover:text-blue-400 transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {stock.sector}
                      </span>
                    </div>
                    <h3 className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{stock.name}</h3>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-white font-mono">
                      ₹{stock.currentPrice.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        stock.recommendation.type === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : stock.recommendation.type === 'ACCUMULATE'
                          ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                          : stock.recommendation.type === 'WATCH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {stock.recommendation.type}
                    </span>
                  </div>
                </div>

                {/* Score & Entry Zone Strip */}
                <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Wealth Score</span>
                    <span className="font-bold text-cyan-400 font-mono text-sm">{stock.wealthScore}/100</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Valuation</span>
                    <span className="font-bold text-white text-[11px]">{stock.valuationEngine.status}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Entry Zone</span>
                    <span className={`font-bold text-[11px] ${stock.entryPointEngine.inZone ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {stock.entryPointEngine.inZone ? 'In Buy Zone' : `${stock.entryPointEngine.distanceToPreferredZonePercent}% away`}
                    </span>
                  </div>
                </div>

                {/* Thesis summary */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {stock.investmentThesis.summary}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  id={`opp-analyze-btn-${stock.symbol}`}
                  onClick={() => setSelectedStockSymbol(stock.symbol)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <span>Deep Analyze</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`opp-watch-btn-${stock.symbol}`}
                    onClick={() => {
                      if (inWatchlist) removeFromWatchlist(stock.symbol);
                      else addToWatchlist(stock.symbol);
                    }}
                    className={`p-1.5 rounded-lg border text-xs ${
                      inWatchlist
                        ? 'bg-slate-800 text-amber-400 border-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                    title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {stock.evidence && (
                    <button
                      id={`opp-evidence-btn-${stock.symbol}`}
                      onClick={() => openEvidenceModal(stock.name, stock.evidence)}
                      className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-blue-400 hover:text-white"
                      title="View Evidence"
                    >
                      <Database className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
