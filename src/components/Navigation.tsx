import React from 'react';
import { ChevronRight, LogOut, X } from 'lucide-react';
import { useWealth } from '../context/WealthContext';
import { NAV_SECTIONS } from '../navigation';

interface NavigationProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, unreadAlertCount, investorProfile, portfolioStats, user, logout } = useWealth();

  // Small live indicators shown next to some pages.
  const badges: Record<string, { text: string | number; tone: 'neutral' | 'good' | 'alert' }> = {
    dashboard: { text: 'Live', tone: 'neutral' },
    plan: { text: `₹${Math.round(investorProfile.monthlyBudget / 1000)}K`, tone: 'neutral' },
  };
  if (portfolioStats.healthScore != null) {
    badges.portfolio = { text: `${portfolioStats.healthScore}/100`, tone: 'good' };
  }
  if (unreadAlertCount > 0) {
    badges.alerts = { text: unreadAlertCount, tone: 'alert' };
  }

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const horizonShort = investorProfile.investmentHorizon.split(' ')[0] || 'Long';

  return (
    <aside
      id="main-sidebar"
      aria-label="Main navigation"
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-72 bg-slate-900 border-r border-slate-800 text-slate-200 transition-transform duration-300 lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => handleSelectTab('dashboard')}
          className="flex items-center gap-3 text-left"
          title="Go to Dashboard"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-lg tracking-wider">
            WP
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight">WealthPilot</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">NSE & BSE research assistant</p>
          </div>
        </button>

        {/* Close button (mobile only) */}
        {setIsMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links, grouped into sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-4 last:mb-0">
            <div className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.pages.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const badge = badges[item.id];
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleSelectTab(item.id)}
                    title={item.description}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 group ${
                      isActive
                        ? 'bg-blue-600/15 text-white'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    {/* Active page marker */}
                    {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-blue-500" />}

                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-[18px] w-[18px] flex-shrink-0 ${
                          isActive ? 'text-blue-400' : item.isAi ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold flex-shrink-0 ${
                          badge.tone === 'alert'
                            ? 'bg-rose-500 text-white'
                            : badge.tone === 'good'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {badge.text}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Profile Anchor */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <button
          id="profile-footer-button"
          onClick={() => handleSelectTab('profile')}
          className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xs font-bold text-white shadow-inner flex-shrink-0">
                {investorProfile.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight truncate">{investorProfile.name}</p>
                <p className="text-[11px] text-blue-400 font-mono truncate max-w-[150px]">{user?.email || investorProfile.market}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-800/60 text-center text-[11px]">
            <div className="bg-slate-950/80 rounded py-1 px-1">
              <span className="text-slate-400 block text-[10px]">Risk</span>
              <span className="font-semibold text-emerald-400">{investorProfile.riskProfile}</span>
            </div>
            <div className="bg-slate-950/80 rounded py-1 px-1">
              <span className="text-slate-400 block text-[10px]">Horizon</span>
              <span className="font-semibold text-blue-400">{horizonShort}</span>
            </div>
            <div className="bg-slate-950/80 rounded py-1 px-1">
              <span className="text-slate-400 block text-[10px]">Monthly</span>
              <span className="font-semibold text-amber-400 font-mono">₹{Math.round(investorProfile.monthlyBudget / 1000)}K</span>
            </div>
          </div>
        </button>

        <button
          onClick={logout}
          className="w-full mt-2 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-slate-900/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors"
          title="Sign out or switch account"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
