// POST /api/portfolio/audit (mapped via netlify.toml)
export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const { items } = body as { items?: any[] };
    if (!Array.isArray(items)) {
      return Response.json({ error: "Invalid items" }, { status: 400 });
    }

    const sectorWeights: Record<string, number> = {};
    let totalVal = 0;
    items.forEach((i: any) => {
      const val = (i.quantity || 0) * (i.currentPrice || 0);
      totalVal += val;
      sectorWeights[i.sector] = (sectorWeights[i.sector] || 0) + val;
    });

    const warnings: string[] = [];
    if (totalVal > 0) {
      Object.entries(sectorWeights).forEach(([sec, val]) => {
        const pct = (val / totalVal) * 100;
        if (pct > 28) {
          warnings.push(`High concentration risk: ${sec} accounts for ${pct.toFixed(1)}% of your portfolio (Recommended max: 25%).`);
        }
      });
    }

    const pennyHoldings = items.filter((i: any) => i.currentPrice < 20 || i.marketCapCategory === "Penny Stock");
    if (pennyHoldings.length > 0) {
      warnings.push(`Speculative exposure: ${pennyHoldings.map((p: any) => p.stockSymbol).join(", ")} are microcap/penny stocks carrying elevated liquidation and volatility risks.`);
    }

    return Response.json({
      auditScore: Math.max(20, Math.min(100, 100 - warnings.length * 15)),
      warnings,
      sectorConcentration: sectorWeights,
      totalHoldings: items.length,
      auditTimestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
