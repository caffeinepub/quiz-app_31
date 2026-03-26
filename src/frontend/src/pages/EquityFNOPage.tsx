import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EquityStock } from "@/hooks/useLiveMarket";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

interface Props {
  stocks: EquityStock[];
}

export default function EquityFNOPage({ stocks }: Props) {
  const buySignals = stocks.filter((s) => s.signal === "BUY").length;
  const sellSignals = stocks.filter((s) => s.signal === "SELL").length;
  const neutralSignals = stocks.filter((s) => s.signal === "NEUTRAL").length;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Equity FNO Analysis
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Top NSE stocks with FNO signals and OI analysis
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-success/10 border border-success/25 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground">BUY Signals</p>
            <p className="text-2xl font-bold text-success">{buySignals}</p>
          </div>
          <div className="bg-destructive/10 border border-destructive/25 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground">SELL Signals</p>
            <p className="text-2xl font-bold text-destructive">{sellSignals}</p>
          </div>
          <div className="bg-warning/10 border border-warning/25 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground">NEUTRAL</p>
            <p className="text-2xl font-bold text-warning">{neutralSignals}</p>
          </div>
        </div>

        {/* Stocks table */}
        <div
          className="bg-card border border-border rounded-xl p-4"
          data-ocid="equity.table"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">
            NSE FNO Stocks
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    Stock
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    Sector
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    LTP
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    Change
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    OI
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    Volume
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    Signal
                  </th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s, i) => (
                  <tr
                    key={s.symbol}
                    data-ocid={`equity.row.${i + 1}`}
                    className="border-b border-border/30 hover:bg-accent/20 transition-colors"
                  >
                    <td className="py-2.5">
                      <p className="font-semibold text-foreground">
                        {s.symbol}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {s.name}
                      </p>
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">
                      {s.sector}
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-foreground">
                      {fmt(s.ltp)}
                    </td>
                    <td
                      className={`py-2.5 text-right font-mono font-semibold ${
                        s.change >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {s.change >= 0 ? "+" : ""}
                      {fmt(s.changePct)}%
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">
                      {s.oi}
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">
                      {s.volume}
                    </td>
                    <td className="py-2.5 text-right">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          s.signal === "BUY"
                            ? "bg-success/10 text-success border-success/30"
                            : s.signal === "SELL"
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : "bg-warning/10 text-warning border-warning/30"
                        }`}
                      >
                        {s.signal === "BUY" ? (
                          <TrendingUp className="w-2.5 h-2.5 mr-1" />
                        ) : s.signal === "SELL" ? (
                          <TrendingDown className="w-2.5 h-2.5 mr-1" />
                        ) : (
                          <Minus className="w-2.5 h-2.5 mr-1" />
                        )}
                        {s.signal}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
