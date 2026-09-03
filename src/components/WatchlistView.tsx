import React from 'react';
import { Eye, EyeOff, PlusCircle, ArrowRight, Trash2, Search, Target, ShieldCheck } from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const WatchlistView: React.FC = () => {
  const { watchlist, removeFromWatchlist, setSelectedStockSymbol, setIsAddInvestmentOpen } = useWealth();

  return (
    <div id="watchlist-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Entry Timing Radar
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            My High-Conviction Watchlist
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitored businesses awaiting margin-of-safety entry points before capital deployment.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-slate-400">
          {watchlist.length} Monitored Stocks
        </span>
      </div>

      {/* Watchlist Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {watchlist.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3">Stock & Sector</th>
                  <th className="pb-3 text-center">Score</th>
                  <th className="pb-3 text-right">Price</th>
                  <th className="pb-3 text-center">Entry Zone</th>
                  <th className="pb-3 text-center">Distance to Zone</th>
                  <th className="pb-3 text-center">Valuation</th>
                  <th className="pb-3 text-center">Action</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {watchlist.map((item) => (
                  <tr key={item.symbol} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedStockSymbol(item.symbol)}
                          className="font-mono font-bold text-white text-xs hover:text-blue-400 transition-colors"
                        >
                          {item.symbol}
                        </button>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {item.sector}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">{item.name}</span>
                    </td>

                    <td className="py-3.5 text-center font-mono font-bold text-cyan-400 text-xs">
                      {item.score}/100
                    </td>

                    <td className="py-3.5 text-right font-mono font-bold text-white text-xs">
                      ₹{item.currentPrice.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 text-center font-mono text-slate-300 text-[11px]">
                      {item.entryZone}
                    </td>

                    <td className="py-3.5 text-center">
                      <span
                        className={`font-semibold text-xs ${
                          item.inBuyZone ? 'text-emerald-400 font-bold' : 'text-amber-400'
                        }`}
                      >
                        {item.distanceToBuyZone}
                      </span>
                    </td>

                    <td className="py-3.5 text-center text-slate-300 text-xs font-medium">
                      {item.valuation}
                    </td>

                    <td className="py-3.5 text-center">
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

                    <td className="py-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedStockSymbol(item.symbol)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors"
                      >
                        Analyze
                      </button>
                      <button
                        onClick={() => removeFromWatchlist(item.symbol)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            Your watchlist is currently empty. Explore the Stock Analyzer to track attractive NSE stocks.
          </div>
        )}
      </div>
    </div>
  );
};
