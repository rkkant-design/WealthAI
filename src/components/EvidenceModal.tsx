import React from 'react';
import { X, ShieldCheck, Database, FileText, CheckCircle, Info } from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const EvidenceModal: React.FC = () => {
  const { evidenceModalData, closeEvidenceModal } = useWealth();

  if (!evidenceModalData) return null;

  const { stockName, evidence } = evidenceModalData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="evidence-modal-content"
        className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">Institutional Research Evidence</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Demo Evidence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Underlying data points supporting AI recommendation for <strong className="text-white">{stockName}</strong>
              </p>
            </div>
          </div>
          <button
            id="close-evidence-modal-btn"
            onClick={closeEvidenceModal}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {evidence && evidence.length > 0 ? (
            evidence.map((item, idx) => (
              <div
                key={idx}
                id={`evidence-card-${idx}`}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="font-bold text-xs text-white">{item.signal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {item.sourceType}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold">
                      Confidence: {item.aiConfidence}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Date / Period</span>
                    <span className="font-semibold text-slate-200">{item.date}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[10px]">Primary Metric / Observation</span>
                    <span className="font-mono text-emerald-400 font-semibold">{item.data}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-900/30 text-[11px] text-slate-300">
                  <span className="font-bold text-blue-300 block mb-0.5">Why it matters for your investment thesis:</span>
                  {item.whyItMatters}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-slate-400 text-xs">
              No evidence data points currently mapped for this asset.
            </div>
          )}

          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 text-[11px] text-amber-200/90">
            <Info className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>AI Transparency Notice:</strong> All signals are derived from audited financial disclosures, stock exchange filings, and simulated macroeconomic models. Verify with official investor relations portals before capital commitment.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            id="dismiss-evidence-modal-btn"
            onClick={closeEvidenceModal}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Close Evidence Window
          </button>
        </div>
      </div>
    </div>
  );
};
