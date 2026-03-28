import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { StockSignal } from "../backend.d";
import { useActor } from "../hooks/useActor";

type Filter = "ALL" | "BUY" | "SELL" | "HOLD";

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SignalBadge({ signal }: { signal: string }) {
  const upper = signal.toUpperCase();
  if (upper === "BUY")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gain/20 text-gain">
        <TrendingUp className="w-3 h-3" /> BUY
      </span>
    );
  if (upper === "SELL")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-loss/20 text-loss">
        <TrendingDown className="w-3 h-3" /> SELL
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400">
      <AlertTriangle className="w-3 h-3" /> HOLD
    </span>
  );
}

function SignalCard({ signal, index }: { signal: StockSignal; index: number }) {
  const upper = signal.signal.toUpperCase();
  const isBuy = upper === "BUY";
  const isSell = upper === "SELL";
  const strength = Number(signal.strength);

  const borderColor = isBuy
    ? "border-l-gain"
    : isSell
      ? "border-l-loss"
      : "border-l-yellow-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      data-ocid={`signals.item.${index + 1}`}
      className={`bg-card border border-border border-l-4 ${borderColor} rounded-2xl p-4 space-y-3`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">
              {signal.ticker}
            </span>
            <SignalBadge signal={signal.signal} />
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {signal.name}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-muted-foreground">Timeframe</div>
          <div className="text-xs font-semibold text-foreground mt-0.5">
            {signal.timeframe}
          </div>
        </div>
      </div>

      {/* Direction label */}
      <div
        className={`text-sm font-bold flex items-center gap-1.5 ${
          isBuy ? "text-gain" : isSell ? "text-loss" : "text-yellow-400"
        }`}
      >
        {isBuy ? (
          <>
            <TrendingUp className="w-4 h-4" /> ऊपर जाएगा — Strong Buy Signal
          </>
        ) : isSell ? (
          <>
            <TrendingDown className="w-4 h-4" /> नीचे जाएगा — Strong Sell Signal
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" /> Wait करें — Hold Position
          </>
        )}
      </div>

      {/* Price levels */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-background rounded-xl p-2.5 text-center">
          <div className="text-[10px] text-muted-foreground">Entry</div>
          <div className="text-sm font-bold text-foreground mt-0.5">
            {formatPrice(signal.entry)}
          </div>
        </div>
        <div className="bg-background rounded-xl p-2.5 text-center">
          <div className="text-[10px] text-muted-foreground">Target</div>
          <div className="text-sm font-bold text-gain mt-0.5">
            {formatPrice(signal.target)}
          </div>
        </div>
        <div className="bg-background rounded-xl p-2.5 text-center">
          <div className="text-[10px] text-muted-foreground">Stop Loss</div>
          <div className="text-sm font-bold text-loss mt-0.5">
            {formatPrice(signal.stoploss)}
          </div>
        </div>
      </div>

      {/* Signal strength */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Signal Strength</span>
          <span className="text-xs font-bold text-foreground">{strength}%</span>
        </div>
        <Progress
          value={strength}
          className="h-1.5"
          style={
            {
              "--progress-color": isBuy
                ? "var(--gain)"
                : isSell
                  ? "var(--loss)"
                  : "#eab308",
            } as React.CSSProperties
          }
        />
      </div>

      {/* Reason */}
      <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-2">
        <span className="text-foreground font-medium">Analysis: </span>
        {signal.reason}
      </p>
    </motion.div>
  );
}

function SignalSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-48" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function StockSignalsPage() {
  const { actor, isFetching } = useActor();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [countdown, setCountdown] = useState(60);

  const {
    data: signals = [],
    isLoading,
    refetch,
  } = useQuery<StockSignal[]>({
    queryKey: ["stockSignals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStockSignals();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });

  // Countdown to next refresh - resets every 60s independently
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 60;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filtered =
    filter === "ALL"
      ? signals
      : signals.filter((s) => s.signal.toUpperCase() === filter);

  const buyCount = signals.filter(
    (s) => s.signal.toUpperCase() === "BUY",
  ).length;
  const sellCount = signals.filter(
    (s) => s.signal.toUpperCase() === "SELL",
  ).length;
  const holdCount = signals.filter(
    (s) => s.signal.toUpperCase() === "HOLD",
  ).length;

  const FILTERS: {
    label: string;
    value: Filter;
    count: number;
    color: string;
  }[] = [
    { label: "All", value: "ALL", count: signals.length, color: "" },
    { label: "BUY", value: "BUY", count: buyCount, color: "text-gain" },
    { label: "SELL", value: "SELL", count: sellCount, color: "text-loss" },
    {
      label: "HOLD",
      value: "HOLD",
      count: holdCount,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-1" data-ocid="signals.section">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Stock Signals & Tips
              </h1>
              <p className="text-xs text-muted-foreground">
                आज के सबसे सटीक BUY/SELL संकेत
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {countdown}s में refresh
            </span>
            <button
              type="button"
              onClick={() => refetch()}
              data-ocid="signals.refresh.button"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Summary chips */}
        {!isLoading && signals.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-1">
            <span className="text-xs font-medium bg-gain/15 text-gain px-3 py-1 rounded-full">
              {buyCount} BUY
            </span>
            <span className="text-xs font-medium bg-loss/15 text-loss px-3 py-1 rounded-full">
              {sellCount} SELL
            </span>
            <span className="text-xs font-medium bg-yellow-500/15 text-yellow-400 px-3 py-1 rounded-full">
              {holdCount} HOLD
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div
        className="flex gap-1 bg-card border border-border rounded-xl p-1"
        data-ocid="signals.filter.tab"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-all ${
              filter === f.value
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
            {f.count > 0 && (
              <span
                className={`ml-1 ${filter === f.value ? "text-white/80" : f.color}`}
              >
                ({f.count})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Signals list */}
      {isLoading ? (
        <div className="space-y-4" data-ocid="signals.loading_state">
          {[1, 2, 3, 4].map((i) => (
            <SignalSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="signals.empty_state"
          className="text-center py-16 space-y-3"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 text-primary/50" />
          </div>
          <p className="text-foreground font-semibold">कोई signal नहीं मिला</p>
          <p className="text-muted-foreground text-sm">
            फ़िल्टर बदलें या थोड़ी देर बाद try करें
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4" data-ocid="signals.list">
            {filtered.map((signal, i) => (
              <SignalCard key={signal.ticker} signal={signal} index={i} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Disclaimer */}
      <div className="bg-card border border-border/50 rounded-xl p-3 text-center">
        <p className="text-[11px] text-muted-foreground">
          ⚠️ ये signals educational purpose के लिए हैं। Investment अपने विवेक से करें।
          Past performance future returns की guarantee नहीं है।
        </p>
      </div>
    </div>
  );
}
