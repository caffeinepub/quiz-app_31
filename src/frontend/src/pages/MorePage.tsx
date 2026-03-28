import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { IPOS, MARKET_NEWS } from "../data/marketData";

type Section =
  | null
  | "ipo"
  | "news"
  | "portfolio"
  | "calculator"
  | "holidays"
  | "about";

const MORE_ITEMS = [
  { id: "ipo", icon: "🏢", label: "IPO", desc: "Upcoming & recent IPOs" },
  {
    id: "news",
    icon: "📰",
    label: "Market News",
    desc: "Latest financial news",
  },
  {
    id: "portfolio",
    icon: "💼",
    label: "My Portfolio",
    desc: "Track your investments",
  },
  {
    id: "calculator",
    icon: "🔢",
    label: "Calculators",
    desc: "SIP & position size",
  },
  {
    id: "holidays",
    icon: "📅",
    label: "Market Holidays",
    desc: "NSE/BSE holiday list",
  },
  { id: "about", icon: "ℹ️", label: "About", desc: "StockWise app info" },
];

const HOLIDAYS = [
  { date: "26 Jan 2025", day: "Sunday", occasion: "Republic Day" },
  { date: "26 Feb 2025", day: "Wednesday", occasion: "Mahashivratri" },
  { date: "31 Mar 2025", day: "Monday", occasion: "Id-Ul-Fitr (Ramzan)" },
  { date: "10 Apr 2025", day: "Thursday", occasion: "Shri Ram Navami" },
  {
    date: "14 Apr 2025",
    day: "Monday",
    occasion: "Dr. Baba Saheb Ambedkar Jayanti / Good Friday",
  },
  { date: "01 May 2025", day: "Thursday", occasion: "Maharashtra Day" },
  { date: "15 Aug 2025", day: "Friday", occasion: "Independence Day" },
  { date: "02 Oct 2025", day: "Thursday", occasion: "Mahatma Gandhi Jayanti" },
  { date: "02 Nov 2025", day: "Sunday", occasion: "Diwali Laxmi Pujan" },
  { date: "05 Nov 2025", day: "Wednesday", occasion: "Diwali-Balipratipada" },
  { date: "25 Dec 2025", day: "Thursday", occasion: "Christmas" },
];

interface PortfolioStock {
  id: string;
  symbol: string;
  buyPrice: number;
  qty: number;
  currentPrice: number;
}

const DEFAULT_PORTFOLIO: PortfolioStock[] = [
  {
    id: "1",
    symbol: "RELIANCE",
    buyPrice: 2650,
    qty: 10,
    currentPrice: 2847.6,
  },
  { id: "2", symbol: "TCS", buyPrice: 3600, qty: 5, currentPrice: 3912.35 },
  {
    id: "3",
    symbol: "HDFCBANK",
    buyPrice: 1590,
    qty: 20,
    currentPrice: 1678.9,
  },
];

export function MorePage() {
  const [section, setSection] = useState<Section>(null);
  const [newsCategory, setNewsCategory] = useState("All");
  const [portfolio, setPortfolio] =
    useState<PortfolioStock[]>(DEFAULT_PORTFOLIO);
  const [newStock, setNewStock] = useState({
    symbol: "",
    buyPrice: "",
    qty: "",
  });
  const [sipAmt, setSipAmt] = useState("10000");
  const [sipYears, setSipYears] = useState("10");
  const [sipReturn, setSipReturn] = useState("12");

  const NEWS_CATS = ["All", "Market", "Economy", "Stocks", "FNO", "Global"];

  function addStock() {
    if (!newStock.symbol || !newStock.buyPrice || !newStock.qty) return;
    const ltp =
      Math.round(
        Number(newStock.buyPrice) * (1 + (Math.random() * 0.1 - 0.02)) * 100,
      ) / 100;
    setPortfolio((p) => [
      ...p,
      {
        id: Date.now().toString(),
        symbol: newStock.symbol.toUpperCase(),
        buyPrice: Number(newStock.buyPrice),
        qty: Number(newStock.qty),
        currentPrice: ltp,
      },
    ]);
    setNewStock({ symbol: "", buyPrice: "", qty: "" });
  }

  function sipCalc() {
    const P = Number(sipAmt);
    const r = Number(sipReturn) / 100 / 12;
    const n = Number(sipYears) * 12;
    return Math.round(P * (((1 + r) ** n - 1) / r) * (1 + r));
  }

  if (section) {
    const title = MORE_ITEMS.find((m) => m.id === section)?.label ?? "";
    return (
      <div>
        <div className="sticky top-0 z-20 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            data-ocid="more.back_button"
            onClick={() => setSection(null)}
            className="p-1.5 rounded-lg hover:bg-muted"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-base text-foreground">{title}</h1>
        </div>

        {section === "ipo" && (
          <div className="px-4 pt-4 space-y-3 pb-6">
            {IPOS.map((ipo, i) => (
              <div
                key={ipo.company}
                data-ocid={`ipo.item.${i + 1}`}
                className="bg-white rounded-xl border border-border shadow-card p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-sm text-foreground">
                      {ipo.company}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Price Band:{" "}
                      <span className="font-semibold text-foreground">
                        {ipo.priceband}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={`text-[10px] font-bold ml-2 ${
                      ipo.status === "Listed"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : ipo.status === "Closed"
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    {ipo.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <span className="text-muted-foreground">
                    Open:{" "}
                    <span className="font-medium text-foreground">
                      {ipo.open}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    Close:{" "}
                    <span className="font-medium text-foreground">
                      {ipo.close}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    GMP:{" "}
                    <span className="font-semibold text-gain">{ipo.gmp}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Subscr.:{" "}
                    <span className="font-semibold text-foreground">
                      {ipo.subscription}
                    </span>
                  </span>
                  {ipo.listedAt && (
                    <span className="text-muted-foreground col-span-2">
                      Listed At:{" "}
                      <span className="font-semibold text-gain">
                        {ipo.listedAt}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {section === "news" && (
          <div className="px-4 pt-4 pb-6">
            <div className="flex gap-2 overflow-x-auto pb-3">
              {NEWS_CATS.map((c) => (
                <button
                  type="button"
                  key={c}
                  data-ocid={`news.${c.toLowerCase()}.tab`}
                  onClick={() => setNewsCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    newsCategory === c
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="space-y-2.5">
              {MARKET_NEWS.filter(
                (n) => newsCategory === "All" || n.category === newsCategory,
              ).map((news, i) => (
                <div
                  key={news.id}
                  data-ocid={`news.item.${i + 1}`}
                  className="bg-white rounded-xl border border-border shadow-card p-3.5"
                >
                  <div className="flex items-start gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] mt-0.5 shrink-0"
                    >
                      {news.category}
                    </Badge>
                    <p className="text-sm font-medium text-foreground leading-snug">
                      {news.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                    <span>{news.source}</span>
                    <span>·</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "portfolio" && (
          <div className="px-4 pt-4 pb-6">
            <div className="bg-white rounded-xl border border-border shadow-card p-4 mb-4">
              <h2 className="font-bold text-sm mb-3">Add Stock</h2>
              <div className="space-y-2">
                <Input
                  data-ocid="portfolio.symbol.input"
                  placeholder="Symbol (e.g. RELIANCE)"
                  value={newStock.symbol}
                  onChange={(e) =>
                    setNewStock((p) => ({ ...p, symbol: e.target.value }))
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    data-ocid="portfolio.price.input"
                    type="number"
                    placeholder="Buy Price"
                    value={newStock.buyPrice}
                    onChange={(e) =>
                      setNewStock((p) => ({ ...p, buyPrice: e.target.value }))
                    }
                  />
                  <Input
                    data-ocid="portfolio.qty.input"
                    type="number"
                    placeholder="Quantity"
                    value={newStock.qty}
                    onChange={(e) =>
                      setNewStock((p) => ({ ...p, qty: e.target.value }))
                    }
                  />
                </div>
                <Button
                  data-ocid="portfolio.add_button"
                  className="w-full"
                  onClick={addStock}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Stock
                </Button>
              </div>
            </div>
            <div className="space-y-2.5">
              {portfolio.map((s, i) => {
                const invested = s.buyPrice * s.qty;
                const current = s.currentPrice * s.qty;
                const pnl = current - invested;
                const pnlPct = (pnl / invested) * 100;
                return (
                  <div
                    key={s.id}
                    data-ocid={`portfolio.item.${i + 1}`}
                    className="bg-white rounded-xl border border-border shadow-card p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base">{s.symbol}</span>
                      <button
                        type="button"
                        data-ocid={`portfolio.delete_button.${i + 1}`}
                        onClick={() =>
                          setPortfolio((p) => p.filter((ps) => ps.id !== s.id))
                        }
                        className="p-1 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                      <div>
                        <div className="text-[10px] text-muted-foreground">
                          Qty
                        </div>
                        <div className="font-semibold">{s.qty}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">
                          Avg
                        </div>
                        <div className="font-semibold">
                          ₹{s.buyPrice.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">
                          LTP
                        </div>
                        <div className="font-semibold">
                          ₹
                          {s.currentPrice.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">P&L</span>
                      <span
                        className={`font-bold text-sm ${pnl >= 0 ? "text-gain" : "text-loss"}`}
                      >
                        {pnl >= 0 ? "+" : ""}₹
                        {Math.abs(pnl).toLocaleString("en-IN", {
                          minimumFractionDigits: 0,
                        })}{" "}
                        ({pnlPct >= 0 ? "+" : ""}
                        {pnlPct.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {section === "calculator" && (
          <div className="px-4 pt-4 pb-6 space-y-4">
            <div className="bg-white rounded-xl border border-border shadow-card p-4">
              <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> SIP Calculator
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Monthly Amount (₹)
                  </p>
                  <Input
                    data-ocid="calculator.sip_amount.input"
                    type="number"
                    value={sipAmt}
                    onChange={(e) => setSipAmt(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Duration (Years)
                  </p>
                  <Input
                    data-ocid="calculator.sip_years.input"
                    type="number"
                    value={sipYears}
                    onChange={(e) => setSipYears(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Expected Return (%)
                  </p>
                  <Input
                    data-ocid="calculator.sip_return.input"
                    type="number"
                    value={sipReturn}
                    onChange={(e) => setSipReturn(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 bg-accent rounded-xl p-4">
                <div className="text-sm text-muted-foreground">
                  Estimated Returns
                </div>
                <div className="text-2xl font-black text-primary mt-1">
                  ₹{sipCalc().toLocaleString("en-IN")}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>
                    Invested: ₹
                    {(Number(sipAmt) * Number(sipYears) * 12).toLocaleString(
                      "en-IN",
                    )}
                  </span>
                  <span>
                    Gains: ₹
                    {(
                      sipCalc() -
                      Number(sipAmt) * Number(sipYears) * 12
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "holidays" && (
          <div className="px-4 pt-4 pb-6">
            <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
              <div className="grid grid-cols-3 px-4 py-2.5 bg-muted text-[11px] font-semibold text-muted-foreground">
                <span>DATE</span>
                <span>DAY</span>
                <span>OCCASION</span>
              </div>
              {HOLIDAYS.map((h, i) => (
                <div
                  key={h.date}
                  data-ocid={`holidays.item.${i + 1}`}
                  className="grid grid-cols-3 px-4 py-3 border-t border-border text-sm"
                >
                  <span className="font-semibold text-foreground">
                    {h.date}
                  </span>
                  <span className="text-muted-foreground">{h.day}</span>
                  <span className="text-xs text-foreground">{h.occasion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "about" && (
          <div className="px-4 pt-6 pb-6">
            <div className="bg-white rounded-xl border border-border shadow-card p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h2 className="font-black text-xl text-foreground">StockWise</h2>
              <p className="text-sm text-muted-foreground mt-2">
                India's smart stock market research platform
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-muted-foreground">Version 1.0.0</p>
                <p className="text-muted-foreground">
                  Data is simulated for educational purposes only. Not financial
                  advice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-20 bg-primary px-4 py-3">
        <h1 className="text-white font-bold text-lg">More</h1>
        <p className="text-white/70 text-xs mt-0.5">
          Tools & resources for traders
        </p>
      </div>
      <div className="px-4 pt-4 grid grid-cols-2 gap-3 pb-4">
        {MORE_ITEMS.map((item) => (
          <button
            type="button"
            key={item.id}
            data-ocid={`more.${item.id}.button`}
            onClick={() => setSection(item.id as Section)}
            className="bg-white rounded-xl border border-border shadow-card p-4 text-left hover:shadow-card-hover hover:border-primary/30 transition-all duration-200"
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="font-bold text-sm text-foreground">
              {item.label}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {item.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
