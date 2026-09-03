import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const LoginScreen: React.FC = () => {
  const { loginWithGmail } = useWealth();

  // User input states
  const [email, setEmail] = useState('rkkant@gmail.com');
  const [startFresh, setStartFresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [authMethod, setAuthMethod] = useState<'google' | 'email'>('google');

  const handleGoogleLogin = (targetEmail: string = email) => {
    setIsLoading(true);
    setTimeout(() => {
      const name = targetEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      loginWithGmail(targetEmail, name || 'Investor', startFresh);
      setIsLoading(false);
    }, 450);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    let finalEmail = email.trim();
    if (!finalEmail.includes('@')) {
      finalEmail += '@gmail.com';
    }
    handleGoogleLogin(finalEmail);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 shadow-xl shadow-blue-500/20 mb-4 border border-blue-400/30">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            WealthPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Institutional NSE & BSE Equity Intelligence, Valuation Engine & Personal Portfolio Copilot.
          </p>
        </div>

        {/* Auth Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-bold text-white">Sign In to Your Workspace</h2>
            <p className="text-xs text-slate-400">
              Authenticate with your Gmail ID to access your tailored portfolio.
            </p>
          </div>

          {/* Quick 1-Click for rkkant@gmail.com */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                RK
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">RK Kant</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">Verified</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">rkkant@gmail.com</p>
              </div>
            </div>

            <button
              id="login-quick-rkkant-btn"
              onClick={() => handleGoogleLogin('rkkant@gmail.com')}
              disabled={isLoading}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-1 flex-shrink-0"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Or sign in with any Gmail ID
            </span>
          </div>

          {/* Google Sign In Button */}
          {!showEmailInput ? (
            <div className="space-y-3">
              <button
                id="login-google-btn"
                type="button"
                onClick={() => handleGoogleLogin(email)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-lg active:scale-98"
              >
                {/* Google Multi-Color SVG Icon */}
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isLoading ? 'Signing In...' : 'Sign in with Google'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEmailInput(true)}
                className="w-full text-center text-xs text-blue-400 hover:text-blue-300 transition-colors py-1"
              >
                Use a different Gmail or custom address →
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Enter Gmail Address
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    id="login-email-input"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{isLoading ? 'Connecting...' : 'Sign In with Gmail'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailInput(false)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Clean Slate Preference (Requested by User) */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                id="login-start-fresh-checkbox"
                type="checkbox"
                checked={startFresh}
                onChange={(e) => setStartFresh(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/20 accent-emerald-500"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Start with a clean portfolio (Clean Slate)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                  Initializes your account with zero holdings so you can start fresh by adding your actual NSE/BSE stocks.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mx-auto mb-1" />
            <span>Live NSE Quotes</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400 mx-auto mb-1" />
            <span>9-Factor Valuation</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 mx-auto mb-1" />
            <span>Gemini AI Copilot</span>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <p className="text-[10px] text-slate-500 text-center mt-6">
          WealthPilot AI is an equity analysis advisory tool. Designed exclusively for long-term systematic wealth creation in Indian equities.
        </p>
      </div>
    </div>
  );
};
