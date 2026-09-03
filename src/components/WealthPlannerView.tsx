import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  Info,
  Layers,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useWealth } from '../context/WealthContext';

export const WealthPlannerView: React.FC = () => {
  const { investorProfile } = useWealth();

  const [monthlySip, setMonthlySip] = useState<number>(investorProfile.monthlyBudget);
  const [years, setYears] = useState<number>(15);
  const [stepUpAmount, setStepUpAmount] = useState<number>(2000); // Step up SIP per year
  const [includeStepUp, setIncludeStepUp] = useState<boolean>(true);

  // Generate Year-by-Year compounding data
  const calculateWealth = () => {
    const data = [];
    let investedTotal = 0;
    let baseVal = 0;
    let conservativeVal = 0;
    let optimisticVal = 0;

    for (let yr = 1; yr <= years; yr++) {
      const currentMonthlySip = includeStepUp ? monthlySip + (yr - 1) * stepUpAmount : monthlySip;
      const annualInvestment = currentMonthlySip * 12;
      investedTotal += annualInvestment;

      // Compound at 8%, 12%, 15%
      conservativeVal = (conservativeVal + annualInvestment) * 1.08;
      baseVal = (baseVal + annualInvestment) * 1.12;
      optimisticVal = (optimisticVal + annualInvestment) * 1.15;

      data.push({
        year: `Yr ${yr}`,
        Invested: Math.round(investedTotal / 100000), // in Lakhs
        Conservative: Math.round(conservativeVal / 100000),
        Base: Math.round(baseVal / 100000),
        Optimistic: Math.round(optimisticVal / 100000),
      });
    }

    return {
      chartData: data,
      finalInvested: investedTotal,
      finalBase: baseVal,
      finalOptimistic: optimisticVal,
      finalConservative: conservativeVal,
    };
  };

  const results = calculateWealth();

  const formatCroreLakh = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Crore`;
    }
    return `₹${(val / 100000).toFixed(1)} Lakh`;
  };

  return (
    <div id="wealth-planner-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Long-Term Compounding Simulation
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Retirement Wealth Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Model the exponential power of disciplined monthly capital deployment across 10-20 year horizons.
          </p>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          Illustrative Compounding Model
        </span>
      </div>

      {/* Control Sliders Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Monthly SIP */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-300">Monthly SIP:</span>
              <span className="font-mono font-black text-white text-sm">₹{monthlySip.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={monthlySip}
              onChange={(e) => setMonthlySip(parseInt(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹5,000</span>
              <span>₹25,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Horizon (Years) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-300">Compounding Horizon:</span>
              <span className="font-mono font-black text-cyan-400 text-sm">{years} Years</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 Yrs</span>
              <span>15 Yrs</span>
              <span>30 Yrs</span>
            </div>
          </div>

          {/* Annual Step-Up */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeStepUp}
                  onChange={(e) => setIncludeStepUp(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>Annual SIP Step-Up:</span>
              </label>
              <span className="font-mono font-black text-emerald-400 text-sm">
                {includeStepUp ? `+₹${stepUpAmount.toLocaleString('en-IN')}/yr` : 'Disabled'}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              disabled={!includeStepUp}
              value={stepUpAmount}
              onChange={(e) => setStepUpAmount(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer disabled:opacity-30"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>+₹500</span>
              <span>+₹2,000</span>
              <span>+₹10,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Results Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">Total Capital Outlay</span>
          <div className="text-lg font-black text-white font-mono">
            {formatCroreLakh(results.finalInvested)}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Your pocket savings</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">Conservative (8% CAGR)</span>
          <div className="text-lg font-black text-slate-300 font-mono">
            {formatCroreLakh(results.finalConservative)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Debt/Hybrid index baseline</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/40 bg-blue-950/20">
          <span className="text-[10px] text-blue-400 font-bold block mb-1">Base Case (12% CAGR)</span>
          <div className="text-xl font-black text-blue-300 font-mono">
            {formatCroreLakh(results.finalBase)}
          </div>
          <span className="text-[10px] text-blue-400 font-semibold block mt-1">NIFTY 50 20-Yr Average</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 bg-emerald-950/20">
          <span className="text-[10px] text-emerald-400 font-bold block mb-1">Optimistic (15% CAGR)</span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {formatCroreLakh(results.finalOptimistic)}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-1">High-ROCE Compounders</span>
        </div>
      </div>

      {/* Compounding Chart (Recharts) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              Wealth Accumulation Trajectory (₹ Lakhs)
            </h3>
            <p className="text-xs text-slate-400">
              Notice how compounding accelerates dramatically after Year 7.
            </p>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={results.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradOptimistic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} unit="L" />
              <Tooltip
                formatter={(value: any) => [`₹${value} Lakhs`, '']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="Optimistic" stroke="#10b981" fillOpacity={1} fill="url(#gradOptimistic)" />
              <Area type="monotone" dataKey="Base" stroke="#3b82f6" fillOpacity={1} fill="url(#gradBase)" />
              <Area type="monotone" dataKey="Invested" stroke="#94a3b8" fill="#64748b" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
