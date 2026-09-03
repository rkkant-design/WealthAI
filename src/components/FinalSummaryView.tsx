import React from 'react';
import { 
  User, 
  TrendingUp, 
  Layers, 
  Search, 
  Briefcase, 
  CheckCircle2, 
  Target, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Bot,
  Sparkles
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const FinalSummaryView: React.FC = () => {
  const { setActiveTab } = useWealth();

  const engineFlow = [
    {
      step: '1',
      title: 'Investor Profile',
      subtitle: 'Kamal • Medium Risk • ₹15K/mo',
      desc: 'Grounding every calculation in personal constraints, time horizon, and retirement goals.',
      icon: User,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      step: '2',
      title: 'NSE Market Context',
      subtitle: 'NIFTY 24,852 • Regime 84%',
      desc: 'Evaluating macro trends, institutional FII/DII liquidity, interest rates, and sector momentum.',
      icon: TrendingUp,
      color: 'from-indigo-600 to-cyan-600',
    },
    {
      step: '3',
      title: 'Stock Intelligence',
      subtitle: '9-Dimension Wealth Score',
      desc: 'Filtering fundamental moats, ROE/ROCE compounding, audited balance sheets, and clean management.',
      icon: Search,
      color: 'from-cyan-600 to-teal-600',
    },
    {
      step: '4',
      title: 'Valuation & Entry Timing',
      subtitle: 'Margin of Safety Engine',
      desc: 'Preventing overpaying by calculating preferred accumulation zones vs historical median multiples.',
      icon: Target,
      color: 'from-teal-600 to-emerald-600',
    },
    {
      step: '5',
      title: 'Portfolio & Thesis Memory',
      subtitle: '₹4.18L Value • Living Thesis',
      desc: 'Tracking why each holding was purchased so you never panic-sell during routine market noise.',
      icon: Briefcase,
      color: 'from-emerald-600 to-amber-600',
    },
    {
      step: '6',
      title: 'Disciplined Action Engine',
      subtitle: 'BUY • ACCUMULATE • REVIEW',
      desc: 'Deploying your monthly ₹15K systematically into underweighted high-conviction assets.',
      icon: CheckCircle2,
      color: 'from-amber-600 to-rose-600',
    },
  ];

  return (
    <div id="final-summary-view" className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/60 to-slate-900 border border-slate-750 shadow-2xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" /> Institutional Wealth Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          One Investor. One Portfolio. One AI Advisor.
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          WealthPilot AI replaces fragmented stock tips and emotional noise with a closed-loop institutional advisory system tailored to Indian capital markets.
        </p>
        <div className="pt-2">
          <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            "Don't just pick stocks. Build wealth."
          </span>
        </div>
      </div>

      {/* The 6-Step Closed Loop Pipeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white text-center">
          The End-to-End Wealth Generation Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {engineFlow.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                        Stage {step.step}
                      </span>
                      <h3 className="font-extrabold text-sm text-white">{step.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] font-mono font-semibold text-slate-300">
                  {step.subtitle}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="h-4 w-4" /> Living Thesis Memory
          </div>
          <p className="text-slate-300 leading-relaxed">
            Every investment is stamped with your core business hypothesis. The AI tracks quarterly results against this specific thesis—protecting you from panic-selling when stock prices dip for non-fundamental reasons.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Target className="h-4 w-4" /> Entry Point Timing Engine
          </div>
          <p className="text-slate-300 leading-relaxed">
            Great companies at poor valuations make poor investments. WealthPilot calculates explicit margin-of-safety buy zones, telling you when to buy aggressively and when to patiently wait.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Bot className="h-4 w-4" /> Server-Side Intelligence
          </div>
          <p className="text-slate-300 leading-relaxed">
            Powered by Google Gemini 2.5 on a secure full-stack Express architecture. No API keys exposed, strictly grounded in institutional financial logic.
          </p>
        </div>
      </div>

      {/* Quick Launch Action */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-white">Ready to deploy your capital?</h3>
          <p className="text-xs text-slate-400">
            Open your customized ₹15,000 September allocation plan or converse with the Copilot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('plan')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>View Monthly Plan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Bot className="h-3.5 w-3.5 text-cyan-400" />
            <span>Open AI Copilot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
