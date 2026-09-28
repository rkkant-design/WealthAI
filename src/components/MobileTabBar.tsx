import React from 'react';
import { Menu } from 'lucide-react';
import { useWealth } from '../context/WealthContext';
import { findPage } from '../navigation';

interface MobileTabBarProps {
  onOpenMenu: () => void;
}

// The pages people use most, one tap away at the bottom of the screen on phones.
// Everything else lives under "More" (the full sidebar).
const PRIMARY_TABS = ['dashboard', 'analyzer', 'portfolio', 'copilot'];

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ onOpenMenu }) => {
  const { activeTab, setActiveTab } = useWealth();
  const isOnPrimaryTab = PRIMARY_TABS.includes(activeTab);

  return (
    <nav
      aria-label="Quick navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur border-t border-slate-800 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5">
        {PRIMARY_TABS.map((id) => {
          const found = findPage(id);
          if (!found) return null;
          const { page } = found;
          const Icon = page.icon;
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate max-w-full px-1">{page.shortLabel || page.label}</span>
            </button>
          );
        })}
        <button
          onClick={onOpenMenu}
          className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
            isOnPrimaryTab ? 'text-slate-400 hover:text-white' : 'text-blue-400'
          }`}
        >
          <Menu className="h-5 w-5" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
};
