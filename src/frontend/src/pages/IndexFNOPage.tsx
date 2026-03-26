import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MarketIndex, OptionRow } from "@/hooks/useLiveMarket";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

function fmtOI(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  return n.toLocaleString("en-IN");
}

interface Props {
  indices: MarketIndex[];
  optionChain: OptionRow[];
}

export default function IndexFNOPage({ indices, optionChain }: Props) {
  const indexCards = indices.slice(0, 3).filter(Boolean);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Index FNO Analysis
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daily updates for Nifty 50, Bank Nifty & Fin Nifty Options
          </p>
        </div>

        {/* Index analysis cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {indexCards.map((idx) => (
            <div
              key={idx.symbol}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-foreground">
                  {idx.name}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    idx.change >= 0
                      ? "border-success/40 text-success"
                      : "border-destructive/40 text-destructive"
                  }`}
                >
                  {idx.change >= 0 ? "Bullish" : "Bearish"}
                </Badge>
              </div>
              <p className="text-2xl font-mono font-bold text-foreground">
                {fmt(idx.price)}
              </p>
              <p
                className={`text-sm font-mono font-semibold mt-0.5 ${
                  idx.change >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {idx.change >= 0 ? "+" : ""}
                {fmt(idx.change)} ({fmt(idx.changePct)}%)
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground">52W High</p>
                  <p className="text-xs font-mono font-semibold text-foreground">
                    {fmt(idx.high * 1.02)}
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground">52W Low</p>
                  <p className="text-xs font-mono font-semibold text-foreground">
                    {fmt(idx.low * 0.92)}
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground">PCR Ratio</p>
                  <p className="text-xs font-mono font-semibold text-primary">
                    {idx.change >= 0 ? "1.24" : "0.84"}
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground">Max Pain</p>
                  <p className="text-xs font-mono font-semibold text-warning">
                    {fmt(Math.round(idx.price / 50) * 50)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FNO stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Total Call OI",
              value: "1.24Cr",
              color: "text-destructive",
            },
            { label: "Total Put OI", value: "1.54Cr", color: "text-success" },
            { label: "PCR (OI)", value: "1.24", color: "text-primary" },
            { label: "IV (ATM)", value: "14.8%", color: "text-warning" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-3"
            >
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              <p className={`text-lg font-mono font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Option chain */}
        <div
          className="bg-card border border-border rounded-xl p-4"
          data-ocid="indexfno.table"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Option Chain — NIFTY 50
            </h2>
            <Badge
              variant="outline"
              className="text-xs text-primary border-primary/30"
            >
              Weekly Expiry
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    CE OI
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    CE Chg%
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    CE LTP
                  </th>
                  <th className="text-center py-2 text-foreground font-bold">
                    STRIKE
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    PE LTP
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    PE Chg%
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    PE OI
                  </th>
                </tr>
              </thead>
              <tbody>
                {optionChain.map((row, i) => (
                  <tr
                    key={row.strike}
                    data-ocid={`optchain.row.${i + 1}`}
                    className={`border-b border-border/30 ${
                      row.isITM ? "bg-primary/5" : "hover:bg-accent/20"
                    } transition-colors`}
                  >
                    <td className="py-2 text-right font-mono">
                      {fmtOI(row.ceOI)}
                    </td>
                    <td
                      className={`py-2 text-right font-mono ${row.cePct >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {row.cePct >= 0 ? "+" : ""}
                      {row.cePct}%
                    </td>
                    <td className="py-2 text-right font-mono text-foreground font-semibold">
                      {fmt(row.ceLTP)}
                    </td>
                    <td
                      className={`py-2 text-center font-mono font-bold ${
                        row.isITM ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {row.strike}
                    </td>
                    <td className="py-2 text-right font-mono text-foreground font-semibold">
                      {fmt(row.peLTP)}
                    </td>
                    <td
                      className={`py-2 text-right font-mono ${row.pePct >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {row.pePct >= 0 ? "+" : ""}
                      {row.pePct}%
                    </td>
                    <td className="py-2 text-right font-mono">
                      {fmtOI(row.peOI)}
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
