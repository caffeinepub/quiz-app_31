import NiftyChart from "@/components/trading/NiftyChart";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  Candle,
  CommunityPost,
  IntradayUpdate,
  MarketIndex,
  OptionRow,
  Signal,
} from "@/hooks/useLiveMarket";
import {
  Heart,
  MessageCircle,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface DashboardPageProps {
  indices: MarketIndex[];
  candles: Candle[];
  signals: Signal[];
  intradayUpdates: IntradayUpdate[];
  communityPosts: CommunityPost[];
  toggleLike: (id: string) => void;
  optionChain: OptionRow[];
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function SignalCard({ signal }: { signal: Signal }) {
  const isPos = signal.type === "BUY";
  const isNeg = signal.type === "SELL";
  return (
    <div
      className={`bg-card rounded-xl p-4 border ${
        isPos
          ? "border-success/30"
          : isNeg
            ? "border-destructive/30"
            : "border-warning/30"
      } flex flex-col gap-2`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">
          {signal.symbol}
        </span>
        <Badge
          className={`text-xs font-bold ${
            isPos
              ? "bg-success/15 text-success border-success/30"
              : isNeg
                ? "bg-destructive/15 text-destructive border-destructive/30"
                : "bg-warning/15 text-warning border-warning/30"
          }`}
          variant="outline"
        >
          {isPos ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : isNeg ? (
            <TrendingDown className="w-3 h-3 mr-1" />
          ) : (
            <Minus className="w-3 h-3 mr-1" />
          )}
          {signal.type}
        </Badge>
      </div>
      <p className="text-[10px] text-muted-foreground">
        {signal.strategy} · {signal.time}
      </p>
      <div className="grid grid-cols-3 gap-1 mt-1">
        <div className="bg-background/50 rounded p-1.5">
          <p className="text-[9px] text-muted-foreground">Entry</p>
          <p className="text-xs font-mono font-semibold text-foreground">
            {fmt(signal.entry)}
          </p>
        </div>
        <div className="bg-background/50 rounded p-1.5">
          <p className="text-[9px] text-muted-foreground">SL</p>
          <p className="text-xs font-mono font-semibold text-destructive">
            {fmt(signal.sl)}
          </p>
        </div>
        <div className="bg-background/50 rounded p-1.5">
          <p className="text-[9px] text-muted-foreground">Target</p>
          <p className="text-xs font-mono font-semibold text-success">
            {fmt(signal.target)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({
  indices,
  candles,
  signals,
  intradayUpdates,
  communityPosts,
  toggleLike,
}: DashboardPageProps) {
  return (
    <div className="flex h-full min-h-0">
      {/* Main content */}
      <ScrollArea className="flex-1 min-w-0">
        <div className="p-4 flex flex-col gap-4">
          {/* Page header */}
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Platform for Traders by Traders 🚀 · Trusted by 60,000+ Traders
            </p>
          </div>

          {/* Market ticker strip */}
          <div className="bg-sidebar border border-border rounded-xl p-3 overflow-hidden">
            <div className="flex gap-6 overflow-x-auto pb-1">
              {indices.map((idx) => (
                <div
                  key={idx.symbol}
                  className="flex items-center gap-3 shrink-0"
                >
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {idx.name}
                    </p>
                    <p className="text-sm font-mono font-bold text-foreground">
                      {fmt(idx.price)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      idx.change >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {idx.change >= 0 ? "+" : ""}
                    {fmt(idx.changePct)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main chart */}
          <div
            className="bg-card border border-border rounded-xl p-4 h-64"
            data-ocid="dashboard.chart_point"
          >
            <NiftyChart candles={candles} symbol="NIFTY 50" />
          </div>

          {/* Signal cards */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-2">
              Market Signals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {signals.slice(0, 3).map((s, i) => (
                <div key={s.id} data-ocid={`signal.item.${i + 1}`}>
                  <SignalCard signal={s} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Updates + Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent updates */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Recent FNO Updates
              </h2>
              <div className="flex flex-col gap-2">
                {intradayUpdates.slice(0, 4).map((u) => (
                  <div
                    key={u.id}
                    className="flex gap-2.5 py-2 border-b border-border/50 last:border-0"
                  >
                    <span
                      className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        u.type === "bullish"
                          ? "bg-success"
                          : u.type === "bearish"
                            ? "bg-destructive"
                            : "bg-warning"
                      }`}
                    />
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {u.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {u.desc}
                      </p>
                      <p className="text-[10px] text-primary mt-0.5">
                        {u.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market trends */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Latest Market Trends
              </h2>
              <div className="flex flex-col gap-3">
                <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-success">
                      🟢 Index Analysis
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Today
                    </span>
                  </div>
                  <p className="text-xs text-foreground">
                    Nifty 50 maintains bullish structure above 22,000. RSI at 62
                    — momentum remains positive. Next resistance at 22,600.
                  </p>
                </div>
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-destructive">
                      🔴 IT Sector Alert
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Today
                    </span>
                  </div>
                  <p className="text-xs text-foreground">
                    IT sector under pressure. TCS and Infy both below key EMAs.
                    Watch for breakdown below Nifty IT 37,000.
                  </p>
                </div>
                <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-warning">
                      🟡 Banking Watch
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Today
                    </span>
                  </div>
                  <p className="text-xs text-foreground">
                    Bank Nifty consolidating near 48,200. Expiry week — expect
                    high volatility. Support at 47,800; resistance at 48,600.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Market Ticker Table */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Market Ticker
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" data-ocid="dashboard.table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">
                      Index
                    </th>
                    <th className="text-right py-2 text-muted-foreground font-medium">
                      Price
                    </th>
                    <th className="text-right py-2 text-muted-foreground font-medium">
                      Change
                    </th>
                    <th className="text-right py-2 text-muted-foreground font-medium">
                      High
                    </th>
                    <th className="text-right py-2 text-muted-foreground font-medium">
                      Low
                    </th>
                    <th className="text-right py-2 text-muted-foreground font-medium">
                      Volume
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {indices.map((idx, i) => (
                    <tr
                      key={idx.symbol}
                      data-ocid={`ticker.row.${i + 1}`}
                      className="border-b border-border/30 hover:bg-accent/30 transition-colors"
                    >
                      <td className="py-2 font-semibold text-foreground">
                        {idx.name}
                      </td>
                      <td className="py-2 text-right font-mono font-semibold">
                        {fmt(idx.price)}
                      </td>
                      <td
                        className={`py-2 text-right font-mono font-semibold ${idx.change >= 0 ? "text-success" : "text-destructive"}`}
                      >
                        {idx.change >= 0 ? "+" : ""}
                        {fmt(idx.changePct)}%
                      </td>
                      <td className="py-2 text-right font-mono text-muted-foreground">
                        {fmt(idx.high)}
                      </td>
                      <td className="py-2 text-right font-mono text-muted-foreground">
                        {fmt(idx.low)}
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {idx.volume}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Right sidebar */}
      <div className="hidden xl:flex flex-col w-72 border-l border-border shrink-0 bg-sidebar">
        {/* Intraday updates */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="live-dot w-2 h-2 rounded-full bg-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Real-Time Intraday Updates
            </h3>
          </div>
          <div className="flex flex-col gap-2" data-ocid="intraday.list">
            {intradayUpdates.map((u, i) => (
              <div
                key={u.id}
                data-ocid={`intraday.item.${i + 1}`}
                className="flex gap-2 py-2 border-b border-border/40 last:border-0"
              >
                <span
                  className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${
                    u.type === "bullish"
                      ? "bg-success"
                      : u.type === "bearish"
                        ? "bg-destructive"
                        : "bg-warning"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-foreground leading-tight">
                    {u.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                    {u.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community feed */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Community Feed
            </h3>
            <div className="flex flex-col gap-3">
              {communityPosts.map((post, i) => (
                <div
                  key={post.id}
                  data-ocid={`community.item.${i + 1}`}
                  className="bg-card border border-border rounded-xl p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                      {post.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-foreground truncate">
                        {post.author}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {post.time}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="ml-auto text-[9px] shrink-0 border-primary/30 text-primary"
                    >
                      {post.tag}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      data-ocid={`community.like.${i + 1}`}
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1 text-[10px] transition-colors ${
                        post.liked
                          ? "text-destructive"
                          : "text-muted-foreground hover:text-destructive"
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 ${post.liked ? "fill-current" : ""}`}
                      />
                      {post.likes}
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      {post.replies}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
