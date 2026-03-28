import { TrendingDown, TrendingUp, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { SelectedStock } from "../App";

type Timeframe = "1D" | "1W" | "1M" | "3M";

function generateOHLC(basePrice: number, count: number) {
  const candles: {
    open: number;
    high: number;
    low: number;
    close: number;
    vol: number;
    idx: number;
  }[] = [];
  let price = basePrice * 0.92;
  for (let i = 0; i < count; i++) {
    const open = price;
    const change = (Math.random() - 0.48) * price * 0.012;
    const close = Number.parseFloat((open + change).toFixed(2));
    const high = Number.parseFloat(
      (Math.max(open, close) + Math.random() * price * 0.005).toFixed(2),
    );
    const low = Number.parseFloat(
      (Math.min(open, close) - Math.random() * price * 0.004).toFixed(2),
    );
    const vol = Math.floor(Math.random() * 800000 + 200000);
    candles.push({ open, high, low, close, vol, idx: i });
    price = close;
  }
  return candles;
}

function CandlestickChart({
  price,
  timeframe,
}: { price: number; timeframe: Timeframe }) {
  const counts: Record<Timeframe, number> = {
    "1D": 30,
    "1W": 40,
    "1M": 50,
    "3M": 60,
  };
  const candles = generateOHLC(price, counts[timeframe]);
  const W = 500;
  const H = 160;
  const padL = 8;
  const padR = 8;
  const padT = 8;
  const padB = 8;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const maxP = Math.max(...allPrices);
  const minP = Math.min(...allPrices);
  const range = maxP - minP || 1;
  const py = (v: number) => padT + ((maxP - v) / range) * chartH;
  const cw = chartW / candles.length;
  const bodyW = Math.max(cw * 0.5, 2);
  const maxVol = Math.max(...candles.map((c) => c.vol));
  const volH = 30;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H + volH + 8}`}
      className="w-full"
      role="img"
      aria-label="Candlestick price chart"
    >
      {candles.map((c) => {
        const up = c.close >= c.open;
        const x = padL + c.idx * cw + cw / 2;
        const bodyTop = py(Math.max(c.open, c.close));
        const bodyBot = py(Math.min(c.open, c.close));
        const bodyH = Math.max(bodyBot - bodyTop, 1);
        return (
          <g key={`c-${timeframe}-${c.idx}`}>
            <line
              x1={x}
              y1={py(c.high)}
              x2={x}
              y2={py(c.low)}
              stroke={up ? "hsl(142,71%,50%)" : "hsl(0,84%,65%)"}
              strokeWidth="1"
            />
            <rect
              x={x - bodyW / 2}
              y={bodyTop}
              width={bodyW}
              height={bodyH}
              fill={up ? "hsl(142,71%,50%)" : "hsl(0,84%,65%)"}
            />
          </g>
        );
      })}
      {candles.map((c) => {
        const up = c.close >= c.open;
        const x = padL + c.idx * cw;
        const barH = (c.vol / maxVol) * volH;
        return (
          <rect
            key={`v-${timeframe}-${c.idx}`}
            x={x}
            y={H + 8 + volH - barH}
            width={Math.max(cw - 1, 1)}
            height={barH}
            fill={up ? "hsl(142,71%,30%)" : "hsl(0,84%,30%)"}
            opacity="0.8"
          />
        );
      })}
    </svg>
  );
}

function RSIChart({ timeframe }: { timeframe: Timeframe }) {
  const counts: Record<Timeframe, number> = {
    "1D": 30,
    "1W": 40,
    "1M": 50,
    "3M": 60,
  };
  const n = counts[timeframe];
  const data = Array.from({ length: n }, (_, i) => {
    const base = 55 + 20 * Math.sin(i * 0.3);
    return Math.max(20, Math.min(80, base + (Math.random() - 0.5) * 10));
  });
  const W = 500;
  const H = 60;
  const pts = data
    .map((v, i) => `${(i / (n - 1)) * W},${H - ((v - 20) / 60) * H}`)
    .join(" ");
  const lastRsi = data[data.length - 1];
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase">
          RSI (14)
        </span>
        <span
          className={`text-[10px] font-bold ${lastRsi > 70 ? "text-loss" : lastRsi < 30 ? "text-gain" : "text-foreground"}`}
        >
          {lastRsi.toFixed(1)}
        </span>
      </div>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="RSI indicator chart"
      >
        <line
          x1={0}
          y1={H - (40 / 60) * H}
          x2={W}
          y2={H - (40 / 60) * H}
          stroke="hsl(0,84%,60%)"
          strokeWidth="0.5"
          strokeDasharray="4 3"
          opacity="0.5"
        />
        <line
          x1={0}
          y1={H - (10 / 60) * H}
          x2={W}
          y2={H - (10 / 60) * H}
          stroke="hsl(142,71%,50%)"
          strokeWidth="0.5"
          strokeDasharray="4 3"
          opacity="0.5"
        />
        <polyline
          points={pts}
          fill="none"
          stroke="hsl(280,60%,65%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function BuzzStockChartModal({
  stock,
  onClose,
}: { stock: SelectedStock; onClose: () => void }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1D");
  const up = stock.changePct >= 0;
  const signal =
    stock.changePct > 1 ? "BUY" : stock.changePct < -0.5 ? "SELL" : "HOLD";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-[560px] bg-card border border-border rounded-2xl overflow-hidden"
        data-ocid="stock.modal"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {stock.ticker}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  signal === "BUY"
                    ? "bg-gain text-gain"
                    : signal === "SELL"
                      ? "bg-loss text-loss"
                      : "bg-primary/20 text-primary"
                }`}
              >
                {signal}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {stock.name}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">
                ₹
                {stock.price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div
                className={`text-xs font-semibold flex items-center gap-1 justify-end ${up ? "text-gain" : "text-loss"}`}
              >
                {up ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {up ? "+" : ""}
                {stock.changePct.toFixed(2)}%
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-ocid="stock.close_button"
              className="w-8 h-8 rounded-full bg-secondary hover:bg-border transition flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-1 p-3 border-b border-border">
          {(["1D", "1W", "1M", "3M"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              data-ocid={`stock.${tf.toLowerCase()}.tab`}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                timeframe === tf
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {tf}
            </button>
          ))}
          <div className="flex gap-1 ml-auto">
            {["10 EMA", "20 EMA", "VOL", "RSI"].map((ind) => (
              <span
                key={ind}
                className="px-2 py-1 rounded-lg text-[10px] font-medium bg-primary/10 text-primary"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <CandlestickChart price={stock.price} timeframe={timeframe} />
          <RSIChart timeframe={timeframe} />
        </div>

        <div className="px-4 pb-4 flex items-center gap-3 text-xs">
          <div className="flex-1 bg-secondary rounded-xl p-3 text-center">
            <div className="text-muted-foreground">Entry</div>
            <div className="font-semibold text-foreground mt-0.5">
              ₹{(stock.price * 0.99).toFixed(2)}
            </div>
          </div>
          <div className="flex-1 bg-loss rounded-xl p-3 text-center">
            <div className="text-muted-foreground">Stop Loss</div>
            <div className="font-semibold text-loss mt-0.5">
              ₹{(stock.price * 0.96).toFixed(2)}
            </div>
          </div>
          <div className="flex-1 bg-gain rounded-xl p-3 text-center">
            <div className="text-muted-foreground">Target</div>
            <div className="font-semibold text-gain mt-0.5">
              ₹{(stock.price * 1.05).toFixed(2)}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
