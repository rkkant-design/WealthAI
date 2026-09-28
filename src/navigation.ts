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
  Info,
  type LucideIcon,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Single source of truth for every page in the app.                          */
/* Used by the sidebar, the mobile tab bar and the page breadcrumb, so labels */
/* and descriptions stay consistent everywhere.                               */
/* -------------------------------------------------------------------------- */

export interface NavPage {
  id: string;
  label: string;
  shortLabel?: string; // used in the mobile tab bar where space is tight
  description: string;
  icon: LucideIcon;
  isAi?: boolean;
}

export interface NavSection {
  title: string;
  pages: NavPage[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Start here',
    pages: [
      { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: Home, description: "Today's market at a glance and your daily summary." },
      { id: 'copilot', label: 'AI Copilot', shortLabel: 'Copilot', icon: Bot, isAi: true, description: 'Ask questions about stocks or your portfolio in plain English.' },
    ],
  },
  {
    title: 'Research',
    pages: [
      { id: 'analyzer', label: 'Stock Analyzer', shortLabel: 'Stocks', icon: Search, description: 'Look up any NSE/BSE stock: live price plus an AI-estimated analysis.' },
      { id: 'market', label: 'Market Intelligence', icon: BarChart3, description: 'How the overall market is doing and what is driving it.' },
      { id: 'sectors', label: 'Sectors', icon: Layers, description: 'Compare industries such as banking, IT and pharma.' },
      { id: 'opportunities', label: 'Opportunities', icon: Sparkles, description: 'Stocks that may be worth a closer look.' },
    ],
  },
  {
    title: 'My money',
    pages: [
      { id: 'portfolio', label: 'My Portfolio', shortLabel: 'Portfolio', icon: Briefcase, description: 'Your holdings, returns and portfolio health.' },
      { id: 'watchlist', label: 'Watchlist', icon: Eye, description: "Stocks you're keeping an eye on but don't own yet." },
      { id: 'alerts', label: 'Alerts', icon: Bell, description: 'Price and risk alerts for the stocks you follow.' },
      { id: 'thesis', label: 'Investment Thesis', icon: BrainCircuit, description: 'Why you own each stock, and when to review that reason.' },
    ],
  },
  {
    title: 'Planning',
    pages: [
      { id: 'plan', label: 'Monthly Plan', icon: Target, description: 'How to split your monthly investment budget across stocks.' },
      { id: 'wealthplanner', label: 'Wealth Planner', icon: TrendingUp, description: 'See how regular investing could grow over the years.' },
    ],
  },
  {
    title: 'Account',
    pages: [
      { id: 'profile', label: 'Investor Profile', icon: UserCheck, description: 'Your goals, risk level and monthly budget.' },
      { id: 'summary', label: 'About WealthPilot', icon: Info, description: 'How the app works and where its data comes from.' },
    ],
  },
];

export function findPage(id: string): { page: NavPage; section: NavSection } | null {
  for (const section of NAV_SECTIONS) {
    const page = section.pages.find((p) => p.id === id);
    if (page) return { page, section };
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* First-run onboarding state (per browser).                                  */
/* -------------------------------------------------------------------------- */

const VISITED_KEY = 'wealthpilot_visited_tabs';
const ONBOARDING_DISMISSED_KEY = 'wealthpilot_onboarding_dismissed';

export function getVisitedTabs(): string[] {
  try {
    const saved = localStorage.getItem(VISITED_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function markTabVisited(id: string): void {
  try {
    const visited = getVisitedTabs();
    if (!visited.includes(id)) {
      localStorage.setItem(VISITED_KEY, JSON.stringify([...visited, id]));
    }
  } catch {
    // Storage unavailable (private mode) — onboarding just won't remember progress.
  }
}

export function isOnboardingDismissed(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function dismissOnboarding(): void {
  try {
    localStorage.setItem(ONBOARDING_DISMISSED_KEY, 'true');
  } catch {
    // ignore
  }
}
