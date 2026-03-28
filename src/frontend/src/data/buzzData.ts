export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}

export interface FeedPost {
  id: string;
  avatar: string;
  name: string;
  handle: string;
  timestamp: string;
  text: string;
  tags: string[];
  likes: number;
  comments: number;
  breaking?: boolean;
  chartColor?: string;
}

export const TRENDING_STOCKS: Stock[] = [
  {
    ticker: "RELIANCE",
    name: "Reliance Industries",
    price: 2847.35,
    change: 34.2,
    changePct: 1.22,
  },
  {
    ticker: "TCS",
    name: "Tata Consultancy Services",
    price: 4123.8,
    change: 58.5,
    changePct: 1.44,
  },
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    price: 1698.45,
    change: 21.3,
    changePct: 1.27,
  },
  {
    ticker: "INFY",
    name: "Infosys",
    price: 1892.6,
    change: -12.4,
    changePct: -0.65,
  },
  {
    ticker: "TATAMOTORS",
    name: "Tata Motors",
    price: 987.25,
    change: 31.8,
    changePct: 3.33,
  },
  {
    ticker: "SBIN",
    name: "State Bank of India",
    price: 812.7,
    change: 14.5,
    changePct: 1.82,
  },
  {
    ticker: "ICICIBANK",
    name: "ICICI Bank",
    price: 1254.9,
    change: 18.7,
    changePct: 1.51,
  },
  {
    ticker: "AXISBANK",
    name: "Axis Bank",
    price: 1134.55,
    change: -8.3,
    changePct: -0.73,
  },
  {
    ticker: "WIPRO",
    name: "Wipro",
    price: 562.4,
    change: 9.2,
    changePct: 1.66,
  },
  {
    ticker: "BAJFINANCE",
    name: "Bajaj Finance",
    price: 7234.15,
    change: 187.6,
    changePct: 2.66,
  },
];

export const TOP_GAINERS: Stock[] = [
  {
    ticker: "TATAMOTORS",
    name: "Tata Motors",
    price: 987.25,
    change: 31.8,
    changePct: 3.33,
  },
  {
    ticker: "BAJFINANCE",
    name: "Bajaj Finance",
    price: 7234.15,
    change: 187.6,
    changePct: 2.66,
  },
  {
    ticker: "TCS",
    name: "Tata Consultancy Services",
    price: 4123.8,
    change: 58.5,
    changePct: 1.44,
  },
  {
    ticker: "WIPRO",
    name: "Wipro",
    price: 562.4,
    change: 9.2,
    changePct: 1.66,
  },
  {
    ticker: "SBIN",
    name: "State Bank of India",
    price: 812.7,
    change: 14.5,
    changePct: 1.82,
  },
];

export const MOST_ACTIVE: Stock[] = [
  {
    ticker: "RELIANCE",
    name: "Reliance Industries",
    price: 2847.35,
    change: 34.2,
    changePct: 1.22,
  },
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    price: 1698.45,
    change: 21.3,
    changePct: 1.27,
  },
  {
    ticker: "ICICIBANK",
    name: "ICICI Bank",
    price: 1254.9,
    change: 18.7,
    changePct: 1.51,
  },
  {
    ticker: "INFY",
    name: "Infosys",
    price: 1892.6,
    change: -12.4,
    changePct: -0.65,
  },
  {
    ticker: "AXISBANK",
    name: "Axis Bank",
    price: 1134.55,
    change: -8.3,
    changePct: -0.73,
  },
];

export const TRENDING_TOPICS = [
  "#NIFTY50",
  "#BuyTheBreakout",
  "#Sensex",
  "#OptionsTrading",
  "#IPO2024",
  "#BankNifty",
  "#TechStocks",
  "#GoldPrices",
  "#MidCapRally",
  "#RelianceIndustries",
];

export const ACTIVE_SECTORS = [
  { name: "IT", change: 2.3 },
  { name: "Banking", change: 1.8 },
  { name: "Auto", change: 3.1 },
  { name: "Pharma", change: -0.5 },
  { name: "Energy", change: 1.2 },
  { name: "FMCG", change: 0.7 },
  { name: "Metal", change: 2.9 },
  { name: "Realty", change: 1.5 },
];

export const FEED_POSTS: FeedPost[] = [
  {
    id: "1",
    avatar: "AK",
    name: "Arjun Kapoor",
    handle: "@arjun_trades",
    timestamp: "2 min ago",
    text: "🚨 BREAKING: TATAMOTORS just broke out of a 3-week consolidation range with massive volumes! The stock is up 3.3% today. RSI at 68 — still room to run. Entry zone: ₹980–990, Target: ₹1,050, SL: ₹960. This is a textbook cup-and-handle breakout. 🔥",
    tags: ["#TATAMOTORS", "#Breakout", "#Auto"],
    likes: 284,
    comments: 47,
    breaking: true,
    chartColor: "gain",
  },
  {
    id: "2",
    avatar: "PM",
    name: "Priya Mehta",
    handle: "@priya_nifty",
    timestamp: "15 min ago",
    text: "NIFTY 50 approaching key resistance at 24,600. If it breaks above with conviction, we could see a rally to 25,000+ in the next 2–3 sessions. Watch for the 15-min candle close above 24,580 for confirmation. Bank Nifty also looking strong. 📈",
    tags: ["#NIFTY50", "#BankNifty", "#Technicals"],
    likes: 192,
    comments: 31,
  },
  {
    id: "3",
    avatar: "RS",
    name: "Rohit Sharma",
    handle: "@rohit_analyst",
    timestamp: "32 min ago",
    text: "BAJFINANCE Q3 results are out and they're phenomenal! Net profit up 28% YoY, NII growth of 24%. The stock is reacting positively — up ₹187 today. Long-term investors should hold. Short-term traders can add on dips to ₹7,100 with a tight SL. Fundamental + technical both are aligned. 💰",
    tags: ["#BAJFINANCE", "#Earnings", "#FinancialSector"],
    likes: 341,
    comments: 68,
  },
  {
    id: "4",
    avatar: "SV",
    name: "Sneha Verma",
    handle: "@sneha_options",
    timestamp: "1 hr ago",
    text: "Options trade of the day 🎯\n\nNIFTY 24,500 CE (Weekly) at ₹82 premium\nTarget: ₹150+ | SL: ₹45\nRisk:Reward = 1:1.8\n\nBankNifty 52,000 CE also looking good. Market sentiment is bullish with PCR at 1.24. Do your own research before trading options!",
    tags: ["#OptionsTrading", "#NIFTY50", "#BankNifty"],
    likes: 156,
    comments: 24,
  },
  {
    id: "5",
    avatar: "VK",
    name: "Vikram Kumar",
    handle: "@vikram_midcap",
    timestamp: "2 hr ago",
    text: "Mid-cap IT stocks are on fire today! 🔥 WIPRO up 1.7%, TECHM up 2.1%, MPHASIS up 3.4%. The global IT demand recovery story is playing out. INFY dipped slightly but that's a buying opportunity IMO — strong guidance and order book. Tech sector rally has legs. #MidCapRally",
    tags: ["#TechStocks", "#WIPRO", "#MidCap"],
    likes: 203,
    comments: 39,
  },
  {
    id: "6",
    avatar: "ND",
    name: "Neha Desai",
    handle: "@neha_ipo",
    timestamp: "3 hr ago",
    text: "IPO Alert 📢 Three major IPOs opening this week:\n1. Ola Electric — Grey market premium ₹85 (45%+ GMP)\n2. FirstCry — Subscription opens tomorrow\n3. Bajafinserv AMC — Long-term wealth creator\n\nApply in all three through your demat account. Retail quota is your friend! 🙏",
    tags: ["#IPO2024", "#InvestSmart", "#StockMarket"],
    likes: 428,
    comments: 92,
  },
];
