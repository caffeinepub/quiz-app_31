import { useEffect, useRef, useState } from "react";

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  volume: string;
  prevClose: number;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Signal {
  id: string;
  symbol: string;
  type: "BUY" | "SELL" | "NEUTRAL";
  entry: number;
  sl: number;
  target: number;
  strategy: string;
  time: string;
  status: "ACTIVE" | "HIT_TARGET" | "HIT_SL";
}

export interface EquityStock {
  symbol: string;
  name: string;
  ltp: number;
  change: number;
  changePct: number;
  oi: string;
  volume: string;
  signal: "BUY" | "SELL" | "NEUTRAL";
  sector: string;
}

export interface OptionRow {
  strike: number;
  ceOI: number;
  ceLTP: number;
  cePct: number;
  peLTP: number;
  peOI: number;
  pePct: number;
  isITM: boolean;
}

export interface IntradayUpdate {
  id: string;
  time: string;
  title: string;
  desc: string;
  type: "bullish" | "bearish" | "neutral";
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  replies: number;
  tag: string;
  liked: boolean;
}

const randomFluctuation = (base: number, maxPct = 0.003): number => {
  const delta = base * maxPct * (Math.random() * 2 - 1);
  return Math.round((base + delta) * 100) / 100;
};

const INITIAL_INDICES: MarketIndex[] = [
  {
    symbol: "NIFTY50",
    name: "Nifty 50",
    price: 22418.95,
    change: 124.35,
    changePct: 0.56,
    high: 22480.0,
    low: 22290.5,
    volume: "182.4Cr",
    prevClose: 22294.6,
  },
  {
    symbol: "BANKNIFTY",
    name: "Bank Nifty",
    price: 48234.1,
    change: -312.5,
    changePct: -0.64,
    high: 48620.0,
    low: 48100.0,
    volume: "94.2Cr",
    prevClose: 48546.6,
  },
  {
    symbol: "FINNIFTY",
    name: "Fin Nifty",
    price: 21847.65,
    change: 88.2,
    changePct: 0.41,
    high: 21920.0,
    low: 21740.0,
    volume: "38.6Cr",
    prevClose: 21759.45,
  },
  {
    symbol: "MCXGOLD",
    name: "MCX Gold",
    price: 72438.0,
    change: 214.0,
    changePct: 0.3,
    high: 72560.0,
    low: 72150.0,
    volume: "12.8K",
    prevClose: 72224.0,
  },
  {
    symbol: "MCXCRUDE",
    name: "MCX Crude",
    price: 6862.0,
    change: -48.0,
    changePct: -0.69,
    high: 6940.0,
    low: 6840.0,
    volume: "8.2K",
    prevClose: 6910.0,
  },
];

const INITIAL_STOCKS: EquityStock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    ltp: 2847.5,
    change: 12.3,
    changePct: 0.43,
    oi: "4.2Cr",
    volume: "82.4L",
    signal: "BUY",
    sector: "Energy",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy",
    ltp: 3912.0,
    change: -28.5,
    changePct: -0.72,
    oi: "2.8Cr",
    volume: "34.2L",
    signal: "SELL",
    sector: "IT",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    ltp: 1642.75,
    change: 8.9,
    changePct: 0.54,
    oi: "6.1Cr",
    volume: "120.5L",
    signal: "BUY",
    sector: "Banking",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    ltp: 1478.3,
    change: -18.4,
    changePct: -1.23,
    oi: "3.4Cr",
    volume: "56.8L",
    signal: "SELL",
    sector: "IT",
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    ltp: 956.8,
    change: -22.1,
    changePct: -2.26,
    oi: "5.8Cr",
    volume: "148.2L",
    signal: "SELL",
    sector: "Auto",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    ltp: 782.45,
    change: 6.8,
    changePct: 0.87,
    oi: "8.2Cr",
    volume: "210.4L",
    signal: "BUY",
    sector: "Banking",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    ltp: 1089.6,
    change: 14.2,
    changePct: 1.32,
    oi: "4.9Cr",
    volume: "98.6L",
    signal: "BUY",
    sector: "Banking",
  },
  {
    symbol: "AXISBANK",
    name: "Axis Bank",
    ltp: 1124.3,
    change: -8.7,
    changePct: -0.77,
    oi: "3.6Cr",
    volume: "74.3L",
    signal: "NEUTRAL",
    sector: "Banking",
  },
  {
    symbol: "WIPRO",
    name: "Wipro",
    ltp: 448.75,
    change: -5.4,
    changePct: -1.19,
    oi: "2.1Cr",
    volume: "42.8L",
    signal: "SELL",
    sector: "IT",
  },
  {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank",
    ltp: 1756.2,
    change: 18.4,
    changePct: 1.06,
    oi: "2.8Cr",
    volume: "38.4L",
    signal: "BUY",
    sector: "Banking",
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance",
    ltp: 7234.5,
    change: 84.2,
    changePct: 1.18,
    oi: "1.6Cr",
    volume: "18.2L",
    signal: "BUY",
    sector: "NBFC",
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever",
    ltp: 2312.0,
    change: 4.8,
    changePct: 0.21,
    oi: "0.9Cr",
    volume: "12.4L",
    signal: "NEUTRAL",
    sector: "FMCG",
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki",
    ltp: 11248.0,
    change: 142.0,
    changePct: 1.28,
    oi: "0.8Cr",
    volume: "8.6L",
    signal: "BUY",
    sector: "Auto",
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical",
    ltp: 1684.4,
    change: -12.6,
    changePct: -0.74,
    oi: "1.4Cr",
    volume: "22.8L",
    signal: "NEUTRAL",
    sector: "Pharma",
  },
  {
    symbol: "ADANIENT",
    name: "Adani Enterprises",
    ltp: 2478.6,
    change: 38.2,
    changePct: 1.56,
    oi: "2.2Cr",
    volume: "28.4L",
    signal: "BUY",
    sector: "Conglomerate",
  },
];

const generateCandles = (basePrice: number, count = 60): Candle[] => {
  const candles: Candle[] = [];
  let price = basePrice * 0.98;
  const now = new Date();
  for (let i = count; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5 * 60000);
    const open = price;
    const change = price * 0.003 * (Math.random() * 2 - 1);
    const close = Math.round((price + change) * 100) / 100;
    const high =
      Math.round(
        (Math.max(open, close) + Math.abs(change) * Math.random()) * 100,
      ) / 100;
    const low =
      Math.round(
        (Math.min(open, close) - Math.abs(change) * Math.random()) * 100,
      ) / 100;
    candles.push({
      time: `${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}`,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 50000 + 10000),
    });
    price = close;
  }
  return candles;
};

const generateOptionChain = (atm: number, step: number): OptionRow[] => {
  const strikes: OptionRow[] = [];
  for (let i = -6; i <= 6; i++) {
    const strike = Math.round((atm + i * step) / step) * step;
    const isITM = i < 0;
    strikes.push({
      strike,
      ceOI: Math.floor(Math.random() * 5000 + 500) * 100,
      ceLTP:
        Math.round(
          Math.max(5, (atm - strike + 120) * (Math.random() * 0.3 + 0.85)) *
            100,
        ) / 100,
      cePct: Math.round((Math.random() * 10 - 5) * 100) / 100,
      peLTP:
        Math.round(
          Math.max(5, (strike - atm + 120) * (Math.random() * 0.3 + 0.85)) *
            100,
        ) / 100,
      peOI: Math.floor(Math.random() * 5000 + 500) * 100,
      pePct: Math.round((Math.random() * 10 - 5) * 100) / 100,
      isITM,
    });
  }
  return strikes;
};

const INITIAL_SIGNALS: Signal[] = [
  {
    id: "1",
    symbol: "BANK NIFTY",
    type: "BUY",
    entry: 48250,
    sl: 47900,
    target: 48800,
    strategy: "RSI Bounce",
    time: "09:32",
    status: "ACTIVE",
  },
  {
    id: "2",
    symbol: "TATA MOTORS",
    type: "SELL",
    entry: 960,
    sl: 982,
    target: 920,
    strategy: "EMA Crossover",
    time: "10:15",
    status: "ACTIVE",
  },
  {
    id: "3",
    symbol: "RELIANCE",
    type: "NEUTRAL",
    entry: 2850,
    sl: 2800,
    target: 2920,
    strategy: "MACD Divergence",
    time: "11:00",
    status: "ACTIVE",
  },
  {
    id: "4",
    symbol: "NIFTY 50",
    type: "BUY",
    entry: 22400,
    sl: 22250,
    target: 22600,
    strategy: "Breakout",
    time: "11:30",
    status: "ACTIVE",
  },
];

const INTRADAY_UPDATES: IntradayUpdate[] = [
  {
    id: "1",
    time: "11:45",
    title: "Nifty 50 — PCR Ratio 1.24 (Bullish)",
    desc: "Put Call Ratio above 1.2 signals institutional buying interest.",
    type: "bullish",
  },
  {
    id: "2",
    time: "11:30",
    title: "Bank Nifty — Max Pain at 48,000",
    desc: "Options max pain suggests 48,000 as key level for weekly expiry.",
    type: "neutral",
  },
  {
    id: "3",
    time: "11:15",
    title: "FII Net Buy ₹1,240 Cr in Index Futures",
    desc: "FIIs turned net buyers in index futures; positive for bulls.",
    type: "bullish",
  },
  {
    id: "4",
    time: "11:00",
    title: "IT Sector — Selling Pressure Intensifies",
    desc: "TCS, Infosys, Wipro all down 1%+ on global tech concerns.",
    type: "bearish",
  },
  {
    id: "5",
    time: "10:45",
    title: "HDFC Bank — OI Build at 1,640 CE",
    desc: "Massive call writing at 1,640 indicates resistance zone.",
    type: "neutral",
  },
  {
    id: "6",
    time: "10:30",
    title: "Nifty — 22,500 CE sees highest OI addition",
    desc: "22,500 call writers active; resistance expected at current levels.",
    type: "bearish",
  },
];

const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "1",
    author: "Rahul Sharma",
    avatar: "RS",
    time: "2 hrs ago",
    content:
      "Bank Nifty 48,200 PE looking interesting for tomorrow's expiry. Risk/reward seems favorable with current IV at 18%. Entry around 180-190, target 280+.",
    likes: 47,
    replies: 12,
    tag: "Options",
    liked: false,
  },
  {
    id: "2",
    author: "Priya Mehta",
    avatar: "PM",
    time: "3 hrs ago",
    content:
      "Nifty forming a double bottom near 22,250 on 15min chart. Strong support zone. Expecting reversal towards 22,500 by EOD. Stop loss below 22,200.",
    likes: 83,
    replies: 24,
    tag: "Index",
    liked: false,
  },
  {
    id: "3",
    author: "Kiran Patel",
    avatar: "KP",
    time: "4 hrs ago",
    content:
      "Reliance Industries breakout above 2,840 with volume. Target 2,920 short term. Fundamentals strong — JIO subscriber growth positive surprise.",
    likes: 34,
    replies: 8,
    tag: "Equity",
    liked: false,
  },
  {
    id: "4",
    author: "Vikram Singh",
    avatar: "VS",
    time: "5 hrs ago",
    content:
      "MCX Gold holding 72,000 support zone well. International spot gold also steady around $2,310. Bulls in control — target 72,800 for the week.",
    likes: 61,
    replies: 18,
    tag: "MCX",
    liked: false,
  },
];

export function useLiveMarket() {
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [stocks, setStocks] = useState<EquityStock[]>(INITIAL_STOCKS);
  const [candles, setCandles] = useState<Candle[]>(() =>
    generateCandles(22418.95),
  );
  const [signals] = useState<Signal[]>(INITIAL_SIGNALS);
  const [intradayUpdates] = useState<IntradayUpdate[]>(INTRADAY_UPDATES);
  const [communityPosts, setCommunityPosts] =
    useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [optionChain, setOptionChain] = useState<OptionRow[]>(() =>
    generateOptionChain(22400, 50),
  );
  // unused refs removed to avoid lint warnings

  useEffect(() => {
    const interval = setInterval(() => {
      setIndices((prev) =>
        prev.map((m) => {
          const newPrice = randomFluctuation(m.price);
          const change = Math.round((newPrice - m.prevClose) * 100) / 100;
          const changePct = Math.round((change / m.prevClose) * 10000) / 100;
          return { ...m, price: newPrice, change, changePct };
        }),
      );
      setStocks((prev) =>
        prev.map((s) => {
          const newLtp = randomFluctuation(s.ltp);
          const prevClose = s.ltp - s.change;
          const change = Math.round((newLtp - prevClose) * 100) / 100;
          const changePct = Math.round((change / prevClose) * 10000) / 100;
          return { ...s, ltp: newLtp, change, changePct };
        }),
      );
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        if (!last) return prev;
        const newClose = randomFluctuation(last.close);
        return [
          ...prev.slice(1),
          {
            ...last,
            close: newClose,
            high: Math.max(last.high, newClose),
            low: Math.min(last.low, newClose),
          },
        ];
      });
      setOptionChain(generateOptionChain(22400, 50));
    }, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLike = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  return {
    indices,
    stocks,
    candles,
    signals,
    intradayUpdates,
    communityPosts,
    toggleLike,
    optionChain,
  };
}
