import React from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  AlertTriangle, 
  PlusCircle, 
  CheckCircle2, 
  Database, 
  FileEdit, 
  ArrowRight, 
  ShieldAlert, 
  Layers,
  PieChart as PieIcon,
  Info,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import { useWealth } from '../context/WealthContext';

export const MyPortfolio: React.FC = () => {
  const { 
    portfolio, 
    portfolioStats, 
    setIsAddInvestmentOpen, 
    openEvidenceModal, 
    openReviewModal, 
    setSelectedStockSymbol,
    stocks,
    investorProfile
  } = useWealth();

  // Sector breakdown data for Pie Chart
  const sectorDataMap: Record<string, number> = {};
  portfolio.forEach((p) => {
    sectorDataMap[p.sector] = (sectorDataMap[p.sector] || 0) + p.currentValue;
  });

  const pieData = Object.entries(sectorDataMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const attentionHoldings = portfolio.filter((p) => p.thesisStatus === 'WEAKENING' || p.recommendation === 'REVIEW');

  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/portfolio/export-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: portfolio, profile: investorProfile }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WealthPilot_Portfolio_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div id="my-portfolio-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Personal Wealth Vault • Persistent Memory
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {investorProfile.name}'s Investment Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Long-term compounding holdings tracked against fundamental quarterly thesis milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <button
            id="portfolio-export-csv-btn"
            onClick={handleExportCSV}
            disabled={isExporting || portfolio.length === 0}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all disabled:opacity-50"
            title="Download full portfolio breakdown as an Excel/CSV spreadsheet"
          >
            <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce text-blue-400' : 'text-slate-400'}`} />
            <span>{isExporting ? 'Generating CSV...' : 'Export Portfolio CSV'}</span>
          </button>

          <button
            id="portfolio-add-investment-btn"
            onClick={() => setIsAddInvestmentOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Record New Investment</span>
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards (Section 27) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 block mb-1">Total Capital Invested</span>
          <div className="text-xl font-black text-white font-mono">
            ₹{portfolioStats.totalInvested.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Cost of acquisition</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 block mb-1">Current Portfolio Value</span>
          <div className="text-xl font-black text-white font-mono">
            ₹{portfolioStats.currentValue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Live NSE valuation</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 block mb-1">Total Returns (P&L)</span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            +₹{portfolioStats.totalGain.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] font-bold text-emerald-300 font-mono block mt-1">
            +{portfolioStats.gainPercent}% Overall
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 block mb-1">Annualized Return (XIRR)</span>
          <div className="text-xl font-black text-cyan-300 font-mono">
            {portfolioStats.xirr}%
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">vs NIFTY 50 (13.2%)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 block mb-1">Portfolio Health Score</span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {portfolioStats.healthScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {portfolioStats.healthScore > 80 ? 'Grade A (Disciplined)' : 'Needs Diversification'}
          </span>
        </div>
      </div>

      {/* Stocks That Need Attention Banner (Section 30) */}
      {attentionHoldings.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-rose-950/30 border border-rose-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-rose-900/40 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400 animate-pulse" />
              <h3 className="font-extrabold text-sm text-white">
                Stocks That Need Your Attention ({attentionHoldings.length})
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Active Action Required
            </span>
          </div>

          <div className="space-y-2">
            {attentionHoldings.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">{item.stockSymbol}</span>
                    <span className="text-xs text-slate-400">({item.stockName})</span>
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">
                      Current Gain: +{item.returnsPercent}%
                    </span>
                  </div>
                  <p className="text-xs text-rose-300 mt-0.5">
                    ⚠️ {item.recommendationReason}
                  </p>
                </div>

                <button
                  id={`review-btn-${item.id}`}
                  onClick={() => openReviewModal(item)}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto flex items-center gap-1.5"
                >
                  <span>Review Investment Thesis</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diversification & Sector Breakdown (Section 28) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sector Donut Chart */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sector Concentration Breakdown
            </span>
            <PieIcon className="h-4 w-4 text-blue-400" />
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Value']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {pieData.map((sec, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300">{sec.name}</span>
                </div>
                <span className="font-mono font-bold text-white">
                  ₹{sec.value.toLocaleString('en-IN')} (
                  {((sec.value / portfolioStats.currentValue) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Concentration Alert & AI Sector Insight */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Diversification & Concentration Guardrails
              </span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Banking Weight: {portfolioStats.bankingExposurePercent}%
              </span>
            </div>

            {/* Warning Callout */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 my-3 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <AlertTriangle className="h-4 w-4" /> Banking Concentration Above 35% Limit
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your portfolio holds <strong className="text-white">57.5%</strong> in Indian Financials (HDFC Bank & ICICI Bank). While both are blue-chip compounders, high concentration exposes your capital to systemic credit-cycle volatility.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300 space-y-1">
              <span className="text-blue-300 font-bold block flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> AI Recommended Rebalancing Strategy:
              </span>
              <p className="text-[11px] leading-relaxed">
                Do not panic-sell HDFC Bank or ICICI Bank. Instead, direct your upcoming <strong>₹15,000/month</strong> investment allocations entirely into underrepresented defensive sectors: <strong>IT & Software (TCS), Pharma (Sun Pharma), and Broad Market ETFs (NIFTYBEES)</strong>.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Market Cap: <strong>88% Large Cap • 12% Mid Cap</strong></span>
            <span>Target Concentration per stock: <strong>&le; 20%</strong></span>
          </div>
        </div>
      </div>

      {/* CORE HOLD / SELL ENGINE TABLE (Section 29) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              Hold / Sell Engine & Living Thesis Memory
            </h2>
            <p className="text-xs text-slate-400">
              Track why you bought each stock, current conviction score, and AI discipline recommendations.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {portfolio.length} Total Positions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="pb-3">Stock & Sector</th>
                <th className="pb-3 text-right">Avg Price</th>
                <th className="pb-3 text-right">Current Price</th>
                <th className="pb-3 text-right">Total Gain</th>
                <th className="pb-3 text-right">Weight</th>
                <th className="pb-3 pl-3">Original Purchase Thesis</th>
                <th className="pb-3 text-center">Score</th>
                <th className="pb-3 text-center">Action</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {portfolio.map((item) => {
                const stockData = stocks.find((s) => s.symbol === item.stockSymbol);
                const isGain = item.returnsPercent >= 0;
                return (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                    {/* Stock Name */}
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedStockSymbol(item.stockSymbol)}
                          className="font-mono font-bold text-white text-xs hover:text-blue-400 transition-colors text-left"
                        >
                          {item.stockSymbol}
                        </button>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {item.sector}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                        {item.stockName} ({item.quantity} shs)
                      </span>
                    </td>

                    {/* Avg Buy */}
                    <td className="py-3.5 text-right font-mono text-slate-300 text-xs">
                      ₹{item.buyPrice.toLocaleString('en-IN')}
                    </td>

                    {/* Current */}
                    <td className="py-3.5 text-right font-mono font-bold text-white text-xs">
                      ₹{item.currentPrice.toLocaleString('en-IN')}
                    </td>

                    {/* Return */}
                    <td className="py-3.5 text-right">
                      <div className={`font-mono font-bold text-xs ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isGain ? '+' : ''}{item.returnsPercent}%
                      </div>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {isGain ? '+₹' : '-₹'}{Math.abs(item.returnsValue).toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Weight */}
                    <td className="py-3.5 text-right font-mono font-semibold text-slate-300 text-xs">
                      {item.weightInPortfolio}%
                    </td>

                    {/* Thesis */}
                    <td className="py-3.5 pl-3 max-w-xs text-[11px] text-slate-300 leading-relaxed">
                      "{item.investmentReason || item.investmentThesis}"
                    </td>

                    {/* Score */}
                    <td className="py-3.5 text-center font-mono font-bold text-cyan-400 text-xs">
                      {item.convictionScore}/100
                    </td>

                    {/* Action */}
                    <td className="py-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                          item.recommendation === 'HOLD'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : item.recommendation === 'ACCUMULATE'
                            ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                        }`}
                      >
                        {item.recommendation}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right space-x-1 whitespace-nowrap">
                      {stockData && stockData.evidence && (
                        <button
                          id={`evidence-btn-${item.id}`}
                          onClick={() => openEvidenceModal(item.stockName, stockData.evidence)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white transition-colors"
                          title="View Audited Evidence"
                        >
                          <Database className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <button
                        id={`review-decision-btn-${item.id}`}
                        onClick={() => openReviewModal(item)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.recommendation === 'REVIEW'
                            ? 'bg-rose-600 hover:bg-rose-500 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                        title="Review Thesis & Reallocate"
                      >
                        <FileEdit className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
