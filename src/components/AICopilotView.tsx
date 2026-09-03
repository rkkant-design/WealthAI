import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useWealth } from '../context/WealthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AICopilotView: React.FC = () => {
  const { investorProfile, portfolio, marketIndices, marketRegime, portfolioStats } = useWealth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello Kamal! I am your **WealthPilot AI Investment Intelligence Agent**. 

I have full context of your:
- **Profile:** Medium Risk • Long-Term Horizon (10-20 yrs) • Monthly Budget ₹15,000
- **Portfolio:** ₹4,18,650 Current Value • 57.5% Banking Exposure (HDFC & ICICI) • Apex Chem Alert
- **Market:** NSE India (NIFTY 24,852) • Regime: Cautiously Positive (84% Confidence)

Ask me anything about stock entry timing, valuation multiples, portfolio risk, or where to deploy your monthly capital.`,
      timestamp: 'Just now',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    'Where should I invest my ₹15,000 this month?',
    'Should I buy Reliance now?',
    'Why shouldn\'t I buy Titan at current levels?',
    'Why are you recommending holding Asian Paints despite -8% drop?',
    'Which stock in my portfolio needs an immediate review?',
    'Am I overexposed to banking?',
    'Explain my portfolio like I\'m 15 years old.',
    'What should I do if NIFTY falls 20%?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          investorProfile,
          portfolio,
          marketIndices,
          marketRegime,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I analyzed your request against your portfolio and NSE market data.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      // Fallback intelligent response if server is disconnected or offline
      let fallbackText = `### AI Advisory Analysis for Kamal

Based on your **₹15,000 monthly budget** and **Medium Risk profile**:

1. **Strategic Allocation:** Prioritize **TCS (₹4,190)** and **Sun Pharma (₹1,812)** as both are resting in their preferred buy zones with zero debt and ROE > 22%.
2. **Concentration Guardrail:** Avoid adding to HDFC Bank or ICICI Bank this month because banking represents **57.5%** of your total portfolio.
3. **Cash Reserve:** Hold **₹3,000** in liquid cash to exploit upcoming market volatility.
4. **Attention Item:** Inspect **Apex Specialty Chem** due to operating margin compression.`;

      const aiFallbackMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiFallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-copilot-view" className="space-y-4 animate-in fade-in duration-300 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-white">WealthPilot AI Copilot</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Institutional Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">
              NSE India Equity Intelligence • Persona: Disciplined Wealth Advisor for Kamal
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome-reset',
                role: 'assistant',
                content: `Chat history reset. How can I assist your investment decisions today, Kamal?`,
                timestamp: 'Just now',
              },
            ])
          }
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-2 rounded-lg bg-slate-900 border border-slate-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0 custom-scrollbar">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-br from-indigo-600 to-cyan-500 text-white'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[9px] font-mono pt-1 text-right ${
                    isUser ? 'text-blue-200' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center animate-pulse">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
              <span>Analyzing portfolio weights, valuation multiples & NSE market data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputPrompt);
        }}
        className="flex items-center gap-2 pt-1 flex-shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ask anything (e.g. 'Should I buy Reliance now?', 'Where to deploy ₹15K?')..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all flex-shrink-0"
        >
          <span>Ask</span>
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};
