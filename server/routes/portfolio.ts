import { Router } from "express";

const router = Router();

// POST /api/portfolio/export-csv
router.post("/export-csv", (req, res) => {
  try {
    const { items, profile } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid portfolio items array" });
    }

    const headers = [
      "Symbol",
      "Company Name",
      "Sector",
      "Market Cap Category",
      "Quantity",
      "Avg Buy Price (INR)",
      "Current Price (INR)",
      "Total Invested (INR)",
      "Current Value (INR)",
      "Unrealized P&L (INR)",
      "P&L %",
      "Weight %",
      "Recommendation",
      "Action Reason"
    ];

    const rows = items.map((item: any) => {
      const invested = (item.quantity * item.buyPrice).toFixed(2);
      const currentVal = (item.quantity * item.currentPrice).toFixed(2);
      const pnl = (Number(currentVal) - Number(invested)).toFixed(2);
      const pnlPct = invested !== '0.00' ? (((Number(currentVal) - Number(invested)) / Number(invested)) * 100).toFixed(2) : '0.00';
      const escape = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;

      return [
        escape(item.stockSymbol),
        escape(item.stockName),
        escape(item.sector),
        escape(item.marketCapCategory),
        item.quantity,
        item.buyPrice,
        item.currentPrice,
        invested,
        currentVal,
        pnl,
        pnlPct,
        item.weight ? `${item.weight.toFixed(1)}%` : '0%',
        escape(item.recommendation),
        escape(item.actionReason),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const filename = `WealthPilot_Portfolio_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (err: any) {
    console.error("CSV export error:", err);
    return res.status(500).json({ error: "Failed to generate CSV export" });
  }
});

// POST /api/portfolio/audit
router.post("/audit", (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid items" });
    }

    // Sector concentration check
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

    // Penny stock check
    const pennyHoldings = items.filter((i: any) => (i.currentPrice < 20 || i.marketCapCategory === 'Penny Stock'));
    if (pennyHoldings.length > 0) {
      warnings.push(`Speculative exposure: ${pennyHoldings.map((p: any) => p.stockSymbol).join(', ')} are microcap/penny stocks carrying elevated liquidation and volatility risks.`);
    }

    return res.json({
      auditScore: Math.max(20, Math.min(100, 100 - (warnings.length * 15))),
      warnings,
      sectorConcentration: sectorWeights,
      totalHoldings: items.length,
      auditTimestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
