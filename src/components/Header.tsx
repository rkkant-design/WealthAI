import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  Bell, 
  PlusCircle, 
  Sparkles, 
  Radio, 
  Info,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  X,
  ArrowRight
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { 
    stocks, 
    setSelectedStockSymbol, 
    marketRegime, 
    setIsDailyBriefingOpen, 
    setIsAddInvestmentOpen,
    unreadAlertCount,
    setActiveTab
  } = useWealth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const queryLower = searchQuery.trim().toLowerCase();

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(queryLower) ||
      s.name.toLowerCase().includes(queryLower) ||
      s.sector.toLowerCase().includes(queryLower)
  );

  const exactMatchExists = stocks.some(
    (s) => s.symbol.toLowerCase() === queryLower || s.name.toLowerCase() === queryLower
  );

  const handleSelectStock = (symbol: string) => {
    setSelectedStockSymbol(symbol);
    setActiveTab('analyzer');
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredStocks.length > 0) {
        handleSelectStock(filteredStocks[0].symbol);
      } else if (searchQuery.trim().length > 0) {
        handleSelectStock(searchQuery.trim().toUpperCase());
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const popularSymbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'SBIN', 'ITC', 'TATAMOTORS', 'TITAN', 'HAL', 'TRENT', 'ZOMATO'];

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-200">
      {/* Disclaimer strip */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 py-1 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-blue-400">
            <Radio className="h-3 w-3 animate-pulse text-blue-400" /> NSE India Advisory Agent
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-300">
            Understand the market. Invest with conviction. Build wealth for the future.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live NSE/BSE Market Data Connected
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Mobile menu button */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-toggle"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Quick Market Regime Pill */}
          <button
            id="header-regime-pill"
            onClick={() => setActiveTab('market')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-all text-xs font-semibold"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-[11px]">Regime:</span>
            <span className="text-emerald-300 font-bold">{marketRegime.status}</span>
            <span className="text-slate-400 font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
              {marketRegime.confidence}%
            </span>
          </button>
        </div>

        {/* Global Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="global-stock-search-input"
              type="text"
              placeholder="Search NSE stock quote (e.g. INFY, SBIN, ITC, Tata Motors)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
              {/* Header inside dropdown */}
              <div className="p-2.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">
                  {searchQuery ? `Matching Stocks (${filteredStocks.length})` : `All Tracked NSE Stocks (${stocks.length})`}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  Press <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-[9px] border border-slate-700">Enter ↵</kbd> to analyze
                </span>
              </div>

              {/* Popular Benchmark Pills if query is empty */}
              {!searchQuery && (
                <div className="p-2.5 bg-slate-900/60 border-b border-slate-800/80">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                    Popular Benchmarks & Compounders
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSymbols.map((sym) => {
                      const st = stocks.find((s) => s.symbol === sym);
                      return (
                        <button
                          key={sym}
                          onClick={() => handleSelectStock(sym)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 text-[11px] font-mono font-bold transition-colors border border-slate-700/80 flex items-center gap-1"
                        >
                          {sym}
                          {st && (
                            <span className="text-[10px] font-normal text-slate-400">
                              ₹{st.currentPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Quote Resolver / Analyze Option for any custom ticker */}
              {searchQuery.trim().length > 0 && !exactMatchExists && (
                <div className="p-2 border-b border-slate-800/80 bg-blue-950/40">
                  <button
                    type="button"
                    onClick={() => handleSelectStock(searchQuery.trim().toUpperCase())}
                    className="w-full p-2.5 rounded-lg bg-gradient-to-r from-blue-900/60 to-indigo-900/60 hover:from-blue-600 hover:to-indigo-600 border border-blue-500/40 text-left transition-all group flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-300 group-hover:rotate-12 transition-transform" />
                        <span className="font-bold text-xs text-cyan-200 group-hover:text-white font-mono">
                          Fetch Live NSE/BSE Quote for "{searchQuery.trim().toUpperCase()}"
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 group-hover:text-blue-100 mt-0.5">
                        Fetches live exchange prices, audited financials, institutional valuation, and penny stock/microcap risk checks
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 group-hover:bg-white group-hover:text-blue-900 text-[10px] font-bold font-mono">
                      Analyze ↵
                    </span>
                  </button>
                </div>
              )}

              {/* Stock list */}
              {filteredStocks.length > 0 ? (
                filteredStocks.slice(0, 25).map((stock) => {
                  const isPositive = stock.change >= 0;
                  return (
                    <button
                      key={stock.symbol}
                      id={`search-item-${stock.symbol}`}
                      onClick={() => handleSelectStock(stock.symbol)}
                      className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-slate-800/80 border-b border-slate-800/50 text-left transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-white font-mono group-hover:text-blue-400 transition-colors">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                            {stock.sector}
                          </span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-850 text-slate-400">
                            {stock.marketCapCategory}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{stock.name}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="font-mono font-bold text-xs text-white">
                          ₹{stock.currentPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-mono font-semibold flex items-center gap-0.5 ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {isPositive ? (
                              <TrendingUp className="h-2.5 w-2.5" />
                            ) : (
                              <TrendingDown className="h-2.5 w-2.5" />
                            )}
                            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </span>
                          <span className="text-slate-600 text-[9px]">•</span>
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-1 py-0.2 rounded">
                            Score: {stock.wealthScore}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                !searchQuery.trim() && (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Type any stock symbol or company name to search quotes.
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* 60s Brief Button */}
          <button
            id="daily-briefing-button"
            onClick={() => setIsDailyBriefingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">60s</span> Briefing
          </button>

          {/* Add Investment */}
          <button
            id="add-investment-top-button"
            onClick={() => setIsAddInvestmentOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">+ Add Investment</span>
          </button>

          {/* Alerts Icon */}
          <button
            id="header-alerts-button"
            onClick={() => setActiveTab('alerts')}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
