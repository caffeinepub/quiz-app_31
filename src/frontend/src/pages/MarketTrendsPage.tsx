import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame, TrendingDown, TrendingUp, Zap } from "lucide-react";

const TREND_NEWS = [
  {
    id: 1,
    title: "Nifty 50 Breaks Out Above 22,400 — Bullish Momentum Continues",
    summary:
      "The Nifty 50 closed above the key 22,400 level with strong volume, indicating bullish sentiment. RSI at 65 confirms momentum. Traders expect a move toward 22,800–23,000 in the coming sessions.",
    category: "Index",
    sentiment: "bullish" as const,
    time: "Today, 11:30",
  },
  {
    id: 2,
    title: "IT Sector Faces Headwinds — TCS, Infosys Both Down 1%+",
    summary:
      "Indian IT stocks are under selling pressure amid global tech concerns. TCS fell 1.2% and Infosys dropped 1.4%. Nifty IT index testing crucial support at 37,000.",
    category: "Sector",
    sentiment: "bearish" as const,
    time: "Today, 11:00",
  },
  {
    id: 3,
    title: "Banking Sector Alert — HDFC Bank and ICICI Show Strength",
    summary:
      "Private banking stocks showing relative strength. HDFC Bank up 0.54%, ICICI Bank up 1.32%. Bank Nifty consolidating near 48,200 — could be a buying opportunity.",
    category: "Banking",
    sentiment: "bullish" as const,
    time: "Today, 10:45",
  },
  {
    id: 4,
    title: "MCX Gold Holds Above ₹72,000 — Safe Haven Demand",
    summary:
      "Gold prices holding firm above ₹72,000 per 10 grams amid global uncertainty. International spot gold steady at $2,310. Bulls targeting ₹72,800 for the week.",
    category: "Commodity",
    sentiment: "bullish" as const,
    time: "Today, 10:15",
  },
  {
    id: 5,
    title: "Auto Sector — Tata Motors Under Selling Pressure",
    summary:
      "Tata Motors fell over 2% after weaker-than-expected EV sales data. Stock testing support at ₹940. Options data shows heavy put writing at 940 strike.",
    category: "Auto",
    sentiment: "bearish" as const,
    time: "Today, 09:45",
  },
];

const TRENDING_STOCKS = [
  { symbol: "HDFCBANK", change: "+1.54%", vol: "120.5L", positive: true },
  { symbol: "ICICIBANK", change: "+1.32%", vol: "98.6L", positive: true },
  { symbol: "TATAMOTORS", change: "-2.26%", vol: "148.2L", positive: false },
  { symbol: "BAJFINANCE", change: "+1.18%", vol: "18.2L", positive: true },
  { symbol: "INFY", change: "-1.23%", vol: "56.8L", positive: false },
  { symbol: "ADANIENT", change: "+1.56%", vol: "28.4L", positive: true },
];

const SECTORS = [
  { name: "Banking", change: 0.82, color: "bg-success" },
  { name: "IT", change: -1.12, color: "bg-destructive" },
  { name: "Auto", change: -0.84, color: "bg-destructive" },
  { name: "Pharma", change: 0.24, color: "bg-success" },
  { name: "Energy", change: 0.43, color: "bg-success" },
  { name: "FMCG", change: 0.12, color: "bg-success" },
  { name: "Metal", change: -0.38, color: "bg-destructive" },
  { name: "Realty", change: 1.24, color: "bg-success" },
  { name: "Infra", change: 0.67, color: "bg-success" },
  { name: "NBFC", change: 0.91, color: "bg-success" },
];

const BREAKOUTS = [
  {
    symbol: "ADANIENT",
    type: "Bullish Breakout",
    detail: "Breaking above 2,440 resistance with volume",
    strength: 85,
  },
  {
    symbol: "KOTAKBANK",
    type: "Trend Continuation",
    detail: "EMA 20 cross on daily chart, momentum building",
    strength: 72,
  },
  {
    symbol: "MARUTI",
    type: "52W High",
    detail: "New 52-week high at 11,248 on strong volume",
    strength: 90,
  },
  {
    symbol: "WIPRO",
    type: "Bearish Breakdown",
    detail: "Below key support at 455, volume spike",
    strength: 68,
  },
];

export default function MarketTrendsPage() {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Latest Market Trends
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time analysis of Indian markets — updated continuously
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* News cards */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {TREND_NEWS.map((news) => (
              <div
                key={news.id}
                className={`bg-card border rounded-xl p-4 ${
                  news.sentiment === "bullish"
                    ? "border-success/25"
                    : "border-destructive/25"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground leading-snug">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-border text-muted-foreground"
                    >
                      {news.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        news.sentiment === "bullish"
                          ? "bg-success/10 text-success border-success/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                      }`}
                    >
                      {news.sentiment === "bullish" ? (
                        <TrendingUp className="w-2.5 h-2.5 mr-1" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5 mr-1" />
                      )}
                      {news.sentiment}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {news.summary}
                </p>
                <p className="text-[10px] text-primary mt-2">{news.time}</p>
              </div>
            ))}
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            {/* Trending stocks */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-warning" />
                <h2 className="text-sm font-semibold text-foreground">
                  Trending Stocks
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {TRENDING_STOCKS.map((s, i) => (
                  <div
                    key={s.symbol}
                    data-ocid={`trending.item.${i + 1}`}
                    className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0"
                  >
                    <span className="text-xs font-semibold text-foreground">
                      {s.symbol}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {s.vol}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold ${s.positive ? "text-success" : "text-destructive"}`}
                      >
                        {s.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector heatmap */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Sector Performance
              </h2>
              <div className="grid grid-cols-2 gap-1.5">
                {SECTORS.map((sector) => (
                  <div
                    key={sector.name}
                    className={`rounded-lg p-2 ${
                      sector.change >= 0
                        ? "bg-success/10 border border-success/20"
                        : "bg-destructive/10 border border-destructive/20"
                    }`}
                  >
                    <p className="text-[10px] text-muted-foreground">
                      {sector.name}
                    </p>
                    <p
                      className={`text-xs font-mono font-bold ${sector.change >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {sector.change >= 0 ? "+" : ""}
                      {sector.change.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakout alerts */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Breakout Alerts
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {BREAKOUTS.map((b, i) => (
                  <div
                    key={b.symbol}
                    data-ocid={`breakout.item.${i + 1}`}
                    className="border-b border-border/30 last:border-0 pb-2 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">
                        {b.symbol}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] ${
                          b.type.includes("Bear") || b.type.includes("Down")
                            ? "bg-destructive/10 text-destructive border-destructive/30"
                            : "bg-success/10 text-success border-success/30"
                        }`}
                      >
                        {b.type}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {b.detail}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 bg-muted/30 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${
                            b.type.includes("Bear")
                              ? "bg-destructive"
                              : "bg-success"
                          }`}
                          style={{ width: `${b.strength}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {b.strength}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
