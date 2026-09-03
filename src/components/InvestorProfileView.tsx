import React, { useState } from 'react';
import { UserCheck, Save, CheckCircle2, ShieldCheck, Target, Layers } from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const InvestorProfileView: React.FC = () => {
  const { investorProfile, updateInvestorProfile, regenerateMonthlyPlan } = useWealth();

  const [name, setName] = useState(investorProfile.name);
  const [riskProfile, setRiskProfile] = useState(investorProfile.riskProfile);
  const [investmentHorizon, setInvestmentHorizon] = useState(investorProfile.investmentHorizon);
  const [monthlyBudget, setMonthlyBudget] = useState(investorProfile.monthlyBudget);
  const [goal, setGoal] = useState(investorProfile.goal || investorProfile.primaryObjective || 'Retirement & Long-Term Compounding');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateInvestorProfile({
      name,
      riskProfile,
      investmentHorizon,
      monthlyBudget,
      goal,
    });
    regenerateMonthlyPlan(monthlyBudget);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div id="investor-profile-view" className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Personal Advisory Baseline
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Investor Profile & Preferences
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            The AI grounds all stock fit calculations and monthly plans in these specific parameters.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 text-xs">
        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Profile saved and monthly plan recalibrated!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Investor Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Market Focus</label>
            <input
              type="text"
              disabled
              value={investorProfile.market}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 font-semibold cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Risk Tolerance</label>
            <select
              value={riskProfile}
              onChange={(e) => setRiskProfile(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="Conservative">Conservative (Capital Preservation Focus)</option>
              <option value="Medium">Medium (Balanced Compounding & Growth)</option>
              <option value="Aggressive">Aggressive (High Alpha / Mid-Small Cap)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Investment Time Horizon</label>
            <select
              value={investmentHorizon}
              onChange={(e) => setInvestmentHorizon(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="Short Term (1-3 Years)">Short Term (1-3 Years)</option>
              <option value="Medium Term (3-7 Years)">Medium Term (3-7 Years)</option>
              <option value="Long Term (10-20 Years)">Long Term (10-20 Years)</option>
              <option value="Generational Wealth (20+ Years)">Generational Wealth (20+ Years)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Monthly Investment Budget (₹)</label>
            <input
              type="number"
              step="500"
              min="1000"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Primary Financial Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Preferred Sectors Strip */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="font-bold text-slate-300 block">Preferred Allocation Sectors</span>
          <div className="flex flex-wrap gap-2">
            {investorProfile.preferredSectors.map((sec, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                {sec}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            id="save-investor-profile-btn"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Update & Recalibrate Advisor</span>
          </button>
        </div>
      </form>
    </div>
  );
};
