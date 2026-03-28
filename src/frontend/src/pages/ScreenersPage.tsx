import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import { useState } from "react";
import type { SelectedStock } from "../components/StockChartModal";
import { SCREENERS } from "../data/marketData";
import { useLiveMarket } from "../hooks/useLiveMarket";

interface ScreenersPageProps {
  onStockClick: (stock: SelectedStock) => void;
}

export function ScreenersPage({ onStockClick }: ScreenersPageProps) {
  const [activeScreener, setActiveScreener] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { stocks } = useLiveMarket();

  const screener = SCREENERS.find((s) => s.id === activeScreener);

  const screenerStocks = screener
    ? stocks.filter((s) => screener.stocks.includes(s.symbol))
    : [];

  const filteredScreenerStocks = screenerStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (activeScreener && screener) {
    return (
      <div>
        <div className="sticky top-0 z-20 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            data-ocid="screener.back_button"
            onClick={() => {
              setActiveScreener(null);
              setSearch("");
            }}
            className="p-1.5 rounded-lg hover:bg-muted"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-base text-foreground">
              {screener.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              {screener.stocks.length} stocks
            </p>
          </div>
        </div>
        <div className="px-4 pt-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="screener.search_input"
              placeholder="Search stocks..."
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
            <div className="grid grid-cols-4 px-4 py-2 bg-muted text-[11px] font-semibold text-muted-foreground">
              <span className="col-span-2">STOCK</span>
              <span className="text-right">LTP</span>
              <span className="text-right">CHNG%</span>
            </div>
            {filteredScreenerStocks.map((stock, i) => (
              <button
                type="button"
                key={stock.symbol}
                data-ocid={`screener.item.${i + 1}`}
                onClick={() =>
                  onStockClick({
                    symbol: stock.symbol,
                    name: stock.name,
                    ltp: stock.ltp,
                    changePct: stock.changePct,
                  })
                }
                className="w-full grid grid-cols-4 px-4 py-3 border-t border-border items-center hover:bg-muted/40 active:bg-muted cursor-pointer transition-colors text-left"
              >
                <div className="col-span-2">
                  <div className="text-sm font-bold text-foreground">
                    {stock.symbol}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {stock.name}
                  </div>
                </div>
                <span className="text-sm font-semibold text-right">
                  ₹
                  {stock.ltp.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`text-sm font-bold text-right ${
                    stock.changePct >= 0 ? "text-gain" : "text-loss"
                  }`}
                >
                  {stock.changePct >= 0 ? "+" : ""}
                  {stock.changePct.toFixed(2)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-20 bg-primary px-4 py-3">
        <h1 className="text-white font-bold text-lg">Screeners</h1>
        <p className="text-white/70 text-xs mt-0.5">
          Filter stocks by strategy & criteria
        </p>
      </div>
      <div className="px-4 pt-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search screeners..." className="pl-9 bg-white" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SCREENERS.map((sc, i) => (
            <button
              type="button"
              key={sc.id}
              data-ocid={`screener.item.${i + 1}`}
              onClick={() => setActiveScreener(sc.id)}
              className="bg-white rounded-xl border border-border shadow-card p-4 text-left hover:shadow-card-hover hover:border-primary/30 transition-all duration-200"
            >
              <div className="text-2xl mb-2">{sc.icon}</div>
              <div className="text-sm font-bold text-foreground">{sc.name}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {sc.stocks.length} stocks
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
