import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, Info, Sparkles, AlertCircle } from 'lucide-react';
import { useWealth } from '../context/WealthContext';

export const AddInvestmentModal: React.FC = () => {
  const { isAddInvestmentOpen, setIsAddInvestmentOpen, stocks, addInvestment, setActiveTab } = useWealth();

  const [selectedSymbol, setSelectedSymbol] = useState('TCS');
  const [quantity, setQuantity] = useState<number>(10);
  const [purchasePrice, setPurchasePrice] = useState<number>(4190);
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [investmentReason, setInvestmentReason] = useState<string>('High free cash flow conversion & enterprise AI deal momentum');
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  if (!isAddInvestmentOpen) return null;

  const handleStockChange = (symbol: string) => {
    setSelectedSymbol(symbol);
    const stock = stocks.find((s) => s.symbol === symbol);
    if (stock) {
      setPurchasePrice(stock.currentPrice);
      setInvestmentReason(stock.investmentThesis.summary);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymbol || quantity <= 0 || purchasePrice <= 0) return;

    const stock = stocks.find((s) => s.symbol === selectedSymbol);

    addInvestment({
      stockSymbol: selectedSymbol,
      stockName: stock?.name || selectedSymbol,
      sector: stock?.sector || 'Diversified',
      quantity,
      buyPrice: purchasePrice,
      purchaseDate,
      investmentReason,
      investmentThesis: stock?.investmentThesis.summary || investmentReason,
    });

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setIsAddInvestmentOpen(false);
      setActiveTab('portfolio');
    }, 1200);
  };

  const totalValue = quantity * purchasePrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="add-investment-modal-content"
        className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-tight">Record Investment Holding</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adds holding to your persistent personal memory & tracking engine
              </p>
            </div>
          </div>
          <button
            id="close-add-investment-btn"
            onClick={() => setIsAddInvestmentOpen(false)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
          {successMessage ? (
            <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-sm font-bold text-white">Holding Added Successfully</h4>
              <p className="text-slate-300 text-xs">
                Added {quantity} shares of {selectedSymbol} (₹{totalValue.toLocaleString('en-IN')}) with thesis memory.
              </p>
            </div>
          ) : (
            <>
              {/* Select Stock */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Select NSE Stock</label>
                <select
                  id="investment-stock-select"
                  value={selectedSymbol}
                  onChange={(e) => handleStockChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-blue-500"
                >
                  {stocks.map((stock) => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol} — {stock.name} (₹{stock.currentPrice.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity & Buy Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Quantity (Shares)</label>
                  <input
                    id="investment-quantity-input"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Purchase Price (₹)</label>
                  <input
                    id="investment-price-input"
                    type="number"
                    step="0.1"
                    min="1"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Purchase Date</label>
                <input
                  id="investment-date-input"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Investment Thesis & Reason */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Investment Reason & Core Thesis <span className="text-blue-400 text-[10px]">(AI Memory Engine)</span>
                </label>
                <textarea
                  id="investment-reason-input"
                  rows={3}
                  value={investmentReason}
                  onChange={(e) => setInvestmentReason(e.target.value)}
                  placeholder="Why are you purchasing this company? (e.g. 5-year compounding, market share expansion, zero debt)..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 The AI uses this thesis to determine future <strong>HOLD vs. REVIEW</strong> recommendations so you don't panic-sell during routine market fluctuations.
                </p>
              </div>

              {/* Total Summary */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[11px] block">Total Capital Outlay</span>
                  <span className="text-base font-extrabold text-white font-mono">
                    ₹{totalValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[11px] block">Market</span>
                  <span className="text-xs font-semibold text-emerald-400">NSE India Equity</span>
                </div>
              </div>
            </>
          )}

          {/* Footer Actions */}
          {!successMessage && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                id="cancel-add-investment-btn"
                onClick={() => setIsAddInvestmentOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-add-investment-btn"
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Save to Portfolio</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
