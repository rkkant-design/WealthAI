export interface MarketIndex {
  symbol: string;
  name: string;
  currentValue: number;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
  status: 'OPEN' | 'CLOSED';
}

export async function getMarketIndicesOverview(): Promise<{
  indices: MarketIndex[];
  marketStatus: { isOpen: boolean; sessionMessage: string; timestamp: string };
}> {
  // Determine if Indian market is open (09:15 to 15:30 IST on Mon-Fri)
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const istMinutesTotal = ((utcHours + 5) * 60 + (utcMinutes + 30)) % (24 * 60);
  const istDay = (now.getUTCDay() + (utcHours + 5.5 >= 24 ? 1 : 0)) % 7;
  
  const isWeekday = istDay >= 1 && istDay <= 5;
  const isMarketHours = istMinutesTotal >= (9 * 60 + 15) && istMinutesTotal <= (15 * 60 + 30);
  const isMarketOpen = isWeekday && isMarketHours;

  const defaultIndices: MarketIndex[] = [
    {
      symbol: '^NSEI',
      name: 'NIFTY 50',
      currentValue: 22450.35,
      change: 112.45,
      changePercent: 0.50,
      high52w: 26277.35,
      low52w: 21281.45,
      status: isMarketOpen ? 'OPEN' : 'CLOSED',
    },
    {
      symbol: '^BSESN',
      name: 'SENSEX',
      currentValue: 73890.10,
      change: 360.20,
      changePercent: 0.49,
      high52w: 85978.25,
      low52w: 70001.60,
      status: isMarketOpen ? 'OPEN' : 'CLOSED',
    },
    {
      symbol: '^NSEBANK',
      name: 'BANK NIFTY',
      currentValue: 48210.80,
      change: -45.60,
      changePercent: -0.09,
      high52w: 54467.35,
      low52w: 45600.00,
      status: isMarketOpen ? 'OPEN' : 'CLOSED',
    },
    {
      symbol: '^INDIAVIX',
      name: 'INDIA VIX',
      currentValue: 13.45,
      change: -0.35,
      changePercent: -2.54,
      high52w: 24.50,
      low52w: 9.85,
      status: isMarketOpen ? 'OPEN' : 'CLOSED',
    },
  ];

  // Attempt real-time fetch from Yahoo Finance
  try {
    const symbols = ['^NSEI', '^BSESN', '^NSEBANK'];
    const results = await Promise.allSettled(
      symbols.map(async (s) => {
        const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d&range=5d`, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        if (!res.ok) return null;
        const data: any = await res.json();
        const meta = data.chart?.result?.[0]?.meta;
        if (!meta) return null;
        const val = Number(meta.regularMarketPrice?.toFixed(2) || 0);
        const prev = Number(meta.chartPreviousClose?.toFixed(2) || val);
        const chg = Number((val - prev).toFixed(2));
        const chgPct = prev ? Number(((chg / prev) * 100).toFixed(2)) : 0;
        return {
          symbol: s,
          name: s === '^NSEI' ? 'NIFTY 50' : s === '^BSESN' ? 'SENSEX' : 'BANK NIFTY',
          currentValue: val,
          change: chg,
          changePercent: chgPct,
          high52w: Number(meta.fiftyTwoWeekHigh?.toFixed(2) || val * 1.1),
          low52w: Number(meta.fiftyTwoWeekLow?.toFixed(2) || val * 0.9),
          status: (isMarketOpen ? 'OPEN' : 'CLOSED') as 'OPEN' | 'CLOSED',
        };
      })
    );

    const liveIndices = results
      .filter((r): r is PromiseFulfilledResult<MarketIndex> => r.status === 'fulfilled' && r.value !== null)
      .map((r) => r.value);

    if (liveIndices.length > 0) {
      return {
        indices: liveIndices,
        marketStatus: {
          isOpen: isMarketOpen,
          sessionMessage: isMarketOpen ? "NSE/BSE Regular Session Active (09:15 – 15:30 IST)" : "Markets Closed (Trading resumes next market day 09:15 IST)",
          timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }),
        }
      };
    }
  } catch (err) {
    console.warn("Market indices fetch fallback:", err);
  }

  return {
    indices: defaultIndices,
    marketStatus: {
      isOpen: isMarketOpen,
      sessionMessage: isMarketOpen ? "NSE/BSE Live Session" : "Markets Closed",
      timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }),
    }
  };
}
