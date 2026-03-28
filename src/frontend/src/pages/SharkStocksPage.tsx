import { Briefcase, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { SelectedStock } from "../components/StockChartModal";
import { SHARK_INVESTORS } from "../data/marketData";

interface SharkStocksPageProps {
  onStockClick: (stock: SelectedStock) => void;
}

export function SharkStocksPage({ onStockClick }: SharkStocksPageProps) {
  const [selectedInvestor, setSelectedInvestor] = useState<number | null>(null);

  const investor = SHARK_INVESTORS.find((i) => i.id === selectedInvestor);

  if (investor) {
    return (
      <div>
        <div className="sticky top-0 z-20 bg-white border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="shark.back_button"
              onClick={() => setSelectedInvestor(null)}
              className="p-1.5 rounded-lg hover:bg-muted"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div
              className={`w-9 h-9 rounded-full ${investor.color} flex items-center justify-center text-white font-bold text-sm`}
            >
              {investor.initials}
            </div>
            <div>
              <h1 className="font-bold text-base text-foreground">
                {investor.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {investor.portfolioValue} · {investor.holdingsCount} stocks
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 pt-4 pb-6 space-y-3">
          <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">
            Top Holdings
          </h2>
          {investor.holdings.map((h, i) => {
            const ltp = h.avgCost * (1 + h.pnlPct / 100);
            return (
              <motion.button
                type="button"
                key={h.symbol}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`shark.item.${i + 1}`}
                onClick={() =>
                  onStockClick({
                    symbol: h.symbol,
                    ltp,
                    changePct: h.pnlPct,
                  })
                }
                className="w-full bg-white rounded-xl border border-border shadow-card p-4 text-left hover:border-primary/40 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base text-foreground">
                    {h.symbol}
                  </span>
                  <span
                    className={`text-base font-black ${
                      h.pnlPct >= 0 ? "text-gain" : "text-loss"
                    }`}
                  >
                    {h.pnlPct >= 0 ? "+" : ""}
                    {h.pnlPct.toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-[10px] text-muted-foreground">
                      Quantity
                    </div>
                    <div className="font-semibold">{h.qty}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">
                      Avg Cost
                    </div>
                    <div className="font-semibold">
                      ₹{h.avgCost.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">
                      Curr. Value
                    </div>
                    <div className="font-semibold">
                      ₹{h.currentValue.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-20 bg-primary px-4 py-3">
        <h1 className="text-white font-bold text-lg">🦈 Shark Stocks</h1>
        <p className="text-white/70 text-xs mt-0.5">
          Big investors' portfolios
        </p>
      </div>
      <div className="px-4 pt-4 space-y-3 pb-4">
        {SHARK_INVESTORS.map((inv, i) => (
          <motion.button
            key={inv.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            data-ocid={`shark.item.${i + 1}`}
            onClick={() => setSelectedInvestor(inv.id)}
            className="w-full bg-white rounded-xl border border-border shadow-card p-4 text-left hover:shadow-card-hover hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full ${inv.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}
              >
                {inv.initials}
              </div>
              <div className="flex-1">
                <div className="font-bold text-base text-foreground">
                  {inv.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {inv.portfolioValue}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-primary">
                  {inv.holdingsCount}
                </div>
                <div className="text-[10px] text-muted-foreground">Stocks</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
