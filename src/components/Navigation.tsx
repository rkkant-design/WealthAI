import React from 'react';
import { 
  Home, 
  BarChart3, 
  Layers, 
  Search, 
  Sparkles, 
  Briefcase, 
  Target, 
  Eye, 
  Bell, 
  BrainCircuit, 
  TrendingUp, 
  Bot, 
  UserCheck, 
  Cpu, 
  ShieldAlert, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

interface NavigationProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, unreadAlertCount, investorProfile, portfolioStats } = useWealth();

  const navItems = [
    { id: 'dashboard', label: 'Market Command Center', icon: Home, badge: 'Live' },
    { id: 'market', label: 'Market Intelligence', icon: BarChart3 },
    { id: 'sectors', label: 'Sector Intelligence', icon: Layers },
    { id: 'analyzer', label: 'Stock Analyzer', icon: Search },
    { id: 'opportunities', label: 'Opportunities', icon: Sparkles },
    { id: 'portfolio', label: 'My Portfolio', icon: Briefcase, count: `${portfolioStats.healthScore}/100` },
    { id: 'plan', label: 'Monthly Investment Plan', icon: Target, badge: '₹15K' },
    { id: 'watchlist', label: 'Watchlist', icon: Eye },
    { id: 'alerts', label: 'Alerts', icon: Bell, count: unreadAlertCount > 0 ? unreadAlertCount : undefined },
    { id: 'thesis', label: 'Investment Thesis', icon: BrainCircuit },
    { id: 'wealthplanner', label: 'Wealth Planner', icon: TrendingUp },
    { id: 'copilot', label: 'AI Wealth Copilot', icon: Bot, isAi: true },
    { id: 'summary', label: 'Architecture & Vision', icon: Cpu },
    { id: 'profile', label: 'Investor Profile', icon: UserCheck },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <aside
      id="main-sidebar"
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-72 bg-slate-900 border-r border-slate-800 text-slate-200 transition-transform duration-300 lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
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
            <p className="text-[11px] text-slate-400 font-medium">NSE India Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Core Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : item.isAi ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      isActive
                        ? 'bg-blue-700/80 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      item.id === 'alerts'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : isActive
                        ? 'bg-blue-700 text-white'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Profile Anchor */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <button
          id="profile-footer-button"
          onClick={() => handleSelectTab('profile')}
          className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {investorProfile.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{investorProfile.name}</p>
                <p className="text-[10px] text-slate-400">{investorProfile.market}</p>
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800/60 text-center text-[10px]">
            <div className="bg-slate-950/80 rounded py-0.5 px-1">
              <span className="text-slate-400 block text-[9px]">Risk</span>
              <span className="font-semibold text-emerald-400">{investorProfile.riskProfile}</span>
            </div>
            <div className="bg-slate-950/80 rounded py-0.5 px-1">
              <span className="text-slate-400 block text-[9px]">Horizon</span>
              <span className="font-semibold text-blue-400">Long</span>
            </div>
            <div className="bg-slate-950/80 rounded py-0.5 px-1">
              <span className="text-slate-400 block text-[9px]">SIP</span>
              <span className="font-semibold text-amber-400 font-mono">₹15K</span>
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
};
