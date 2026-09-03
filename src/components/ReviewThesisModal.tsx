import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, FileText, ArrowRight, ShieldAlert, Database } from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const ReviewThesisModal: React.FC = () => {
  const { reviewModalItem, closeReviewModal, updateHoldingThesis, removeInvestment, openEvidenceModal, stocks } = useWealth();

  const [customNotes, setCustomNotes] = useState('');
  const [actionVerdict, setActionVerdict] = useState<'hold' | 'reallocate' | 'none'>('none');

  if (!reviewModalItem) return null;

  const stockData = stocks.find((s) => s.symbol === reviewModalItem.stockSymbol);

  const handleUpdateThesis = () => {
    updateHoldingThesis(
      reviewModalItem.id,
      customNotes || reviewModalItem.investmentThesis,
      'Thesis updated post-quarterly review. Maintaining tight monitoring with strict stop-loss on margin threshold.'
    );
    setActionVerdict('hold');
  };

  const handleSimulateReallocate = () => {
    removeInvestment(reviewModalItem.id);
    setActionVerdict('reallocate');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="review-thesis-modal-content"
        className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Holding Review: {reviewModalItem.stockName} ({reviewModalItem.stockSymbol})
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  🔴 REVIEW / ATTENTION
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Current Gain: <span className="text-emerald-400 font-bold">+{reviewModalItem.returnsPercent}%</span> • Total Value: ₹{reviewModalItem.currentValue.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <button
            id="close-review-modal-btn"
            onClick={closeReviewModal}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs leading-relaxed custom-scrollbar">
          {actionVerdict === 'reallocate' ? (
            <div className="p-8 text-center space-y-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Position Capital Reallocated</h4>
              <p className="text-slate-300 text-xs max-w-md mx-auto">
                Capital of ₹{reviewModalItem.currentValue.toLocaleString('en-IN')} has been freed from {reviewModalItem.stockSymbol}. You can now deploy this into your high-conviction monthly plan items (TCS / Sun Pharma / Index ETF).
              </p>
              <button
                id="finish-review-close-btn"
                onClick={closeReviewModal}
                className="mt-3 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
              >
                Return to Portfolio
              </button>
            </div>
          ) : (
            <>
              {/* Thesis Deterioration Warning */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
                  <ShieldAlert className="h-4 w-4" /> Why This Holding Needs Attention
                </div>
                <p className="text-slate-300 text-xs">
                  While this holding is currently in profit (<strong className="text-emerald-400">+{reviewModalItem.returnsPercent}%</strong>), the fundamental drivers behind your original investment thesis have substantially deteriorated:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] pl-1">
                  <li><strong>Operating Margin Compression:</strong> Margins dropped from 21.4% to 11.2% due to intense global dumping.</li>
                  <li><strong>Debt Escalation:</strong> Net debt expanded 45% to fund capex generating low single-digit ROCE.</li>
                  <li><strong>Promoter Share Pledge:</strong> Pledged shares increased to 18.5%, elevating financial volatility.</li>
                </ul>
              </div>

              {/* Original Thesis Memory */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Original Purchase Thesis in Memory
                </span>
                <p className="text-white font-medium italic">
                  "{reviewModalItem.investmentReason || reviewModalItem.investmentThesis}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Bought: {reviewModalItem.purchaseDate}</span>
                  <span>Avg Buy: ₹{reviewModalItem.buyPrice}</span>
                  <span>Quantity: {reviewModalItem.quantity}</span>
                </div>
              </div>

              {/* View Evidence Button */}
              {stockData && stockData.evidence && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    id="view-evidence-from-review-btn"
                    onClick={() => openEvidenceModal(reviewModalItem.stockName, stockData.evidence)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-blue-400 border border-slate-700 text-xs font-semibold transition-all"
                  >
                    <Database className="h-3.5 w-3.5" />
                    <span>View Audited Evidence Breakdown</span>
                  </button>
                </div>
              )}

              {/* Actions Section */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">
                  Disciplined Wealth Decision Framework
                </span>
                <p className="text-[11px] text-slate-400">
                  Disciplined long-term investors do not hold a company when the core business thesis is broken, even if the price is green. What would you like to decide?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    id="simulate-reallocate-btn"
                    onClick={handleSimulateReallocate}
                    className="p-3 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs flex flex-col items-start gap-1 shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      <span>Reallocate Capital (Recommended)</span>
                    </div>
                    <span className="text-[10px] font-normal text-rose-100">
                      Lock in gains and rotate capital into high conviction TCS / Sun Pharma / Index ETF.
                    </span>
                  </button>

                  <button
                    type="button"
                    id="maintain-strict-hold-btn"
                    onClick={handleUpdateThesis}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs flex flex-col items-start gap-1 transition-all text-left"
                  >
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <FileText className="h-4 w-4" />
                      <span>Retain with Updated Strict Watch</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-400">
                      Keep position for 1 more quarter to monitor upcoming earnings before final exit.
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            id="dismiss-review-modal-btn"
            onClick={closeReviewModal}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close Review Panel
          </button>
        </div>
      </div>
    </div>
  );
};
