import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, TrendingDown, TrendingUp, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { SelectedStock } from "../components/StockChartModal";
import { TRADE_IDEAS } from "../data/marketData";

const TABS = [
  { key: "all", label: "All" },
  { key: "Intraday", label: "Intraday" },
  { key: "Short Term", label: "Short" },
  { key: "Long Term", label: "Long" },
  { key: "Options", label: "Options" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-blue-100 text-blue-700",
    "Target Hit": "bg-green-100 text-green-700",
    "SL Hit": "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        styles[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

interface TradeIdeasPageProps {
  onStockClick: (stock: SelectedStock) => void;
}

export function TradeIdeasPage({ onStockClick }: TradeIdeasPageProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = TRADE_IDEAS.filter(
    (t) => activeTab === "all" || t.timeframe === activeTab,
  );

  return (
    <div>
      <div className="sticky top-0 z-20 bg-primary px-4 py-3">
        <h1 className="text-white font-bold text-lg">Trade Ideas</h1>
        <p className="text-white/70 text-xs mt-0.5">
          Expert recommendations with entry/exit levels
        </p>
      </div>

      <div className="sticky top-[60px] z-10 bg-white border-b border-border px-4 py-2">
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.key}
              data-ocid={`trade_ideas.${tab.key}.tab`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3 pb-4">
        {filtered.map((idea, i) => (
          <motion.button
            type="button"
            key={idea.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            data-ocid={`trade_ideas.item.${i + 1}`}
            onClick={() =>
              onStockClick({
                symbol: idea.symbol,
                ltp: idea.entry,
                changePct: idea.upside,
              })
            }
            className="w-full bg-white rounded-xl border border-border shadow-card p-4 text-left hover:border-primary/40 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-foreground">
                    {idea.symbol}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {idea.exchange}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={`text-[11px] font-bold ${
                      idea.type === "BUY"
                        ? "bg-green-500 text-white hover:bg-green-500"
                        : "bg-red-500 text-white hover:bg-red-500"
                    }`}
                  >
                    {idea.type === "BUY" ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {idea.type}
                  </Badge>
                  <StatusBadge status={idea.status} />
                </div>
              </div>
              <span
                className={`text-lg font-black ${
                  idea.upside > 0 ? "text-gain" : "text-loss"
                }`}
              >
                {idea.upside > 0 ? "+" : ""}
                {idea.upside.toFixed(1)}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-border my-2">
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground">Entry</div>
                <div className="text-sm font-bold text-foreground">
                  ₹{idea.entry.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground">
                  Stop Loss
                </div>
                <div className="text-sm font-bold text-loss">
                  ₹{idea.sl.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground">Target</div>
                <div className="text-sm font-bold text-gain">
                  ₹{idea.target.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Target className="w-3 h-3" />
                <span>
                  RR:{" "}
                  <span className="font-semibold text-foreground">
                    {idea.rr}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="font-medium text-foreground">
                  {idea.timeframe}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="w-3 h-3" />
                <span>{idea.analyst}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
