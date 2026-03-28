import { Badge } from "@/components/ui/badge";
import { ChevronLeft, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

export interface SelectedStock {
  symbol: string;
  name?: string;
  ltp: number;
  changePct: number;
}

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function symbolSeed(symbol: string): number {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) {
    h = (h * 31 + symbol.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h);
}

function generateCandles(symbol: string, base: number, count = 30): Candle[] {
  const rand = seededRandom(symbolSeed(symbol));
  const candles: Candle[] = [];
  let price = base;
  for (let idx = 0; idx < count; idx++) {
    const change = (rand() - 0.48) * base * 0.025;
    const open = price;
    const close = price + change;
    const wick = rand() * base * 0.015;
    const high = Math.max(open, close) + wick;
    const low = Math.min(open, close) - wick * rand();
    const volume = 50000 + rand() * 200000;
    candles.push({ open, high, low, close, volume });
    price = close;
  }
  return candles;
}

function calcEMA(closes: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const result: number[] = [];
  let ema = closes[0];
  for (let i = 0; i < closes.length; i++) {
    ema = i === 0 ? closes[0] : closes[i] * k + ema * (1 - k);
    result.push(ema);
  }
  return result;
}

function calcRSI(closes: number[], period = 14): number[] {
  const rsiArr: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < period) {
      rsiArr.push(50);
      continue;
    }
    let gains = 0;
    let losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = closes[j] - closes[j - 1];
      if (diff > 0) gains += diff;
      else losses -= diff;
    }
    const rs = losses === 0 ? 100 : gains / losses;
    rsiArr.push(100 - 100 / (1 + rs));
  }
  return rsiArr;
}

const PATTERNS = [
  "Bullish Flag",
  "Head & Shoulders",
  "Double Bottom",
  "Cup & Handle",
  "Breakout Candle",
  "Hammer",
  "Doji Reversal",
  "Engulfing Bullish",
  "Triangle Breakout",
  "Rising Wedge",
];

function detectPattern(symbol: string): string[] {
  const seed = symbolSeed(symbol);
  const i1 = seed % PATTERNS.length;
  const i2 = (seed * 7 + 3) % PATTERNS.length;
  return i1 === i2 ? [PATTERNS[i1]] : [PATTERNS[i1], PATTERNS[i2]];
}

type Timeframe = "1D" | "1W" | "1M" | "3M";
const TIMEFRAMES: Timeframe[] = ["1D", "1W", "1M", "3M"];
const TF_CANDLES: Record<Timeframe, number> = {
  "1D": 20,
  "1W": 25,
  "1M": 30,
  "3M": 45,
};

interface ChartSVGProps {
  candles: Candle[];
  ema10: number[];
  ema20: number[];
  rsiArr: number[];
}

function ChartSVG({ candles, ema10, ema20, rsiArr }: ChartSVGProps) {
  const W = 320;
  const chartH = 150;
  const volH = 30;
  const rsiH = 50;
  const rsiGap = 8;
  const H = chartH + volH + rsiH + rsiGap;
  const padL = 28;
  const padR = 4;
  const padT = 8;

  const prices = candles.flatMap((c) => [c.high, c.low]);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const maxVol = Math.max(...candles.map((c) => c.volume));

  const candleW = (W - padL - padR) / candles.length;
  const gap = candleW * 0.2;
  const bodyW = Math.max(1, candleW - gap);

  const toY = (p: number) =>
    padT + chartH - padT - ((p - minP) / (maxP - minP || 1)) * (chartH - padT);
  const toVolY = (v: number) => chartH + volH - (v / maxVol) * (volH - 2);

  const rsiTop = chartH + volH + rsiGap;
  const toRsiY = (v: number) => rsiTop + rsiH - (v / 100) * rsiH;

  // Build EMA polyline points
  const emaPoints = (arr: number[]) =>
    arr
      .map((v, i) => {
        const x = padL + i * candleW + candleW / 2;
        return `${x},${toY(v)}`;
      })
      .join(" ");

  // RSI polyline
  const rsiPoints = rsiArr
    .map((v, i) => {
      const x = padL + i * candleW + candleW / 2;
      return `${x},${toRsiY(v)}`;
    })
    .join(" ");

  const lastRsi = rsiArr[rsiArr.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: H }}
      role="img"
      aria-label="TradingView-style chart"
    >
      {/* Candles & Volume */}
      {candles.map((c, idx) => {
        const x = padL + idx * candleW + gap / 2;
        const cx = x + bodyW / 2;
        const isGreen = c.close >= c.open;
        const color = isGreen ? "#22c55e" : "#ef4444";
        const bodyTop = Math.min(toY(c.open), toY(c.close));
        const bodyH = Math.max(2, Math.abs(toY(c.open) - toY(c.close)));
        const vy = toVolY(c.volume);
        return (
          <g key={`c-${c.open.toFixed(4)}-${c.close.toFixed(4)}-${idx}`}>
            <line
              x1={cx}
              y1={toY(c.high)}
              x2={cx}
              y2={toY(c.low)}
              stroke={color}
              strokeWidth="0.8"
            />
            <rect
              x={x}
              y={bodyTop}
              width={bodyW}
              height={bodyH}
              fill={color}
              rx="0.5"
            />
            <rect
              x={x}
              y={vy}
              width={bodyW}
              height={chartH + volH - vy}
              fill={isGreen ? "#bbf7d0" : "#fecaca"}
              rx="0.5"
              opacity="0.7"
            />
          </g>
        );
      })}

      {/* 10 EMA line */}
      {ema10.length > 1 && (
        <polyline
          points={emaPoints(ema10)}
          fill="none"
          stroke="#f97316"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}

      {/* 20 EMA line */}
      {ema20.length > 1 && (
        <polyline
          points={emaPoints(ema20)}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}

      {/* RSI Pane divider */}
      <line
        x1={padL}
        y1={rsiTop}
        x2={W - padR}
        y2={rsiTop}
        stroke="#e2e8f0"
        strokeWidth="0.5"
      />

      {/* RSI 70 line */}
      <line
        x1={padL}
        y1={toRsiY(70)}
        x2={W - padR}
        y2={toRsiY(70)}
        stroke="#ef4444"
        strokeWidth="0.6"
        strokeDasharray="3,2"
        opacity="0.7"
      />
      {/* RSI 30 line */}
      <line
        x1={padL}
        y1={toRsiY(30)}
        x2={W - padR}
        y2={toRsiY(30)}
        stroke="#22c55e"
        strokeWidth="0.6"
        strokeDasharray="3,2"
        opacity="0.7"
      />

      {/* RSI polyline */}
      {rsiPoints && (
        <polyline
          points={rsiPoints}
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}

      {/* RSI label */}
      <text x={2} y={rsiTop + 8} fontSize="7" fill="#a855f7" fontWeight="600">
        RSI
      </text>
      <text x={2} y={rsiTop + 18} fontSize="7" fill="#64748b">
        {lastRsi.toFixed(0)}
      </text>

      {/* 70/30 labels */}
      <text x={2} y={toRsiY(70) + 3} fontSize="6" fill="#ef4444">
        70
      </text>
      <text x={2} y={toRsiY(30) + 3} fontSize="6" fill="#22c55e">
        30
      </text>
    </svg>
  );
}

interface StockChartModalProps {
  stock: SelectedStock;
  onBack: () => void;
}

export function StockChartModal({ stock, onBack }: StockChartModalProps) {
  const [tf, setTf] = useState<Timeframe>("1D");

  const candles = useMemo(
    () => generateCandles(stock.symbol + tf, stock.ltp, TF_CANDLES[tf]),
    [stock.symbol, stock.ltp, tf],
  );

  const closes = useMemo(() => candles.map((c) => c.close), [candles]);
  const ema10 = useMemo(() => calcEMA(closes, 10), [closes]);
  const ema20 = useMemo(() => calcEMA(closes, 20), [closes]);
  const rsiArr = useMemo(() => calcRSI(closes, 14), [closes]);

  const patterns = useMemo(() => detectPattern(stock.symbol), [stock.symbol]);

  const seed = symbolSeed(stock.symbol);
  const macdBullish = seed % 2 === 0;

  const lastRsi = rsiArr[rsiArr.length - 1];
  const lastEma10 = ema10[ema10.length - 1];
  const lastEma20 = ema20[ema20.length - 1];

  const signalSeed = seed % 3;
  const signal =
    signalSeed === 0 ? "BUY" : signalSeed === 1 ? "SELL" : "NEUTRAL";
  const entry = stock.ltp;
  const sl = signal === "BUY" ? entry * 0.975 : entry * 1.025;
  const target = signal === "BUY" ? entry * 1.045 : entry * 0.955;

  return (
    <motion.div
      data-ocid="stock_chart.modal"
      className="fixed inset-0 z-50 bg-white flex flex-col max-w-md mx-auto"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="stock_chart.close_button"
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-muted"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-foreground">
              {stock.symbol}
            </span>
            {stock.name && (
              <span className="text-xs text-muted-foreground">
                {stock.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">
              ₹{stock.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span
              className={`text-xs font-semibold flex items-center gap-0.5 ${
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
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Timeframe Tabs */}
        <div className="flex gap-2">
          {TIMEFRAMES.map((t) => (
            <button
              type="button"
              key={t}
              data-ocid={`stock_chart.${t.toLowerCase()}.tab`}
              onClick={() => setTf(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                tf === t
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-border shadow-card p-3">
          {/* TradingView-style indicator chips */}
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
              <span className="text-[10px] font-semibold text-orange-700">
                10 EMA
              </span>
              <span className="text-[9px] text-orange-500 font-mono">
                {lastEma10.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              <span className="text-[10px] font-semibold text-blue-700">
                20 EMA
              </span>
              <span className="text-[9px] text-blue-500 font-mono">
                {lastEma20.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-muted border border-border rounded-full px-2 py-0.5 shrink-0">
              <span className="text-[10px] font-semibold text-muted-foreground">
                VOL
              </span>
            </div>
            <div className="flex items-center gap-1 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
              <span className="text-[10px] font-semibold text-purple-700">
                RSI
              </span>
              <span className="text-[9px] text-purple-500 font-mono">
                {lastRsi.toFixed(0)}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-muted border border-border rounded-full px-2 py-0.5 shrink-0">
              <span className="text-[10px] font-semibold text-muted-foreground">
                MACD
              </span>
            </div>
            <div className="flex items-center gap-1 bg-muted border border-border rounded-full px-2 py-0.5 shrink-0">
              <span className="text-[10px] font-semibold text-muted-foreground">
                BB
              </span>
            </div>
          </div>

          <ChartSVG
            candles={candles}
            ema10={ema10}
            ema20={ema20}
            rsiArr={rsiArr}
          />
        </div>

        {/* Chart Patterns */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-2">
            Chart Patterns
          </h3>
          <div className="flex flex-wrap gap-2">
            {patterns.map((p) => (
              <Badge
                key={p}
                className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs font-semibold"
              >
                {p}
              </Badge>
            ))}
          </div>
        </div>

        {/* Technical Indicators */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-2">
            Technical Indicators
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-xl border border-border shadow-card p-3 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">
                RSI (14)
              </div>
              <div
                className={`text-base font-black ${
                  lastRsi < 40
                    ? "text-loss"
                    : lastRsi > 60
                      ? "text-gain"
                      : "text-yellow-600"
                }`}
              >
                {lastRsi.toFixed(1)}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {lastRsi < 40
                  ? "Oversold"
                  : lastRsi > 60
                    ? "Overbought"
                    : "Neutral"}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border shadow-card p-3 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">MACD</div>
              <div
                className={`text-sm font-black ${
                  macdBullish ? "text-gain" : "text-loss"
                }`}
              >
                {macdBullish ? "Bullish" : "Bearish"}
              </div>
              <div className="text-[10px] text-muted-foreground">Signal</div>
            </div>
            <div className="bg-white rounded-xl border border-border shadow-card p-3 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">
                10 EMA
              </div>
              <div className="text-sm font-black text-orange-500">
                {lastEma10.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {stock.ltp > lastEma10 ? "Above" : "Below"}
              </div>
            </div>
          </div>
        </div>

        {/* Signal Summary */}
        <div className="bg-white rounded-xl border border-border shadow-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">
              Signal Summary
            </h3>
            <Badge
              className={`text-sm font-bold px-3 py-1 ${
                signal === "BUY"
                  ? "bg-green-500 text-white hover:bg-green-500"
                  : signal === "SELL"
                    ? "bg-red-500 text-white hover:bg-red-500"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
              }`}
            >
              {signal}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-muted-foreground">Entry</div>
              <div className="text-sm font-bold text-foreground">
                ₹{entry.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">Stop Loss</div>
              <div className="text-sm font-bold text-loss">
                ₹{sl.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">Target</div>
              <div className="text-sm font-bold text-gain">
                ₹{target.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
