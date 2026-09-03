import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, ShieldAlert, Target, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const AlertsView: React.FC = () => {
  const { alerts, markAlertRead, markAllAlertsRead, setActiveTab, setSelectedStockSymbol } = useWealth();

  const handleAlertClick = (alert: any) => {
    markAlertRead(alert.id);
    if (alert.symbol) {
      setSelectedStockSymbol(alert.symbol);
    } else if (alert.targetTab) {
      setActiveTab(alert.targetTab);
    }
  };

  const getAlertIcon = (type: string, severity: string) => {
    switch (type) {
      case 'BUY_ZONE':
        return <Target className="h-4 w-4 text-emerald-400" />;
      case 'VALUATION':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'THESIS':
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      case 'PORTFOLIO':
        return <CheckCircle2 className="h-4 w-4 text-blue-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <div id="alerts-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Active Intelligence Feed
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AI Market & Portfolio Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time notifications triggered when stocks enter buy zones or quarterly theses require review.
          </p>
        </div>

        <button
          id="mark-all-alerts-read-btn"
          onClick={markAllAlertsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            id={`alert-item-${alert.id}`}
            onClick={() => handleAlertClick(alert)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              !alert.read
                ? 'bg-slate-900 border-blue-500/50 hover:border-blue-400'
                : 'bg-slate-950/60 border-slate-800/80 opacity-75 hover:opacity-100 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type, alert.severity)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-white">{alert.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded font-mono ${
                      alert.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : alert.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {alert.type.replace('_', ' ')}
                  </span>
                  {!alert.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{alert.message}</p>
                <span className="text-[10px] text-slate-500 font-mono block pt-0.5">{alert.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                <span>Inspect</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
