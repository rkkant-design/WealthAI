import React from 'react';
import { 
  X, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Briefcase
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const DailyBriefingModal: React.FC = () => {
  const { isDailyBriefingOpen, setIsDailyBriefingOpen, setActiveTab, setSelectedStockSymbol } = useWealth();

  if (!isDailyBriefingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="daily-briefing-modal-content"
        className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">Your 60-Second Market Brief</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Daily AI Executive
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="h-3 w-3" /> Market Regime: Cautiously Positive (84% Confidence)
              </p>
            </div>
          </div>
          <button
            id="close-daily-briefing-btn"
            onClick={() => setIsDailyBriefingOpen(false)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs leading-relaxed custom-scrollbar">
          {/* Section 1: Market */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-[11px] mb-1">
              <TrendingUp className="h-3.5 w-3.5" /> 1. Market: What Happened?
            </div>
            <p className="text-slate-300">
              NIFTY 50 advanced <strong className="text-emerald-400">+0.72%</strong> to 24,852, led by technology bellwethers and private banking strength. Midcaps and smallcaps showed mild consolidation (-0.18% & -0.43%) as broad valuation excesses cooling off.
            </p>
          </div>

          {/* Section 2: Why */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-[11px] mb-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> 2. Why: What Caused It?
            </div>
            <p className="text-slate-300">
              DIIs provided relentless support (+₹1,850 Cr net domestic inflows), while Brent crude softened to $78.40/bbl, easing India import inflation risks. US Fed commentary continues to signal a supportive global rate-cutting cycle.
            </p>
          </div>

          {/* Section 3: Impact */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px] mb-1">
              <Briefcase className="h-3.5 w-3.5" /> 3. Impact on Your Portfolio
            </div>
            <p className="text-slate-300">
              Your existing holdings (HDFC Bank, ICICI Bank, Reliance, TCS) are compounding steadily (+21.35% total portfolio gain). However, your banking concentration (57.5%) remains elevated; future monthly budget should prioritize non-financial compounders.
            </p>
          </div>

          {/* Section 4 & 5: Opportunities vs Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Today's Opportunities
              </div>
              <p className="text-slate-300 text-[11px]">
                <strong>TCS (₹4,190)</strong> and <strong>Sun Pharma (₹1,812)</strong> are currently resting squarely inside their preferred accumulation zones.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
              <div className="text-rose-400 font-bold uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Today's Risk Flag
              </div>
              <p className="text-slate-300 text-[11px]">
                <strong>Apex Specialty Chem:</strong> Operating margin collapse requires holding review. <strong>Titan:</strong> Expensive at 61x P/E; maintain WATCH.
              </p>
            </div>
          </div>

          {/* Bottom Recommended Action */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-blue-900/40 border border-blue-500/40 text-center">
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block mb-1">
              AI Action Verdict
            </span>
            <p className="text-sm font-extrabold text-white">
              "Continue gradual accumulation. Deploy ₹12,000 across TCS, Sun Pharma & ETF, holding ₹3,000 cash reserve."
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            id="view-monthly-plan-from-brief"
            onClick={() => {
              setIsDailyBriefingOpen(false);
              setActiveTab('plan');
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <span>View Monthly ₹15K Plan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            id="dismiss-daily-briefing-btn"
            onClick={() => setIsDailyBriefingOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close Brief
          </button>
        </div>
      </div>
    </div>
  );
};
