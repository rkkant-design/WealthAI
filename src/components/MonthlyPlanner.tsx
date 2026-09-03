import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers, 
  RefreshCw, 
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const MonthlyPlanner: React.FC = () => {
  const { 
    investorProfile, 
    updateInvestorProfile, 
    monthlyPlan, 
    regenerateMonthlyPlan, 
    portfolioStats,
    setSelectedStockSymbol 
  } = useWealth();

  const [budget, setBudget] = useState<number>(investorProfile.monthlyBudget);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleBudgetChange = (newVal: number) => {
    setBudget(newVal);
    updateInvestorProfile({ monthlyBudget: newVal });
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      regenerateMonthlyPlan(budget);
      setIsRegenerating(false);
    }, 600);
  };

  const totalAllocated = monthlyPlan.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div id="monthly-planner-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Systematic Capital Deployment
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AI Monthly Investment Planner
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Translates your monthly SIP budget into disciplined, high-margin-of-safety equity tranches.
          </p>
        </div>

        <button
          id="regenerate-plan-btn"
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Recalculating...' : 'Regenerate Plan'}</span>
        </button>
      </div>

      {/* Profile Constraints & Budget Control Bar (Section 31) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Budget Slider */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-white uppercase tracking-wider">
                Monthly Capital Budget
              </label>
              <span className="text-lg font-black text-emerald-400 font-mono">
                ₹{budget.toLocaleString('en-IN')} / month
              </span>
            </div>
            <input
              id="monthly-budget-range-input"
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={budget}
              onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹5,000</span>
              <span>₹15,000 (Default)</span>
              <span>₹50,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Profile Constraints */}
          <div className="flex items-center gap-2 flex-wrap border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 text-xs">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 block">Risk Profile</span>
              <span className="font-bold text-emerald-400">{investorProfile.riskProfile}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 block">Time Horizon</span>
              <span className="font-bold text-blue-400">{investorProfile.investmentHorizon}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 block">Core Goal</span>
              <span className="font-bold text-amber-400">Retirement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Breakdown Table (Section 32) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              Recommended Capital Allocation Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Targeted to rebalance your 57% banking concentration and capture discounted entry points.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            Total: ₹{totalAllocated.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="pb-3">Stock / Asset</th>
                <th className="pb-3">Sector</th>
                <th className="pb-3 text-center">AI Action</th>
                <th className="pb-3 text-right">Allocation</th>
                <th className="pb-3 text-center">Fit Score</th>
                <th className="pb-3 pl-4">Strategic Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {monthlyPlan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 pr-3 font-bold text-white font-mono">
                    {item.symbol ? (
                      <button
                        onClick={() => setSelectedStockSymbol(item.symbol!)}
                        className="hover:text-blue-400 transition-colors text-left"
                      >
                        {item.assetName}
                      </button>
                    ) : (
                      <span className="text-amber-300">{item.assetName}</span>
                    )}
                  </td>
                  <td className="py-3.5 text-slate-400">{item.sector}</td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
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
                  <td className="py-3.5 text-right font-mono font-extrabold text-white text-xs">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 text-center font-mono font-bold text-cyan-400">
                    {item.portfolioFitScore}/100
                  </td>
                  <td className="py-3.5 pl-4 text-slate-300 text-[11px] leading-relaxed max-w-md">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tactical Cash Reserve Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
          <Info className="h-4 w-4" /> Core Principle: Why Reserve Dry Powder?
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>You do not have to deploy 100% of your monthly budget into equities if attractive entry points are unavailable.</strong> Preserving ₹3,000 in liquid cash this month allows you to avoid chasing overextended valuations in midcap momentum names, while remaining fully prepared for systemic dips.
        </p>
      </div>
    </div>
  );
};
