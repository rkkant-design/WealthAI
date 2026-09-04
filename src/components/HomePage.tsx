import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  Target, 
  Compass, 
  Lock, 
  FileText, 
  AlertTriangle, 
  Activity, 
  PieChart, 
  ChevronRight, 
  ChevronDown,
  ExternalLink,
  Cpu,
  Globe2,
  Clock,
  Zap,
  Award
} from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onLogin }) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'regime' | 'valuation' | 'thesis' | 'risk'>('valuation');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const marketTickers = [
    { symbol: 'NIFTY 50', price: '24,840.50', change: '+142.30', pct: '+0.58%', isPositive: true },
    { symbol: 'SENSEX', price: '81,420.10', change: '+468.20', pct: '+0.58%', isPositive: true },
    { symbol: 'BANK NIFTY', price: '51,280.40', change: '-78.60', pct: '-0.15%', isPositive: false },
    { symbol: 'INDIA VIX', price: '13.42', change: '-0.58', pct: '-4.14%', isPositive: false, isVix: true },
    { symbol: 'RELIANCE', price: '₹2,985.40', change: '+24.60', pct: '+0.83%', isPositive: true },
    { symbol: 'TCS', price: '₹4,180.20', change: '+68.90', pct: '+1.67%', isPositive: true },
    { symbol: 'HDFCBANK', price: '₹1,642.50', change: '+8.40', pct: '+0.51%', isPositive: true },
    { symbol: 'INFY', price: '₹1,890.30', change: '+21.10', pct: '+1.13%', isPositive: true },
  ];

  const faqs = [
    {
      q: 'What makes WealthPilot AI different from standard stock brokers and apps?',
      a: 'Most retail platforms incentivize high-frequency trading, F&O gambles, and speculative day trading. WealthPilot AI is built purely for institutional, long-term capital compounding. We evaluate businesses using 9 mathematical valuation methodologies (Graham Fair Value, DCF yield, PE percentiles, EV/EBITDA), enforce disciplined sector allocations (e.g. preventing lethal banking over-concentration), and actively monitor your original investment thesis against quarterly earnings.'
    },
    {
      q: 'Does WealthPilot AI cover real Indian equities on the NSE and BSE?',
      a: 'Yes. WealthPilot AI tracks real-time data across all major NSE and BSE equities including NIFTY 50, NIFTY Next 50, NIFTY Midcap 150, and Smallcap indices, complete with live symbol lookup, historical valuations, and sector weights.'
    },
    {
      q: 'How does the 9-Factor Valuation Engine work?',
      a: 'Instead of relying on a single simplistic PE ratio, the engine executes a multi-dimensional check: 1) Historical 5-Year PE Percentile, 2) Price-to-Earnings-Growth (PEG), 3) Price-to-Book vs historical ROE, 4) Graham Intrinsic Number, 5) EV/EBITDA multiple, 6) Free Cash Flow Yield, 7) Debt-to-Equity solvency, 8) 3-Year Profit CAGR, and 9) Operating Cash Conversion.'
    },
    {
      q: 'Can I start with a completely fresh, empty portfolio?',
      a: 'Absolutely. WealthPilot AI features a "Clean Slate" mode allowing you to initialize with zero holdings, so you can record your exact actual shares, buy prices, and specific investment theses from day one.'
    },
    {
      q: 'Is my data secure and private?',
      a: 'Yes. Your authentication, portfolios, watchlist, and personalized investment theses are encrypted and securely isolated. We never sell your data or trade against your positions.'
    },
    {
      q: 'Is WealthPilot AI SEBI registered?',
      a: 'WealthPilot AI is an analytical technology platform designed for informational, educational, and systematic evaluation purposes. It does not provide personalized investment advice or execute trades on your behalf. Always conduct your own due diligence or consult a SEBI-registered investment advisor before deploying capital.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white font-sans">
      {/* Top Ticker Marquee */}
      <div className="bg-slate-900/90 border-b border-slate-800 text-[11px] overflow-hidden py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0 text-slate-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-300">NSE Live Pulse</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
            {marketTickers.map((ticker, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                <span className="font-semibold text-slate-300">{ticker.symbol}</span>
                <span className="font-mono text-white">{ticker.price}</span>
                <span className={`font-mono text-[10px] font-medium ${ticker.isVix ? 'text-amber-400' : ticker.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {ticker.pct}
                </span>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[10px] flex-shrink-0">
            <Clock className="h-3 w-3 text-blue-400" />
            <span>Market Regime: Cautiously Positive</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-tight">WealthPilot</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">NSE Investment Intelligence</p>
            </div>
          </div>

          {/* Center Anchor Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#valuation" className="hover:text-white transition-colors">9-Factor Engine</a>
            <a href="#preview" className="hover:text-white transition-colors">Platform Tour</a>
            <a href="#methodology" className="hover:text-white transition-colors">Philosophy</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="home-nav-signin-btn"
              onClick={onLogin}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-all"
            >
              Sign In
            </button>
            <button
              id="home-nav-getstarted-btn"
              onClick={onGetStarted}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-slate-900">
        {/* Glow Gradients */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-xs text-blue-300 shadow-md">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-semibold">Institutional Grade • No Intraday Noise • Pure Fundamental Compounding</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Deploy Capital with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300">
              Institutional Conviction
            </span>, Not Speculation.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            WealthPilot AI is your disciplined equity copilot for Indian markets. Automated 9-factor intrinsic valuation models, quarterly thesis tracking, anti-concentration radars, and deep AI intelligence.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="hero-getstarted-btn"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Open Wealth Workspace</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              id="hero-signin-btn"
              onClick={onLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Sign In with Account</span>
            </button>
          </div>

          {/* Quick Pillars Checklist */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 9-Factor Valuation Engine
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Live NSE Symbol Lookup
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Anti-Concentration Radar
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Clean Slate Portfolio Option
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Platform Tour / Preview Section */}
      <section id="preview" className="py-16 bg-slate-900/40 border-b border-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[11px] font-bold text-blue-400 tracking-wider uppercase">Interactive Preview</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">The Wealth Command Center</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore how WealthPilot AI protects your capital and automates research across Indian market regimes.
            </p>
          </div>

          {/* Preview Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setActivePreviewTab('valuation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activePreviewTab === 'valuation'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>9-Factor Valuation</span>
            </button>
            <button
              onClick={() => setActivePreviewTab('regime')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activePreviewTab === 'regime'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Market Regime</span>
            </button>
            <button
              onClick={() => setActivePreviewTab('thesis')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activePreviewTab === 'thesis'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Thesis Guardian</span>
            </button>
            <button
              onClick={() => setActivePreviewTab('risk')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activePreviewTab === 'risk'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <PieChart className="h-3.5 w-3.5" />
              <span>Risk Radar</span>
            </button>
          </div>

          {/* Preview Canvas Card */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {activePreviewTab === 'valuation' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-white">Tata Consultancy Services</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-semibold">TCS • IT & Software</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Current Price: ₹4,180 • Graham Fair Value: ₹4,350 • Conviction Score: 92/100</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 w-fit">
                    BUY ZONE: ACCUMULATE
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">PE vs 5Y Median</span>
                    <span className="text-emerald-400 font-bold font-mono text-sm">28.4x (Fair)</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">5Y Median: 31.2x</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Graham Number</span>
                    <span className="text-emerald-400 font-bold font-mono text-sm">₹4,350</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">+4.1% Margin of Safety</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">ROE / ROCE Quality</span>
                    <span className="text-emerald-400 font-bold font-mono text-sm">48.2% / 59.1%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Pristine Zero Debt</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Free Cash Flow Yield</span>
                    <span className="text-blue-400 font-bold font-mono text-sm">3.85%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">90%+ Cash Conversion</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-xs space-y-1.5">
                  <div className="font-bold text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Institutional Valuation Summary
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    TCS is executing within its preferred accumulation zone with a 92% Wealth Score. High double-digit return on invested capital coupled with secular multi-year AI contract renewals provides reliable defensive compounding.
                  </p>
                </div>
              </div>
            )}

            {activePreviewTab === 'regime' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Macro Market Regime:</span>
                      <span className="text-emerald-400 font-extrabold">CAUTIOUSLY POSITIVE</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Nifty PE: 22.8x • FII Net: Inflow • India VIX: 13.42 (Subdued)</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold w-fit">
                    Allocation Posture: Systematic SIP
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Earnings Growth Momentum</span>
                    <span className="text-emerald-400 font-bold text-sm mt-1 block">+14.2% YoY</span>
                    <p className="text-[11px] text-slate-400 mt-1">Capex cycle expansion in capital goods and defence.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Valuation Risk Level</span>
                    <span className="text-amber-400 font-bold text-sm mt-1 block">Mildly Stretched in Midcaps</span>
                    <p className="text-[11px] text-slate-400 mt-1">Preserve 15-20% tactical dry powder for dips.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Recommended Action</span>
                    <span className="text-blue-400 font-bold text-sm mt-1 block">Staggered Bluechip Deployment</span>
                    <p className="text-[11px] text-slate-400 mt-1">Avoid lump-sum chasing of high-beta momentum stocks.</p>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'thesis' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-400" />
                      <span>Continuous Investment Thesis Guardian</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Automated quarterly audits to prevent emotional holding errors.</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 w-fit">
                    THESIS INTACT (94% Conf.)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-300">Recorded Original Purchase Thesis:</div>
                  <blockquote className="text-xs text-slate-400 italic border-l-2 border-emerald-500 pl-3">
                    "Bought HDFC Bank for its low-cost CASA deposit fortress, industry-leading underwriting, and post-merger branch distribution moat."
                  </blockquote>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Quarterly Stress Test:</span>
                    <span className="text-emerald-400 font-bold">Passed — NIMs stabilizing, credit cost at 0.42%</span>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'risk' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-amber-400" />
                      <span>Portfolio Anti-Concentration Radar</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Prevents catastrophic single-sector wipeouts.</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 w-fit">
                    PORTFOLIO HEALTH: 92/100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Banking & Finance Exposure</span>
                      <span className="text-emerald-400">22.4% (Safe &lt; 35%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '22.4%' }}></div>
                    </div>
                    <p className="text-[11px] text-slate-400">Well diversified across IT (25%), Pharma (18%), and FMCG (15%).</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Largest Single Stock Weight</span>
                      <span className="text-emerald-400">14.8% (Capped &lt; 20%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '14.8%' }}></div>
                    </div>
                    <p className="text-[11px] text-slate-400">No single equity poses existential liquidation risk to the fund.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] font-bold text-blue-400 tracking-wider uppercase">Built For Serious Wealth</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Everything You Need for Long-Term Conviction</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered from ground up to replace emotional trading with institutional mathematical frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-blue-500/50 transition-all space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">9-Factor Valuation Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automates Graham intrinsic value, 5-year historical PE percentiles, PEG, EV/EBITDA, and FCF yields so you never overpay for equities during market euphoria.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/50 transition-all space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Automated Thesis Guardian</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every position has an explicit rationale. The AI stress-tests your thesis against quarterly margin trends and alerts you before capital erosion occurs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <PieChart className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Anti-Concentration Radars</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prevents the classic retail mistake of overloading 50%+ in banking or mid-caps. Continuously recalibrates your sector balance against Nifty 50 benchmarks.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-teal-500/50 transition-all space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Gemini 3.8 Flash Copilot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask deep questions about debt covenants, capex cycles, and management concalls in natural language, receiving actionable institutional verdicts.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/50 transition-all space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Live NSE & BSE Search</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly look up any listed ticker with live price tracking, real-time buy zone ranges, and automated intrinsic valuation generation.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/50 transition-all space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Clean Slate Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero mock clutter. Start fresh with zero holdings, store your actual buy prices, and enjoy persistent local and cloud encrypted storage.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="methodology" className="py-16 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">Simple 3-Step Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">How WealthPilot AI Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative">
              <div className="h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-xs flex items-center justify-center">
                01
              </div>
              <h3 className="text-sm font-bold text-white">Sign In or Create Account</h3>
              <p className="text-xs text-slate-400">
                Log in with your Gmail or create a secure custom account. Toggle Clean Slate to start with a blank portfolio.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative">
              <div className="h-8 w-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold text-xs flex items-center justify-center">
                02
              </div>
              <h3 className="text-sm font-bold text-white">Configure Profile & Budget</h3>
              <p className="text-xs text-slate-400">
                Set your monthly SIP budget, risk profile, and investment horizon. The monthly planner allocates dynamically.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 relative">
              <div className="h-8 w-8 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center">
                03
              </div>
              <h3 className="text-sm font-bold text-white">Execute With Conviction</h3>
              <p className="text-xs text-slate-400">
                Use 9-factor checks before every purchase. Monitor health scores and let the AI guard your holdings against thesis drift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-2">
          <span className="text-[11px] font-bold text-blue-400 tracking-wider uppercase">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about WealthPilot AI.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Compound Wealth With Institutional Rigor?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Stop letting market volatility dictate your future. Join disciplined long-term Indian equity investors today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="footer-launch-btn"
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="footer-signin-btn"
              onClick={onLogin}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-sm transition-all"
            >
              Sign In to Your Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Legal Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-slate-300">WealthPilot AI</span>
              <span>— Systematic Indian Equity Intelligence</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button onClick={onLogin} className="hover:text-white transition-colors">Sign In</button>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-900 text-[10px] text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Regulatory Disclaimer:</strong> WealthPilot AI is a financial technology research and educational tool. It is not an asset management firm or registered financial advisory service under SEBI (Investment Advisers) Regulations, 2013. Market investments in equities, derivatives, mutual funds, and ETFs are subject to market risks. Please read all related documents carefully and consult a qualified SEBI-registered financial advisor before making investment decisions.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600 text-[10px]">
            <span>© 2026 WealthPilot AI. Built for serious Indian equity compounders.</span>
            <span>Cloud Run Singapore Region • Real-time NSE/BSE Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
