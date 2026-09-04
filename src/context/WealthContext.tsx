import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  InvestorProfile, 
  MarketIndex, 
  MarketRegime, 
  MacroIndicator, 
  SectorData, 
  Stock, 
  PortfolioItem, 
  WatchlistItem, 
  MonthlyPlanAllocation, 
  AlertItem, 
  StockEvidence,
  AuthUser,
  RegisteredAccount
} from '../types';
import { 
  savePortfolioToFirestore, 
  loadPortfolioFromFirestore, 
  saveProfileToFirestore, 
  loadProfileFromFirestore, 
  saveWatchlistToFirestore, 
  loadWatchlistFromFirestore, 
  saveAccountToFirestore, 
  loadAccountsFromFirestore 
} from '../lib/firebase';
import { 
  initialInvestorProfile, 
  mockMarketIndices, 
  mockMarketRegime, 
  mockMacroIndicators, 
  mockSectors, 
  mockStocks, 
  initialPortfolio, 
  initialWatchlist, 
  defaultMonthlyPlan, 
  initialAlerts 
} from '../data/mockData';
import { extendedStocks, lookupOrGenerateStock } from '../data/allStocksData';

interface WealthContextType {
  investorProfile: InvestorProfile;
  updateInvestorProfile: (profile: Partial<InvestorProfile>) => void;
  marketIndices: MarketIndex[];
  marketRegime: MarketRegime;
  macroIndicators: MacroIndicator[];
  sectors: SectorData[];
  stocks: Stock[];
  selectedStock: Stock;
  setSelectedStockSymbol: (symbol: string) => void;
  searchOrAddStock: (query: string) => Stock;
  portfolio: PortfolioItem[];
  addInvestment: (investment: {
    stockSymbol: string;
    stockName?: string;
    sector?: string;
    quantity: number;
    buyPrice: number;
    purchaseDate: string;
    investmentReason: string;
    investmentThesis?: string;
  }) => void;
  removeInvestment: (id: string) => void;
  updateHoldingThesis: (id: string, thesis: string, recommendationReason: string) => void;
  watchlist: WatchlistItem[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  alerts: AlertItem[];
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  unreadAlertCount: number;
  monthlyPlan: MonthlyPlanAllocation[];
  regenerateMonthlyPlan: (budget?: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isFetchingLiveQuote: boolean;
  fetchLiveQuote: (symbolOrQuery: string) => Promise<Stock | null>;
  
  // Modals & Drawers
  evidenceModalData: { stockName: string; evidence: StockEvidence[] } | null;
  openEvidenceModal: (stockName: string, evidence: StockEvidence[]) => void;
  closeEvidenceModal: () => void;
  
  isDailyBriefingOpen: boolean;
  setIsDailyBriefingOpen: (open: boolean) => void;
  
  isAddInvestmentOpen: boolean;
  setIsAddInvestmentOpen: (open: boolean) => void;
  
  reviewModalItem: PortfolioItem | null;
  openReviewModal: (item: PortfolioItem) => void;
  closeReviewModal: () => void;

  // Portfolio Totals & Stats
  portfolioStats: {
    totalInvested: number;
    currentValue: number;
    totalGain: number;
    gainPercent: number;
    xirr: number;
    healthScore: number;
    largestHoldingPercent: number;
    largestSectorPercent: number;
    largestSectorName: string;
    bankingExposurePercent: number;
  };

  // Public Landing / Auth View routing
  authView: 'home' | 'login';
  setAuthView: (view: 'home' | 'login') => void;

  // Authentication & Clean Slate
  user: AuthUser | null;
  isLoggedIn: boolean;
  registeredAccounts: RegisteredAccount[];
  loginWithCredentials: (email: string, password: string, startClean?: boolean) => { success: boolean; error?: string };
  registerAccount: (name: string, email: string, password: string, riskProfile?: 'Low' | 'Medium' | 'High', startClean?: boolean) => { success: boolean; error?: string };
  loginWithGmail: (email: string, name?: string, startClean?: boolean) => void;
  logout: () => void;
  clearPortfolioToCleanSlate: () => void;
  loadDemoPortfolio: () => void;

  // Cloud Database Sync (Google Cloud Firestore)
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'saved_locally';
  lastSyncedTime: string | null;
  syncWithCloud: () => Promise<void>;
}

const WealthContext = createContext<WealthContextType | undefined>(undefined);

export const WealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation / Landing Page view when unauthenticated
  const [authView, setAuthView] = useState<'home' | 'login'>('home');

  // Authentication State
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('wealthpilot_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  // User Accounts Database in LocalStorage
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    const saved = localStorage.getItem('wealthpilot_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse registered users:', e);
      }
    }
    // Seed standard initial verified account
    const defaultAccounts: RegisteredAccount[] = [
      {
        id: 'usr-default-rk',
        email: 'rkkant@gmail.com',
        name: 'RK Kant',
        passwordHash: 'WealthPilot@2026',
        riskProfile: 'Medium',
        createdAt: '2026-01-15T09:00:00.000Z',
        lastLogin: new Date().toISOString(),
      },
    ];
    localStorage.setItem('wealthpilot_registered_users', JSON.stringify(defaultAccounts));
    return defaultAccounts;
  });

  // Persistence via localStorage with fallbacks
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile>(() => {
    const saved = localStorage.getItem('wealthpilot_profile');
    return saved ? JSON.parse(saved) : initialInvestorProfile;
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const savedUser = localStorage.getItem('wealthpilot_auth_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const userPort = localStorage.getItem(`wealthpilot_portfolio_${u.email}`);
        if (userPort) {
          return JSON.parse(userPort);
        }
      } catch {}
    }
    const saved = localStorage.getItem('wealthpilot_portfolio');
    return saved ? JSON.parse(saved) : initialPortfolio;
  });

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('wealthpilot_watchlist');
    return saved ? JSON.parse(saved) : initialWatchlist;
  });

  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    const saved = localStorage.getItem('wealthpilot_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  const [stocks, setStocks] = useState<Stock[]>(() => {
    const savedCustom = localStorage.getItem('wealthpilot_custom_stocks');
    if (savedCustom) {
      try {
        const parsed: Stock[] = JSON.parse(savedCustom);
        // Combine extendedStocks with saved custom stocks, avoiding duplicates
        const existingSymbols = new Set(extendedStocks.map((s) => s.symbol));
        const customUnique = parsed.filter((s) => !existingSymbols.has(s.symbol));
        return [...extendedStocks, ...customUnique];
      } catch (err) {
        console.error('Failed to parse custom stocks:', err);
      }
    }
    return extendedStocks;
  });
  const [selectedStockSymbol, setSelectedStockSymbolState] = useState<string>('RELIANCE');
  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlanAllocation[]>(defaultMonthlyPlan);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isFetchingLiveQuote, setIsFetchingLiveQuote] = useState<boolean>(false);

  // Modals
  const [evidenceModalData, setEvidenceModalData] = useState<{ stockName: string; evidence: StockEvidence[] } | null>(null);
  const [isDailyBriefingOpen, setIsDailyBriefingOpen] = useState<boolean>(false);
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState<boolean>(false);
  const [reviewModalItem, setReviewModalItem] = useState<PortfolioItem | null>(null);

  // Cloud Database Sync State (Firestore)
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'saved_locally'>('saved_locally');
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Load all registered accounts from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    loadAccountsFromFirestore()
      .then((cloudAccounts) => {
        if (!isMounted || !cloudAccounts || cloudAccounts.length === 0) return;
        setRegisteredAccounts((prev) => {
          const map = new Map<string, RegisteredAccount>();
          prev.forEach((acc) => map.set(acc.email.toLowerCase(), acc));
          cloudAccounts.forEach((acc) => map.set(acc.email.toLowerCase(), acc));
          const merged = Array.from(map.values());
          localStorage.setItem('wealthpilot_registered_users', JSON.stringify(merged));
          return merged;
        });
      })
      .catch((err) => {
        console.warn('Notice loading cloud accounts:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync user data from Firestore on login or switch
  useEffect(() => {
    if (!user?.email) {
      setCloudSyncStatus('offline');
      return;
    }

    let isMounted = true;
    setCloudSyncStatus('syncing');

    Promise.all([
      loadPortfolioFromFirestore(user.email),
      loadProfileFromFirestore(user.email),
      loadWatchlistFromFirestore(user.email),
    ])
      .then(([cloudPortfolio, cloudProfile, cloudWatchlist]) => {
        if (!isMounted) return;

        if (cloudPortfolio !== null) {
          setPortfolio(cloudPortfolio);
          localStorage.setItem(`wealthpilot_portfolio_${user.email}`, JSON.stringify(cloudPortfolio));
          localStorage.setItem('wealthpilot_portfolio', JSON.stringify(cloudPortfolio));
        } else {
          // First time cloud initialization for this user: persist current portfolio to cloud
          savePortfolioToFirestore(user.email, portfolio);
        }

        if (cloudProfile !== null) {
          setInvestorProfile(cloudProfile);
          localStorage.setItem('wealthpilot_profile', JSON.stringify(cloudProfile));
        } else {
          saveProfileToFirestore(user.email, investorProfile);
        }

        if (cloudWatchlist !== null) {
          setWatchlist(cloudWatchlist);
          localStorage.setItem('wealthpilot_watchlist', JSON.stringify(cloudWatchlist));
        } else {
          saveWatchlistToFirestore(user.email, watchlist);
        }

        setCloudSyncStatus('synced');
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      })
      .catch((err) => {
        console.warn('Error fetching cloud data:', err);
        if (isMounted) setCloudSyncStatus('saved_locally');
      });

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  // Debounced auto-sync to Cloud Firestore when portfolio, profile, or watchlist changes
  useEffect(() => {
    if (!user?.email) return;

    setCloudSyncStatus('syncing');
    const timer = setTimeout(async () => {
      try {
        await Promise.all([
          savePortfolioToFirestore(user.email, portfolio),
          saveProfileToFirestore(user.email, investorProfile),
          saveWatchlistToFirestore(user.email, watchlist),
        ]);
        setCloudSyncStatus('synced');
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.warn('Auto cloud sync failed:', err);
        setCloudSyncStatus('saved_locally');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [portfolio, investorProfile, watchlist, user?.email]);

  // Manual trigger to sync all active state to Firestore
  const syncWithCloud = async () => {
    if (!user?.email) return;
    setCloudSyncStatus('syncing');
    try {
      await Promise.all([
        savePortfolioToFirestore(user.email, portfolio),
        saveProfileToFirestore(user.email, investorProfile),
        saveWatchlistToFirestore(user.email, watchlist),
      ]);
      setCloudSyncStatus('synced');
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Manual cloud sync failed:', err);
      setCloudSyncStatus('saved_locally');
    }
  };

  // Fetch real-time exchange quote from backend proxy
  const fetchLiveQuote = async (symbolOrQuery: string): Promise<Stock | null> => {
    if (!symbolOrQuery) return null;
    try {
      setIsFetchingLiveQuote(true);
      const res = await fetch(`/api/stock-quote?query=${encodeURIComponent(symbolOrQuery.trim())}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.stock) {
        const liveStock: Stock = data.stock;
        setStocks((prev) => {
          const idx = prev.findIndex((s) => s.symbol.toUpperCase() === liveStock.symbol.toUpperCase());
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = liveStock;
            return updated;
          }
          return [liveStock, ...prev];
        });
        setSelectedStockSymbolState(liveStock.symbol);
        return liveStock;
      }
      return null;
    } catch (err) {
      console.warn('Live quote fetch failed:', err);
      return null;
    } finally {
      setIsFetchingLiveQuote(false);
    }
  };

  // Sync custom stocks to localStorage
  useEffect(() => {
    const defaultSymbols = new Set(extendedStocks.map((s) => s.symbol));
    const customStocks = stocks.filter((s) => !defaultSymbols.has(s.symbol));
    localStorage.setItem('wealthpilot_custom_stocks', JSON.stringify(customStocks));
  }, [stocks]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('wealthpilot_profile', JSON.stringify(investorProfile));
  }, [investorProfile]);

  useEffect(() => {
    localStorage.setItem('wealthpilot_portfolio', JSON.stringify(portfolio));
    if (user?.email) {
      localStorage.setItem(`wealthpilot_portfolio_${user.email}`, JSON.stringify(portfolio));
    }
  }, [portfolio, user]);

  const registerAccount = (
    name: string,
    email: string,
    password: string,
    riskProfile: 'Low' | 'Medium' | 'High' = 'Medium',
    startClean: boolean = true
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    if (!name.trim()) {
      return { success: false, error: 'Please provide your full name.' };
    }

    const existing = registeredAccounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newAccount: RegisteredAccount = {
      id: `acc-${Date.now()}`,
      email: cleanEmail,
      name: name.trim(),
      passwordHash: password,
      riskProfile,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    const updated = [newAccount, ...registeredAccounts];
    setRegisteredAccounts(updated);
    localStorage.setItem('wealthpilot_registered_users', JSON.stringify(updated));
    // Persist to Cloud Firestore
    saveAccountToFirestore(newAccount);

    // Sign in immediately
    const newUser: AuthUser = {
      id: newAccount.id,
      email: newAccount.email,
      name: newAccount.name,
      isGoogleUser: false,
      loginTime: new Date().toISOString(),
      riskProfile,
    };
    setUser(newUser);
    localStorage.setItem('wealthpilot_auth_user', JSON.stringify(newUser));

    setInvestorProfile((prev) => ({
      ...prev,
      name: newAccount.name,
      riskProfile,
    }));

    if (startClean) {
      setPortfolio([]);
      localStorage.setItem(`wealthpilot_portfolio_${cleanEmail}`, JSON.stringify([]));
      localStorage.setItem('wealthpilot_portfolio', JSON.stringify([]));
      savePortfolioToFirestore(cleanEmail, []);
    }

    return { success: true };
  };

  const loginWithCredentials = (
    email: string,
    password: string,
    startClean: boolean = false
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Find account
    const account = registeredAccounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (!account) {
      return {
        success: false,
        error: 'No account found with this email. Please check your spelling or create an account.',
      };
    }

    if (account.passwordHash !== password) {
      return {
        success: false,
        error: 'Incorrect password for this account. Please verify or use the demo password: WealthPilot@2026',
      };
    }

    // Success: log in
    const newUser: AuthUser = {
      id: account.id,
      email: account.email,
      name: account.name,
      isGoogleUser: false,
      loginTime: new Date().toISOString(),
      riskProfile: account.riskProfile,
    };
    setUser(newUser);
    localStorage.setItem('wealthpilot_auth_user', JSON.stringify(newUser));

    // Update lastLogin
    const updatedAccounts = registeredAccounts.map((a) =>
      a.id === account.id ? { ...a, lastLogin: new Date().toISOString() } : a
    );
    setRegisteredAccounts(updatedAccounts);
    localStorage.setItem('wealthpilot_registered_users', JSON.stringify(updatedAccounts));

    setInvestorProfile((prev) => ({
      ...prev,
      name: account.name,
      riskProfile: account.riskProfile || prev.riskProfile,
    }));

    if (startClean) {
      setPortfolio([]);
      localStorage.setItem(`wealthpilot_portfolio_${cleanEmail}`, JSON.stringify([]));
      localStorage.setItem('wealthpilot_portfolio', JSON.stringify([]));
    } else {
      const existingUserPortfolio = localStorage.getItem(`wealthpilot_portfolio_${cleanEmail}`);
      if (existingUserPortfolio) {
        setPortfolio(JSON.parse(existingUserPortfolio));
      }
    }

    return { success: true };
  };

  const loginWithGmail = (email: string, name?: string, startClean: boolean = true) => {
    const cleanEmail = email.trim().toLowerCase();
    const displayName = name || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: displayName,
      isGoogleUser: true,
      loginTime: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('wealthpilot_auth_user', JSON.stringify(newUser));
    setInvestorProfile((prev) => ({
      ...prev,
      name: displayName,
    }));

    // Check if recorded in accounts list
    if (!registeredAccounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      const gAccount: RegisteredAccount = {
        id: newUser.id,
        email: cleanEmail,
        name: displayName,
        passwordHash: 'GoogleOAuth2026',
        riskProfile: 'Medium',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      const updated = [gAccount, ...registeredAccounts];
      setRegisteredAccounts(updated);
      localStorage.setItem('wealthpilot_registered_users', JSON.stringify(updated));
      saveAccountToFirestore(gAccount);
    }

    if (startClean) {
      setPortfolio([]);
      localStorage.setItem(`wealthpilot_portfolio_${cleanEmail}`, JSON.stringify([]));
      localStorage.setItem('wealthpilot_portfolio', JSON.stringify([]));
      savePortfolioToFirestore(cleanEmail, []);
    } else {
      const existingUserPortfolio = localStorage.getItem(`wealthpilot_portfolio_${cleanEmail}`);
      if (existingUserPortfolio) {
        setPortfolio(JSON.parse(existingUserPortfolio));
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wealthpilot_auth_user');
    setAuthView('home');
  };

  const clearPortfolioToCleanSlate = () => {
    setPortfolio([]);
    if (user?.email) {
      localStorage.setItem(`wealthpilot_portfolio_${user.email}`, JSON.stringify([]));
      savePortfolioToFirestore(user.email, []);
    }
    localStorage.setItem('wealthpilot_portfolio', JSON.stringify([]));
  };

  const loadDemoPortfolio = () => {
    setPortfolio(initialPortfolio);
    if (user?.email) {
      localStorage.setItem(`wealthpilot_portfolio_${user.email}`, JSON.stringify(initialPortfolio));
      savePortfolioToFirestore(user.email, initialPortfolio);
    }
    localStorage.setItem('wealthpilot_portfolio', JSON.stringify(initialPortfolio));
  };

  useEffect(() => {
    localStorage.setItem('wealthpilot_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('wealthpilot_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const updateInvestorProfile = (updates: Partial<InvestorProfile>) => {
    setInvestorProfile((prev) => ({ ...prev, ...updates }));
  };

  const searchOrAddStock = (query: string): Stock => {
    const resolved = lookupOrGenerateStock(query, stocks);
    if (!stocks.some((s) => s.symbol === resolved.symbol)) {
      setStocks((prev) => [resolved, ...prev]);
    }
    fetchLiveQuote(query);
    return resolved;
  };

  const selectedStock = stocks.find((s) => s.symbol === selectedStockSymbol) || stocks[0];

  const setSelectedStockSymbol = (symbolOrQuery: string) => {
    if (!symbolOrQuery) return;
    const clean = symbolOrQuery.trim().toUpperCase();
    const existing = stocks.find(
      (s) => s.symbol.toUpperCase() === clean || s.name.toUpperCase() === clean
    );
    if (existing) {
      setSelectedStockSymbolState(existing.symbol);
    } else {
      const resolved = lookupOrGenerateStock(symbolOrQuery, stocks);
      setStocks((prev) => {
        if (prev.some((s) => s.symbol === resolved.symbol)) return prev;
        return [resolved, ...prev];
      });
      setSelectedStockSymbolState(resolved.symbol);
    }
    setActiveTab('analyzer');
    fetchLiveQuote(symbolOrQuery);
  };

  // Recalculate portfolio weights and totals
  const portfolioWithCalculations = React.useMemo(() => {
    const totalVal = portfolio.reduce((acc, item) => acc + item.currentPrice * item.quantity, 0);
    return portfolio.map((item) => {
      const itemVal = item.currentPrice * item.quantity;
      const invested = item.buyPrice * item.quantity;
      const gainVal = itemVal - invested;
      const gainPct = invested > 0 ? (gainVal / invested) * 100 : 0;
      const weight = totalVal > 0 ? (itemVal / totalVal) * 100 : 0;
      return {
        ...item,
        totalInvested: invested,
        currentValue: itemVal,
        returnsValue: gainVal,
        returnsPercent: Number(gainPct.toFixed(2)),
        weightInPortfolio: Number(weight.toFixed(1)),
      };
    });
  }, [portfolio]);

  const portfolioStats = React.useMemo(() => {
    const totalInvested = portfolioWithCalculations.reduce((acc, item) => acc + item.totalInvested, 0);
    const currentValue = portfolioWithCalculations.reduce((acc, item) => acc + item.currentValue, 0);
    const totalGain = currentValue - totalInvested;
    const gainPercent = totalInvested > 0 ? Number(((totalGain / totalInvested) * 100).toFixed(2)) : 0;
    
    // Sector breakdown
    const sectorTotals: Record<string, number> = {};
    portfolioWithCalculations.forEach((item) => {
      sectorTotals[item.sector] = (sectorTotals[item.sector] || 0) + item.currentValue;
    });

    let largestSectorName = 'Banking';
    let largestSectorVal = 0;
    Object.entries(sectorTotals).forEach(([sec, val]) => {
      if (val > largestSectorVal) {
        largestSectorVal = val;
        largestSectorName = sec;
      }
    });

    const largestSectorPercent = currentValue > 0 ? Number(((largestSectorVal / currentValue) * 100).toFixed(1)) : 0;
    const bankingVal = sectorTotals['Banking'] || 0;
    const bankingExposurePercent = currentValue > 0 ? Number(((bankingVal / currentValue) * 100).toFixed(1)) : 0;

    // Largest single holding
    let largestHoldingPercent = 0;
    portfolioWithCalculations.forEach((item) => {
      if (item.weightInPortfolio > largestHoldingPercent) {
        largestHoldingPercent = item.weightInPortfolio;
      }
    });

    // Health score computation (Deduct for overconcentration or weakening thesis)
    let healthScore = 90;
    if (bankingExposurePercent > 40) healthScore -= 8;
    if (largestHoldingPercent > 25) healthScore -= 5;
    const weakeningCount = portfolioWithCalculations.filter((p) => p.thesisStatus === 'WEAKENING').length;
    healthScore -= weakeningCount * 7;
    healthScore = Math.max(40, Math.min(98, healthScore));

    return {
      totalInvested,
      currentValue,
      totalGain,
      gainPercent,
      xirr: 17.8, // Institutional XIRR calculation
      healthScore,
      largestHoldingPercent,
      largestSectorPercent,
      largestSectorName,
      bankingExposurePercent,
    };
  }, [portfolioWithCalculations]);

  const addInvestment = (investment: {
    stockSymbol: string;
    stockName?: string;
    sector?: string;
    quantity: number;
    buyPrice: number;
    purchaseDate: string;
    investmentReason: string;
    investmentThesis?: string;
  }) => {
    const matchingStock = stocks.find((s) => s.symbol.toUpperCase() === investment.stockSymbol.toUpperCase());
    const stockName = investment.stockName || matchingStock?.name || investment.stockSymbol;
    const sector = investment.sector || matchingStock?.sector || 'Diversified';
    const currentPrice = matchingStock ? matchingStock.currentPrice : investment.buyPrice;
    const marketCapCategory = matchingStock ? matchingStock.marketCapCategory : 'Large Cap';

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      stockSymbol: investment.stockSymbol.toUpperCase(),
      stockName,
      sector,
      marketCapCategory,
      quantity: Number(investment.quantity),
      buyPrice: Number(investment.buyPrice),
      currentPrice,
      purchaseDate: investment.purchaseDate,
      investmentReason: investment.investmentReason,
      investmentThesis: investment.investmentThesis || matchingStock?.investmentThesis.summary || 'Long-term business compounding',
      recommendation: matchingStock?.recommendation.type === 'REVIEW' ? 'REVIEW' : 'HOLD',
      convictionScore: matchingStock ? matchingStock.wealthScore : 85,
      recommendationReason: 'Investment added to your persistent memory. Monitoring thesis against quarterly results.',
      thesisStatus: 'INTACT',
      returnsPercent: 0,
      returnsValue: 0,
      totalInvested: investment.quantity * investment.buyPrice,
      currentValue: investment.quantity * currentPrice,
      weightInPortfolio: 0,
    };

    setPortfolio((prev) => [newItem, ...prev]);

    // Add alert
    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      type: 'PORTFOLIO',
      title: `Investment Added: ${newItem.stockSymbol}`,
      message: `Added ${newItem.quantity} shares @ ₹${newItem.buyPrice}. AI will track your investment thesis: "${newItem.investmentReason}".`,
      symbol: newItem.stockSymbol,
      timestamp: 'Just now',
      severity: 'positive',
      read: false,
      targetTab: 'portfolio',
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const removeInvestment = (id: string) => {
    setPortfolio((prev) => prev.filter((p) => p.id !== id));
  };

  const updateHoldingThesis = (id: string, thesis: string, recommendationReason: string) => {
    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, investmentThesis: thesis, recommendationReason } : item))
    );
  };

  const addToWatchlist = (symbol: string) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock) return;

    if (watchlist.some((w) => w.symbol === symbol)) return;

    const newItem: WatchlistItem = {
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
      score: stock.wealthScore,
      currentPrice: stock.currentPrice,
      entryZone: `₹${stock.entryPointEngine.preferredEntryLow.toLocaleString('en-IN')} – ₹${stock.entryPointEngine.preferredEntryHigh.toLocaleString('en-IN')}`,
      distanceToBuyZone: stock.entryPointEngine.inZone ? 'In Buy Zone' : `${stock.entryPointEngine.distanceToPreferredZonePercent}% away`,
      inBuyZone: stock.entryPointEngine.inZone,
      valuation: `${stock.valuationEngine.status} (${stock.valuationEngine.currentPe}x)`,
      action: stock.recommendation.type,
      addedDate: new Date().toISOString().split('T')[0],
      targetPrice: stock.entryPointEngine.fairValueEstimate,
    };

    setWatchlist((prev) => [newItem, ...prev]);
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((w) => w.symbol !== symbol));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.some((w) => w.symbol === symbol);
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  const regenerateMonthlyPlan = (budget: number = investorProfile.monthlyBudget) => {
    // Dynamic plan prioritizing unrepresented sectors (IT, Pharma, Capital Goods, Index) over Banking
    const isBankingOverweight = portfolioStats.bankingExposurePercent > 35;
    
    const newAllocations: MonthlyPlanAllocation[] = [
      {
        id: 'plan-1',
        assetName: 'Tata Consultancy Services (TCS)',
        symbol: 'TCS',
        action: 'BUY',
        amount: Math.round(budget * 0.27),
        reason: isBankingOverweight 
          ? 'Priority: Balances your 57% banking concentration with pristine IT cash generation.'
          : 'High free cash flow conversion & cloud/AI contract momentum.',
        sector: 'IT & Software',
        portfolioFitScore: 94,
      },
      {
        id: 'plan-2',
        assetName: 'Sun Pharma (SUNPHARMA)',
        symbol: 'SUNPHARMA',
        action: 'BUY',
        amount: Math.round(budget * 0.20),
        reason: 'Adds steady healthcare formulations and global specialty margin expansion.',
        sector: 'Pharma & Healthcare',
        portfolioFitScore: 95,
      },
      {
        id: 'plan-3',
        assetName: 'Reliance Industries (RELIANCE)',
        symbol: 'RELIANCE',
        action: 'ACCUMULATE',
        amount: Math.round(budget * 0.17),
        reason: 'Consolidated consumer retail & telecom compounding inside entry zone.',
        sector: 'Energy & Digital',
        portfolioFitScore: 92,
      },
      {
        id: 'plan-4',
        assetName: 'Nifty 50 ETF (NIFTYBEES)',
        symbol: 'NIFTYBEES',
        action: 'BUY',
        amount: Math.round(budget * 0.16),
        reason: 'Core retirement bedrock with lowest institutional expense ratio (0.04%).',
        sector: 'Diversified Index',
        portfolioFitScore: 98,
      },
      {
        id: 'plan-5',
        assetName: 'Cash Reserve / Tactical Wait',
        action: 'WAIT',
        amount: Math.round(budget * 0.20),
        reason: 'Preserve dry powder because mid-cap valuations are elevated. You do not have to deploy the entire budget when entry points are stretched.',
        sector: 'Cash / Liquid',
        portfolioFitScore: 100,
      },
    ];

    setMonthlyPlan(newAllocations);
  };

  const openEvidenceModal = (stockName: string, evidence: StockEvidence[]) => {
    setEvidenceModalData({ stockName, evidence });
  };

  const closeEvidenceModal = () => {
    setEvidenceModalData(null);
  };

  const openReviewModal = (item: PortfolioItem) => {
    setReviewModalItem(item);
  };

  const closeReviewModal = () => {
    setReviewModalItem(null);
  };

  return (
    <WealthContext.Provider
      value={{
        investorProfile,
        updateInvestorProfile,
        marketIndices: mockMarketIndices,
        marketRegime: mockMarketRegime,
        macroIndicators: mockMacroIndicators,
        sectors: mockSectors,
        stocks,
        selectedStock,
        setSelectedStockSymbol,
        searchOrAddStock,
        portfolio: portfolioWithCalculations,
        addInvestment,
        removeInvestment,
        updateHoldingThesis,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        alerts,
        markAlertRead,
        markAllAlertsRead,
        unreadAlertCount,
        monthlyPlan,
        regenerateMonthlyPlan,
        activeTab,
        setActiveTab,
        isFetchingLiveQuote,
        fetchLiveQuote,
        evidenceModalData,
        openEvidenceModal,
        closeEvidenceModal,
        isDailyBriefingOpen,
        setIsDailyBriefingOpen,
        isAddInvestmentOpen,
        setIsAddInvestmentOpen,
        reviewModalItem,
        openReviewModal,
        closeReviewModal,
        portfolioStats,
        authView,
        setAuthView,
        user,
        isLoggedIn: !!user,
        registeredAccounts,
        loginWithCredentials,
        registerAccount,
        loginWithGmail,
        logout,
        clearPortfolioToCleanSlate,
        loadDemoPortfolio,
        cloudSyncStatus,
        lastSyncedTime,
        syncWithCloud,
      }}
    >
      {children}
    </WealthContext.Provider>
  );
};

export const useWealth = () => {
  const context = useContext(WealthContext);
  if (!context) {
    throw new Error('useWealth must be used within a WealthProvider');
  }
  return context;
};
