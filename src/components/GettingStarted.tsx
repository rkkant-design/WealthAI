import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, X, Rocket } from 'lucide-react';
import { useWealth } from '../context/WealthContext';
import { getVisitedTabs, isOnboardingDismissed, dismissOnboarding } from '../navigation';

// First-run checklist shown on the Dashboard. Walks a new user through the four
// things that make the app useful, ticks steps off as they're done, and hides
// itself once everything is complete or the user dismisses it.
export const GettingStarted: React.FC = () => {
  const { setActiveTab, setIsAddInvestmentOpen, portfolio } = useWealth();
  const [dismissed, setDismissed] = useState(isOnboardingDismissed);
  const visited = getVisitedTabs();

  const steps = [
    {
      title: 'Set up your investor profile',
      description: 'Tell us your goals, risk level and monthly budget so suggestions fit you.',
      action: 'Open profile',
      onClick: () => setActiveTab('profile'),
      done: visited.includes('profile'),
    },
    {
      title: 'Look up a stock',
      description: 'Search any NSE/BSE company to see its live price and an AI analysis.',
      action: 'Open Stock Analyzer',
      onClick: () => setActiveTab('analyzer'),
      done: visited.includes('analyzer'),
    },
    {
      title: 'Add your first investment',
      description: 'Record a stock you own to track returns and portfolio health.',
      action: 'Add investment',
      onClick: () => setIsAddInvestmentOpen(true),
      done: portfolio.length > 0,
    },
    {
      title: 'Ask the AI Copilot',
      description: 'Ask in plain English, e.g. "Is my portfolio too risky?"',
      action: 'Open Copilot',
      onClick: () => setActiveTab('copilot'),
      done: visited.includes('copilot'),
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  if (dismissed || doneCount === steps.length) return null;

  const handleDismiss = () => {
    dismissOnboarding();
    setDismissed(true);
  };

  return (
    <section
      aria-label="Getting started"
      className="mb-6 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-900 p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <Rocket className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Welcome! Let's get you started</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Four quick steps to get the most out of WealthPilot. {doneCount} of {steps.length} done.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex-shrink-0"
          aria-label="Hide getting started guide"
          title="Hide this guide"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>

      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className={`rounded-xl border p-4 flex flex-col gap-3 ${
              step.done ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-slate-700/80 bg-slate-900/80'
            }`}
          >
            <div className="flex items-start gap-3">
              {step.done ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-semibold ${step.done ? 'text-slate-400 line-through' : 'text-white'}`}>
                  {i + 1}. {step.title}
                </p>
                <p className="text-[13px] text-slate-400 mt-0.5">{step.description}</p>
              </div>
            </div>
            {!step.done && (
              <button
                onClick={step.onClick}
                className="self-start ml-8 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                {step.action}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};
