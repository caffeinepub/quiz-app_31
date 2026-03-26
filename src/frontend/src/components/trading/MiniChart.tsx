import type { Candle } from "@/hooks/useLiveMarket";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface MiniChartProps {
  candles: Candle[];
  positive?: boolean;
  height?: number;
}

export default function MiniChart({
  candles,
  positive = true,
  height = 40,
}: MiniChartProps) {
  const data = candles.slice(-20).map((c) => ({ v: c.close }));
  const color = positive ? "oklch(0.72 0.18 148)" : "oklch(0.58 0.22 25)";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`mg-${positive}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#mg-${positive})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
