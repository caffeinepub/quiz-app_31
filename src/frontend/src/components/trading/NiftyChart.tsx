import type { Candle } from "@/hooks/useLiveMarket";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface NiftyChartProps {
  candles: Candle[];
  symbol: string;
}

export default function NiftyChart({ candles, symbol }: NiftyChartProps) {
  const data = candles
    .slice(-40)
    .map((c) => ({ time: c.time, value: c.close, high: c.high, low: c.low }));
  const min = Math.min(...data.map((d) => d.low)) * 0.9995;
  const max = Math.max(...data.map((d) => d.high)) * 1.0005;
  const last = data[data.length - 1];
  const first = data[0];
  const isPositive = (last?.value ?? 0) >= (first?.value ?? 0);
  const color = isPositive ? "oklch(0.72 0.18 148)" : "oklch(0.58 0.22 25)";

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-foreground">{symbol}</span>
          <span className="font-mono text-lg font-bold" style={{ color }}>
            {last?.value.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-3 py-1 text-xs bg-success/15 text-success rounded-md font-semibold hover:bg-success/25 transition-colors"
          >
            BUY
          </button>
          <button
            type="button"
            className="px-3 py-1 text-xs bg-destructive/15 text-destructive rounded-md font-semibold hover:bg-destructive/25 transition-colors"
          >
            SELL
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="oklch(0.24 0.038 240)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "oklch(0.65 0.025 240)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={7}
          />
          <YAxis
            domain={[min, max]}
            tick={{ fill: "oklch(0.65 0.025 240)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.toLocaleString("en-IN")}
            width={60}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.15 0.026 240)",
              border: "1px solid oklch(0.24 0.038 240)",
              borderRadius: "8px",
              fontSize: "11px",
              color: "oklch(0.94 0.012 240)",
            }}
            formatter={(value: number) => [
              value.toLocaleString("en-IN"),
              "Price",
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#chartGrad)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
