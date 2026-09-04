import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { WealthProvider, useWealth } from './context/WealthContext';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { MarketCommandCenter } from './components/MarketCommandCenter';
import { MarketIntelligence } from './components/MarketIntelligence';
import { SectorIntelligence } from './components/SectorIntelligence';
import { StockAnalyzer } from './components/StockAnalyzer';
import { Opportunities } from './components/Opportunities';
import { MyPortfolio } from './components/MyPortfolio';
import { MonthlyPlanner } from './components/MonthlyPlanner';
import { WatchlistView } from './components/WatchlistView';
import { AlertsView } from './components/AlertsView';
import { InvestmentThesisView } from './components/InvestmentThesisView';
import { WealthPlannerView } from './components/WealthPlannerView';
import { AICopilotView } from './components/AICopilotView';
import { FinalSummaryView } from './components/FinalSummaryView';
import { InvestorProfileView } from './components/InvestorProfileView';
import { LoginScreen } from './components/LoginScreen';
import { HomePage } from './components/HomePage';

// Modals
import { DailyBriefingModal } from './components/DailyBriefingModal';
import { EvidenceModal } from './components/EvidenceModal';
import { AddInvestmentModal } from './components/AddInvestmentModal';
import { ReviewThesisModal } from './components/ReviewThesisModal';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App ErrorBoundary caught error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl max-w-lg mx-auto my-12 text-slate-300 space-y-4">
          <div className="text-xl font-bold text-white">Something went wrong</div>
          <p className="text-xs text-slate-400">
            {this.state.error?.message || 'An unexpected error occurred while rendering this view.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all"
          >
            Refresh Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { activeTab, isLoggedIn, authView, setAuthView } = useWealth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isLoggedIn) {
    if (authView === 'login') {
      return <LoginScreen onBackToHome={() => setAuthView('home')} />;
    }
    return (
      <HomePage
        onGetStarted={() => setAuthView('login')}
        onLogin={() => setAuthView('login')}
      />
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MarketCommandCenter />;
      case 'market':
        return <MarketIntelligence />;
      case 'sectors':
        return <SectorIntelligence />;
      case 'analyzer':
        return <StockAnalyzer />;
      case 'opportunities':
        return <Opportunities />;
      case 'portfolio':
        return <MyPortfolio />;
      case 'plan':
        return <MonthlyPlanner />;
      case 'watchlist':
        return <WatchlistView />;
      case 'alerts':
        return <AlertsView />;
      case 'thesis':
        return <InvestmentThesisView />;
      case 'wealthplanner':
        return <WealthPlannerView />;
      case 'copilot':
        return <AICopilotView />;
      case 'summary':
        return <FinalSummaryView />;
      case 'profile':
        return <InvestorProfileView />;
      default:
        return <MarketCommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Navigation
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            {renderActiveView()}
          </ErrorBoundary>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <DailyBriefingModal />
      <EvidenceModal />
      <AddInvestmentModal />
      <ReviewThesisModal />
    </div>
  );
};

export default function App() {
  return (
    <WealthProvider>
      <AppContent />
    </WealthProvider>
  );
}
