import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Bell, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { NewsDetailItem } from "../components/NewsDetailView";
import type { SelectedStock } from "../components/StockChartModal";
import { MARKET_NEWS, SECTORS, TRADE_IDEAS } from "../data/marketData";
import { useLiveMarket } from "../hooks/useLiveMarket";

const MARKET_MOOD_VALUE = 62;

function getMoodLabel(val: number): { label: string; color: string } {
  if (val < 20) return { label: "Extreme Fear", color: "text-red-700" };
  if (val < 40) return { label: "Fear", color: "text-orange-600" };
  if (val < 60) return { label: "Neutral", color: "text-yellow-600" };
  if (val < 80) return { label: "Greed", color: "text-green-600" };
  return { label: "Extreme Greed", color: "text-emerald-700" };
}

interface HomePageProps {
  onNewsClick: (news: NewsDetailItem) => void;
  onStockClick: (stock: SelectedStock) => void;
}

export function HomePage({ onNewsClick, onStockClick }: HomePageProps) {
  const { indices, stocks, flashMap } = useLiveMarket();
  const [notifCount] = useState(3);
  const mood = getMoodLabel(MARKET_MOOD_VALUE);
  const topPicks = TRADE_IDEAS.filter((t) => t.status === "Active").slice(0, 3);
  const hotStocks = stocks.slice(0, 6);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-primary px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            StockWise
          </span>
        </div>
        <button
          type="button"
          data-ocid="home.notification_button"
          className="relative p-2 rounded-full bg-white/10"
        >
          <Bell className="w-5 h-5 text-white" />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              {notifCount}
            </span>
          )}
        </button>
      </div>

      {/* Indices Scroll Strip */}
      <div className="bg-white border-b border-border overflow-x-auto scrollbar-hide">
        <div className="flex gap-0 min-w-max">
          {indices.map((idx) => (
            <div
              key={idx.name}
              className="flex flex-col px-4 py-2.5 border-r border-border last:border-r-0 min-w-[120px]"
            >
              <span className="text-[11px] text-muted-foreground font-medium truncate">
                {idx.name}
              </span>
              <span className="text-sm font-bold text-foreground">
                {idx.value.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span
                className={`text-[11px] font-semibold ${
                  idx.changePct >= 0 ? "text-gain" : "text-loss"
                }`}
              >
                {idx.changePct >= 0 ? "+" : ""}
                {idx.changePct.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Today's Top Picks */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base text-foreground">
              Today's Top Picks
            </h2>
            <button
              type="button"
              className="text-primary text-sm font-semibold flex items-center gap-0.5"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {topPicks.map((pick) => (
              <motion.button
                type="button"
                key={pick.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                data-ocid="home.top_pick.button"
                onClick={() =>
                  onStockClick({
                    symbol: pick.symbol,
                    ltp: pick.entry,
                    changePct: pick.upside,
                  })
                }
                className="min-w-[200px] bg-white rounded-xl border border-border shadow-card p-3.5 text-left hover:border-primary/40 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground">
                    {pick.symbol}
                  </span>
                  <Badge
                    className={`text-[10px] font-bold ${
                      pick.type === "BUY"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {pick.type}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {pick.exchange} · {pick.timeframe}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs">
                    Target:{" "}
                    <span className="font-semibold text-foreground">
                      ₹{pick.target.toLocaleString("en-IN")}
                    </span>
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      pick.upside > 0 ? "text-gain" : "text-loss"
                    }`}
                  >
                    {pick.upside > 0 ? "+" : ""}
                    {pick.upside.toFixed(1)}%
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  by {pick.analyst}
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Market Mood */}
        <section>
          <h2 className="font-bold text-base text-foreground mb-3">
            Market Mood Index
          </h2>
          <div className="bg-white rounded-xl border border-border shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Fear & Greed Index
              </span>
              <span className={`text-sm font-bold ${mood.color}`}>
                {mood.label}
              </span>
            </div>
            <div
              className="relative h-3 rounded-full overflow-hidden"
              style={{
                background:
                  "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #16a34a)",
              }}
            >
              <div
                className="absolute top-0 w-4 h-4 rounded-full bg-white border-2 border-foreground shadow -translate-y-0.5 -translate-x-2"
                style={{ left: `${MARKET_MOOD_VALUE}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>Extreme Fear</span>
              <span className={`text-sm font-bold ${mood.color}`}>
                {MARKET_MOOD_VALUE}
              </span>
              <span>Extreme Greed</span>
            </div>
          </div>
        </section>

        {/* Hot Stocks */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base text-foreground">
              Hot Stocks Today 🔥
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {hotStocks.map((stock) => (
              <button
                type="button"
                key={stock.symbol}
                data-ocid="home.hot_stock.button"
                onClick={() =>
                  onStockClick({
                    symbol: stock.symbol,
                    name: stock.name,
                    ltp: stock.ltp,
                    changePct: stock.changePct,
                  })
                }
                className={`min-w-[110px] rounded-xl border border-border p-3 text-center transition-colors duration-300 cursor-pointer hover:border-primary/40 hover:shadow-md active:scale-[0.98] ${
                  flashMap[stock.symbol] === "gain"
                    ? "bg-green-50"
                    : flashMap[stock.symbol] === "loss"
                      ? "bg-red-50"
                      : "bg-white"
                } shadow-card`}
              >
                <div className="text-xs font-bold text-foreground">
                  {stock.symbol}
                </div>
                <div className="text-sm font-bold mt-1">
                  ₹
                  {stock.ltp.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-xs font-semibold mt-0.5 flex items-center justify-center gap-0.5 ${
                    stock.changePct >= 0 ? "text-gain" : "text-loss"
                  }`}
                >
                  {stock.changePct >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stock.changePct >= 0 ? "+" : ""}
                  {stock.changePct.toFixed(2)}%
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Sector Performance */}
        <section>
          <h2 className="font-bold text-base text-foreground mb-3">
            Sector Performance
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {SECTORS.map((sector) => (
              <div
                key={sector.name}
                className="bg-white rounded-xl border border-border shadow-card p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {sector.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {sector.stocks} stocks
                  </div>
                </div>
                <span
                  className={`text-sm font-bold px-2 py-1 rounded-lg ${
                    sector.changePct >= 0
                      ? "bg-gain text-gain"
                      : "bg-loss text-loss"
                  }`}
                >
                  {sector.changePct >= 0 ? "+" : ""}
                  {sector.changePct.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Market News */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base text-foreground">Market News</h2>
            <button
              type="button"
              className="text-primary text-sm font-semibold flex items-center gap-0.5"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {MARKET_NEWS.slice(0, 4).map((news, i) => (
              <button
                type="button"
                key={news.id}
                data-ocid={`news.item.${i + 1}`}
                onClick={() => onNewsClick(news)}
                className="w-full text-left bg-white rounded-xl border border-border shadow-card p-3.5 hover:border-primary/40 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] mt-0.5 shrink-0"
                  >
                    {news.category}
                  </Badge>
                  <p className="text-sm text-foreground font-medium leading-snug">
                    {news.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-muted-foreground">
                    {news.source}
                  </span>
                  <span className="text-[11px] text-muted-foreground">·</span>
                  <span className="text-[11px] text-muted-foreground">
                    {news.time}
                  </span>
                  <span className="ml-auto text-[11px] text-primary font-semibold">
                    Read more →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
