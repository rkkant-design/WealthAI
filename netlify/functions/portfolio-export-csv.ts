// POST /api/portfolio/export-csv (mapped via netlify.toml)
export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const { items } = body as { items?: any[] };
    if (!Array.isArray(items)) {
      return Response.json({ error: "Invalid portfolio items array" }, { status: 400 });
    }

    const headers = [
      "Symbol", "Company Name", "Sector", "Market Cap Category", "Quantity",
      "Avg Buy Price (INR)", "Current Price (INR)", "Total Invested (INR)",
      "Current Value (INR)", "Unrealized P&L (INR)", "P&L %", "Weight %",
      "Recommendation", "Action Reason",
    ];

    const escape = (str: any) => `"${String(str ?? "").replace(/"/g, '""')}"`;
    const rows = items.map((item: any) => {
      const invested = (item.quantity * item.buyPrice).toFixed(2);
      const currentVal = (item.quantity * item.currentPrice).toFixed(2);
      const pnl = (Number(currentVal) - Number(invested)).toFixed(2);
      const pnlPct = invested !== "0.00"
        ? (((Number(currentVal) - Number(invested)) / Number(invested)) * 100).toFixed(2)
        : "0.00";
      return [
        escape(item.stockSymbol), escape(item.stockName), escape(item.sector),
        escape(item.marketCapCategory), item.quantity, item.buyPrice, item.currentPrice,
        invested, currentVal, pnl, pnlPct,
        item.weight ? `${item.weight.toFixed(1)}%` : "0%",
        escape(item.recommendation), escape(item.actionReason),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const filename = `WealthPilot_Portfolio_${new Date().toISOString().split("T")[0]}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error("CSV export function error:", err);
    return Response.json({ error: "Failed to generate CSV export" }, { status: 500 });
  }
};
