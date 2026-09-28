import React from 'react';
import { TrendingUp, TrendingDown, Radio, AlertCircle, Loader2 } from 'lucide-react';
import { LiveQuote } from '../types';

/* Shared building blocks for sections backed by /api/market-pulse. */

export function formatQuoteValue(q: LiveQuote): string {
  const digits = q.value >= 1000 ? 0 : 2;
  const num = q.value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return `${q.prefix || ''}${num}${q.suffix || ''}`;
}

function formatAsOf(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export const LiveBadge: React.FC<{ asOf?: string; label?: string }> = ({ asOf, label = 'Live' }) => (
  <span
    title="Fetched from Yahoo Finance. Prices can be delayed by up to ~15 minutes."
    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
  >
    <Radio className="h-3 w-3" />
    {label}
    {asOf && <span className="font-mono normal-case tracking-normal text-emerald-400/80">· {formatAsOf(asOf)}</span>}
  </span>
);

export const PulseLoading: React.FC<{ text?: string }> = ({ text = 'Loading live market data…' }) => (
  <div className="flex items-center gap-2 p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-400">
    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
    {text}
  </div>
);

export const PulseError: React.FC = () => (
  <div className="flex items-start gap-2 p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-400">
    <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
    Live market data couldn't be loaded right now. It will retry automatically in a few minutes.
  </div>
);

const Change: React.FC<{ pct: number | null; label?: string }> = ({ pct, label }) => {
  if (pct === null) return <span className="text-slate-500">—</span>;
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 font-mono font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? '+' : ''}
      {pct.toFixed(2)}%{label && <span className="text-slate-500 font-normal ml-1">{label}</span>}
    </span>
  );
};

export const QuoteCard: React.FC<{ quote: LiveQuote }> = ({ quote }) => (
  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-bold text-slate-300">{quote.name}</span>
      <span className="text-[11px]">
        <Change pct={quote.changePercent} label="today" />
      </span>
    </div>
    <div className="text-xl font-extrabold text-white font-mono">{formatQuoteValue(quote)}</div>
    <div className="text-[11px]">
      <Change pct={quote.change1mPercent} label="1 month" />
    </div>
    {quote.description && <p className="text-[11px] text-slate-400 leading-relaxed">{quote.description}</p>}
  </div>
);

/** Sector indices ranked by today's move, with a 1-month change column. */
export const SectorPerformanceTable: React.FC<{ sectors: LiveQuote[] }> = ({ sectors }) => {
  const sorted = [...sectors].sort((a, b) => b.changePercent - a.changePercent);
  const maxAbs = Math.max(1, ...sorted.map((s) => Math.abs(s.changePercent)));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
            <th className="pb-2 pr-3">Sector</th>
            <th className="pb-2 pr-3 text-right">Index level</th>
            <th className="pb-2 pr-3 text-right">Today</th>
            <th className="pb-2 pr-3 hidden sm:table-cell w-1/4"></th>
            <th className="pb-2 text-right">1 month</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {sorted.map((s) => {
            const up = s.changePercent >= 0;
            return (
              <tr key={s.symbol}>
                <td className="py-2.5 pr-3 font-semibold text-white">{s.name}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-slate-300">{formatQuoteValue(s)}</td>
                <td className="py-2.5 pr-3 text-right text-xs">
                  <Change pct={s.changePercent} />
                </td>
                <td className="py-2.5 pr-3 hidden sm:table-cell">
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${up ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${(Math.abs(s.changePercent) / maxAbs) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="py-2.5 text-right text-xs">
                  <Change pct={s.change1mPercent} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
