import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame, TrendingDown, TrendingUp, Zap } from "lucide-react";
import type { NewsDetailItem } from "../components/NewsDetailView";
import type { SelectedStock } from "../components/StockChartModal";

const TREND_NEWS: NewsDetailItem[] = [
  {
    id: 101,
    title: "Nifty 50 Breaks Out Above 22,400 — Bullish Momentum Continues",
    category: "Index",
    source: "Market Analysis",
    time: "Today, 11:30",
    sentiment: "bullish",
    body: "The Nifty 50 closed above the key 22,400 level with strong volume, indicating bullish sentiment. RSI at 65 confirms momentum. Traders expect a move toward 22,800–23,000 in the coming sessions.\n\nBroad market participation was evident as advancing stocks outnumbered declining ones in a 3:1 ratio. The rally was led by auto, banking, and energy sectors, with midcap and smallcap indices also participating meaningfully — a sign of healthy market breadth.\n\nTechnically, the index has now broken out of a 6-week consolidation range. Option data shows maximum open interest at the 22,500 CE, suggesting the market could use that as an immediate target. Support is now placed at 22,200, and a close below that would negate the bullish thesis.",
    keyPoints: [
      "Nifty breaks out of 6-week range above 22,400 with strong volumes",
      "RSI at 65 — momentum intact; next targets at 22,800–23,000",
      "Support now placed at 22,200; OI data bullish up to 22,500",
    ],
  },
  {
    id: 102,
    title: "IT Sector Faces Headwinds — TCS, Infosys Both Down 1%+",
    category: "Sector",
    source: "Sector Watch",
    time: "Today, 11:00",
    sentiment: "bearish",
    body: "Indian IT stocks are under selling pressure amid global tech concerns. TCS fell 1.2% and Infosys dropped 1.4%. Nifty IT index is testing crucial support at 37,000 — a level that has held for the past four weeks.\n\nThe immediate trigger was a weaker-than-expected revenue guidance from a mid-tier US software company, which sparked concerns about discretionary IT spending by American enterprises. This comes on top of an already cautious outlook from Indian IT management teams about deal ramp-ups.\n\nTraders are advised to watch the 37,000 level closely. A breach on closing basis could push the Nifty IT index toward 36,200. However, if the level holds, it could offer a buying opportunity for investors with a 2–3 month view, especially ahead of Q2 result season starting mid-October.",
    keyPoints: [
      "Nifty IT testing 37,000 support — a break could lead to 36,200",
      "TCS -1.2%, Infosys -1.4%; weak US tech sentiment the trigger",
      "Investors with 2–3 month view can watch for support-based entry",
    ],
  },
  {
    id: 103,
    title: "Banking Sector Alert — HDFC Bank and ICICI Show Strength",
    category: "Banking",
    source: "Banking Desk",
    time: "Today, 10:45",
    sentiment: "bullish",
    body: "Private banking stocks are showing relative strength against a volatile broader market. HDFC Bank gained 0.54% while ICICI Bank rose 1.32%, outperforming the Nifty 50. Bank Nifty is consolidating near 48,200 after a sharp recovery from 46,800 — setting up a potential buying opportunity.\n\nThe resilience in private banks comes as credit growth data for August showed a robust 15.3% year-on-year expansion, exceeding analyst estimates. Asset quality metrics continue to improve, with gross NPAs for major private banks declining to multi-year lows.\n\nAnalysts at leading brokerages remain bullish on private sector banks with a 12-month view, citing favorable credit-deposit ratios, margin stability, and improving loan book quality. Bank Nifty targets are placed at 49,500–50,000 over the next quarter.",
    keyPoints: [
      "HDFC Bank +0.54%, ICICI Bank +1.32%; private banks outperforming",
      "Credit growth at 15.3% YoY in August; NPAs at multi-year lows",
      "Bank Nifty targets: 49,500–50,000 over next quarter",
    ],
  },
  {
    id: 104,
    title: "MCX Gold Holds Above ₹72,000 — Safe Haven Demand Persists",
    category: "Commodity",
    source: "Commodity Desk",
    time: "Today, 10:15",
    sentiment: "bullish",
    body: "Gold prices are holding firm above ₹72,000 per 10 grams on MCX amid a combination of global uncertainty, geopolitical tensions in the Middle East, and a mild weakening of the US dollar. International spot gold is steady at $2,310 per troy ounce.\n\nDomestic demand has been supported by seasonal buying ahead of the festive and wedding season in India. Jewellers and bullion dealers report higher inquiries as retail buyers seek to lock in prices before potential further appreciation.\n\nBulls are targeting ₹72,800 for the current week, with a broader target of ₹74,000–74,500 over the next month if global uncertainty persists. Key risk to the bullish view would be a sharp rally in the US dollar following strong US employment data expected on Friday.",
    keyPoints: [
      "MCX Gold holds ₹72,000; bullish target ₹72,800 this week",
      "International spot gold at $2,310; geopolitical uncertainty fueling demand",
      "Festive season domestic buying adds support; broader target ₹74,000",
    ],
  },
  {
    id: 105,
    title: "Auto Sector — Tata Motors Under Selling Pressure Post EV Data",
    category: "Auto",
    source: "Auto Sector Watch",
    time: "Today, 09:45",
    sentiment: "bearish",
    body: "Tata Motors fell over 2% after weaker-than-expected EV sales data for September showed a 12% month-on-month decline in domestic electric vehicle volumes. The stock is now testing a critical support at ₹940 — a level watched by both technical traders and long-term investors.\n\nOptions data shows heavy put writing at the 940 strike for the near-term expiry, suggesting that options sellers expect the stock to hold at these levels. However, if the support breaks on volume, the next meaningful support comes at ₹905–910.\n\nMeanwhile, JLR order book remains healthy at over 165,000 units, providing a cushion to the overall business fundamentals. The short-term weakness may be viewed as an opportunity by investors with a 6–12 month view, particularly ahead of Q2 results expected later this month.",
    keyPoints: [
      "Tata Motors -2%; EV volumes down 12% MoM triggers selling",
      "Critical support at ₹940; break could push to ₹905–910",
      "JLR order book healthy at 165,000 units — fundamental support intact",
    ],
  },
];

const TRENDING_STOCKS = [
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    ltp: 1654.3,
    change: "+1.54%",
    changePct: 1.54,
    vol: "120.5L",
    positive: true,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    ltp: 1023.45,
    change: "+1.32%",
    changePct: 1.32,
    vol: "98.6L",
    positive: true,
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    ltp: 946.8,
    change: "-2.26%",
    changePct: -2.26,
    vol: "148.2L",
    positive: false,
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance",
    ltp: 7234.55,
    change: "+1.18%",
    changePct: 1.18,
    vol: "18.2L",
    positive: true,
  },
  {
    symbol: "INFY",
    name: "Infosys",
    ltp: 1432.7,
    change: "-1.23%",
    changePct: -1.23,
    vol: "56.8L",
    positive: false,
  },
  {
    symbol: "ADANIENT",
    name: "Adani Enterprises",
    ltp: 2847.9,
    change: "+1.56%",
    changePct: 1.56,
    vol: "28.4L",
    positive: true,
  },
];

const SECTOR_PRICES: Record<string, number> = {
  Banking: 48250,
  IT: 37150,
  Auto: 22480,
  Pharma: 19870,
  Energy: 9240,
  FMCG: 52300,
  Metal: 8640,
  Realty: 7120,
  Infra: 8480,
  NBFC: 23450,
};

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

interface MarketTrendsPageProps {
  onNewsClick?: (news: NewsDetailItem) => void;
  onStockClick?: (stock: SelectedStock) => void;
}

export default function MarketTrendsPage({
  onNewsClick,
  onStockClick,
}: MarketTrendsPageProps) {
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
            {TREND_NEWS.map((news, i) => (
              <button
                type="button"
                key={news.id}
                data-ocid={`trends.news.item.${i + 1}`}
                onClick={() => onNewsClick?.(news)}
                className={`w-full text-left bg-card border rounded-xl p-4 cursor-pointer hover:shadow-md active:scale-[0.99] transition-all ${
                  news.sentiment === "bullish"
                    ? "border-success/25 hover:border-success/50"
                    : "border-destructive/25 hover:border-destructive/50"
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
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {news.body.split("\n\n")[0]}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-primary">{news.time}</p>
                  <span className="text-[11px] text-primary font-semibold">
                    Read more →
                  </span>
                </div>
              </button>
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
                  <button
                    type="button"
                    key={s.symbol}
                    data-ocid={`trending.item.${i + 1}`}
                    onClick={() =>
                      onStockClick?.({
                        symbol: s.symbol,
                        name: s.name,
                        ltp: s.ltp,
                        changePct: s.changePct,
                      })
                    }
                    className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0 hover:bg-muted/30 rounded px-1 transition-colors cursor-pointer w-full text-left"
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
                  </button>
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
                  <button
                    type="button"
                    key={sector.name}
                    onClick={() =>
                      onStockClick?.({
                        symbol: `NIFTY ${sector.name.toUpperCase()}`,
                        name: `Nifty ${sector.name} Index`,
                        ltp: SECTOR_PRICES[sector.name] ?? 10000,
                        changePct: sector.change,
                      })
                    }
                    className={`rounded-lg p-2 text-left cursor-pointer transition-all hover:scale-[1.03] active:scale-95 ${
                      sector.change >= 0
                        ? "bg-success/10 border border-success/20 hover:bg-success/20"
                        : "bg-destructive/10 border border-destructive/20 hover:bg-destructive/20"
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
                  </button>
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
