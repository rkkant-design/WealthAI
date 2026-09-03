import React, { useState } from 'react';
import { BrainCircuit, CheckCircle2, AlertTriangle, FileEdit, Database, ArrowRight, PlusCircle, Save } from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const InvestmentThesisView: React.FC = () => {
  const { portfolio, updateHoldingThesis, openEvidenceModal, setSelectedStockSymbol, stocks } = useWealth();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedThesis, setEditedThesis] = useState<string>('');

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditedThesis(item.investmentReason || item.investmentThesis);
  };

  const handleSaveEdit = (id: string) => {
    updateHoldingThesis(id, editedThesis, 'User updated investment thesis in personal memory.');
    setEditingId(null);
  };

  return (
    <div id="investment-thesis-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Living Investment Memory
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Holding Thesis Engine
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Never sell on emotional market noise. Track original business logic and verified quarterly milestones.
          </p>
        </div>
      </div>

      {/* Thesis Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {portfolio.map((item) => {
          const matchingStock = stocks.find((s) => s.symbol === item.stockSymbol);
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              id={`thesis-card-${item.stockSymbol}`}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-white">{item.stockSymbol}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.sector}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{item.stockName}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      item.thesisStatus === 'INTACT'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    Thesis: {item.thesisStatus}
                  </span>
                </div>

                {/* Core Thesis Content */}
                <div className="my-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Purchase Thesis in Memory
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                      >
                        <FileEdit className="h-3 w-3" /> Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={editedThesis}
                        onChange={(e) => setEditedThesis(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-blue-500 text-xs text-white focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
                        >
                          <Save className="h-3 w-3" /> Save Memory
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-200 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed font-medium">
                      "{item.investmentReason || item.investmentThesis}"
                    </p>
                  )}
                </div>

                {/* Validation Checklist if matching stock data exists */}
                {matchingStock && (
                  <div className="space-y-2 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                      <span className="text-emerald-400 font-bold block text-[11px] mb-1">
                        ✅ Thesis Intact If:
                      </span>
                      <ul className="text-slate-300 text-[10px] space-y-0.5 list-disc list-inside">
                        {matchingStock.investmentThesis.validIf.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30">
                      <span className="text-rose-400 font-bold block text-[11px] mb-1">
                        ⚠️ Reconsider / Exit If:
                      </span>
                      <ul className="text-slate-300 text-[10px] space-y-0.5 list-disc list-inside">
                        {matchingStock.investmentThesis.reconsiderIf.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Bought: {item.purchaseDate} @ ₹{item.buyPrice}
                </span>

                <button
                  onClick={() => setSelectedStockSymbol(item.stockSymbol)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Analyze Stock</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
