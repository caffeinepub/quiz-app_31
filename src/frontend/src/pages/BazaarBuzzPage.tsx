import {
  BarChart2,
  Bell,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Share2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SelectedStock } from "../App";
import {
  ACTIVE_SECTORS,
  FEED_POSTS,
  type FeedPost,
  MOST_ACTIVE,
  type Stock,
  TOP_GAINERS,
  TRENDING_STOCKS,
  TRENDING_TOPICS,
} from "../data/buzzData";
import { CommunityPage } from "./CommunityPage";
import { StockSignalsPage } from "./StockSignalsPage";

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SparklineSVG({ up }: { up: boolean }) {
  const pts = [0, 3, 1, 4, 2, 5, 3, 3, 6, 7, 4, 6, 8, 9, 5, 8, 10];
  const down = [10, 7, 9, 6, 8, 4, 7, 5, 5, 3, 6, 4, 4, 2, 3, 1, 0];
  const data = up ? pts : down;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 60;
  const H = 24;
  const points = data
    .map(
      (v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`,
    )
    .join(" ");
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Price sparkline"
    >
      <polyline
        points={points}
        fill="none"
        stroke={up ? "hsl(142,71%,50%)" : "hsl(0,84%,65%)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StockCarouselCard({
  stock,
  selected,
  onClick,
  flash,
}: {
  stock: Stock;
  selected: boolean;
  onClick: () => void;
  flash: "gain" | "loss" | null;
}) {
  const up = stock.changePct >= 0;
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid="trending.stock.card"
      className={`flex-shrink-0 w-[150px] rounded-2xl p-3 border transition-all cursor-pointer text-left ${
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-primary/40"
      } ${flash === "gain" ? "flash-gain" : flash === "loss" ? "flash-loss" : ""}`}
    >
      <div className="text-xs font-bold text-foreground">{stock.ticker}</div>
      <div className="text-[10px] text-muted-foreground truncate mt-0.5">
        {stock.name}
      </div>
      <div className="mt-2 text-sm font-semibold text-foreground">
        {formatPrice(stock.price)}
      </div>
      <div
        className={`text-xs font-medium mt-0.5 ${up ? "text-gain" : "text-loss"}`}
      >
        {up ? "+" : ""}
        {stock.changePct.toFixed(2)}%
      </div>
      <div className="mt-2">
        <SparklineSVG up={up} />
      </div>
    </button>
  );
}

function IndexCard({
  name,
  value,
  pct,
}: { name: string; value: string; pct: string }) {
  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-4 min-w-[200px]">
      <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
        <TrendingUp className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{name}</div>
        <div className="text-lg font-bold text-foreground">{value}</div>
        <div className="text-xs font-semibold text-gain">{pct}</div>
      </div>
    </div>
  );
}

function PostCard({
  post,
  onLike,
  liked,
}: { post: FeedPost; onLike: () => void; liked: boolean }) {
  const colors = [
    "bg-primary",
    "bg-purple-600",
    "bg-orange-500",
    "bg-teal-500",
    "bg-pink-600",
    "bg-indigo-500",
  ];
  const colorIdx = post.id.charCodeAt(0) % colors.length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 space-y-3"
    >
      {post.breaking && (
        <div className="inline-flex items-center gap-1.5 bg-destructive/20 text-destructive px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
          <span className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
          Breaking News
        </div>
      )}
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-full ${colors[colorIdx]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
        >
          {post.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">
              {post.name}
            </span>
            <span className="text-xs text-muted-foreground">{post.handle}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {post.timestamp}
            </span>
          </div>
          <p className="text-sm text-foreground/90 mt-1.5 leading-relaxed whitespace-pre-line">
            {post.text}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-5 mt-3">
            <button
              type="button"
              onClick={onLike}
              data-ocid="feed.post.toggle"
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                liked
                  ? "text-destructive"
                  : "text-muted-foreground hover:text-destructive"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${liked ? "fill-destructive" : ""}`}
              />
              {post.likes + (liked ? 1 : 0)}
            </button>
            <button
              type="button"
              data-ocid="feed.post.button"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {post.comments}
            </button>
            <button
              type="button"
              data-ocid="feed.share.button"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DiscoverView({
  stocks,
  gainers,
  active,
  selectedTicker,
  flashes,
  likedPosts,
  carouselRef,
  scrollCarousel,
  onStockClick,
  onLikePost,
}: {
  stocks: Stock[];
  gainers: Stock[];
  active: Stock[];
  selectedTicker: string | null;
  flashes: Record<string, "gain" | "loss" | null>;
  likedPosts: Set<string>;
  carouselRef: React.RefObject<HTMLDivElement>;
  scrollCarousel: (dir: number) => void;
  onStockClick: (s: SelectedStock) => void;
  onLikePost: (id: string) => void;
}) {
  return (
    <main className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Hero */}
      <section className="mb-6" data-ocid="hero.section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-foreground">
            Trends Today in India
          </h1>
          <div className="flex gap-3 flex-wrap">
            <IndexCard name="NIFTY 50" value="24,532.15" pct="+1.23%" />
            <IndexCard name="SENSEX" value="80,841.02" pct="+0.98%" />
          </div>
        </div>

        {/* Trending stocks carousel */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Trending Stocks
            </h2>
            <div className="flex-1 h-px bg-border" />
            <button
              type="button"
              data-ocid="carousel.pagination_prev"
              onClick={() => scrollCarousel(-1)}
              className="w-7 h-7 rounded-full border border-border bg-secondary flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              data-ocid="carousel.pagination_next"
              onClick={() => scrollCarousel(1)}
              className="w-7 h-7 rounded-full border border-border bg-secondary flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {stocks.map((stock) => (
              <StockCarouselCard
                key={stock.ticker}
                stock={stock}
                selected={selectedTicker === stock.ticker}
                flash={flashes[stock.ticker] || null}
                onClick={() =>
                  onStockClick({
                    ticker: stock.ticker,
                    name: stock.name,
                    price: stock.price,
                    change: stock.change,
                    changePct: stock.changePct,
                  })
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5">
        {/* Left Sidebar */}
        <aside className="space-y-4" data-ocid="sidebar.left.panel">
          {/* Trending Topics */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  data-ocid="topic.tag.button"
                  className="text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Active Sectors */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Active Sectors
            </h3>
            <div className="space-y-2">
              {ACTIVE_SECTORS.map((sector) => (
                <div
                  key={sector.name}
                  className="flex items-center justify-between py-1.5 border-b border-border/60 last:border-0"
                >
                  <span className="text-sm text-foreground">{sector.name}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      sector.change >= 0
                        ? "bg-gain text-gain"
                        : "bg-loss text-loss"
                    }`}
                  >
                    {sector.change >= 0 ? "+" : ""}
                    {sector.change}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Feed */}
        <section className="space-y-4" data-ocid="feed.section">
          {FEED_POSTS.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              liked={likedPosts.has(post.id)}
              onLike={() => onLikePost(post.id)}
            />
          ))}
        </section>

        {/* Right Sidebar */}
        <aside className="space-y-4" data-ocid="sidebar.right.panel">
          {/* Top Gainers */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Top Gainers
            </h3>
            <div className="space-y-2">
              {gainers.map((stock, i) => (
                <button
                  key={stock.ticker}
                  type="button"
                  onClick={() =>
                    onStockClick({
                      ticker: stock.ticker,
                      name: stock.name,
                      price: stock.price,
                      change: stock.change,
                      changePct: stock.changePct,
                    })
                  }
                  data-ocid={`gainers.item.${i + 1}`}
                  className="w-full flex items-center justify-between py-1.5 border-b border-border/60 last:border-0 hover:opacity-80 transition cursor-pointer"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-foreground">
                      {stock.ticker}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                      {stock.name}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gain">
                    +{stock.changePct.toFixed(2)}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Most Active */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Most Active
            </h3>
            <div className="space-y-2">
              {active.map((stock, i) => (
                <button
                  key={stock.ticker}
                  type="button"
                  onClick={() =>
                    onStockClick({
                      ticker: stock.ticker,
                      name: stock.name,
                      price: stock.price,
                      change: stock.change,
                      changePct: stock.changePct,
                    })
                  }
                  data-ocid={`active.item.${i + 1}`}
                  className="w-full flex items-center justify-between py-1.5 border-b border-border/60 last:border-0 hover:opacity-80 transition cursor-pointer"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-foreground">
                      {stock.ticker}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                      {stock.name}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold ${stock.changePct >= 0 ? "text-gain" : "text-loss"}`}
                  >
                    {stock.changePct >= 0 ? "+" : ""}
                    {stock.changePct.toFixed(2)}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

type NavView =
  | "Discover"
  | "Markets"
  | "Community"
  | "Signals"
  | "Learning"
  | "Portfolio";

export function BazaarBuzzPage({
  onStockClick,
  onPostClick,
}: {
  onStockClick: (s: SelectedStock) => void;
  onPostClick: () => void;
}) {
  const [stocks, setStocks] = useState(TRENDING_STOCKS);
  const [gainers, setGainers] = useState(TOP_GAINERS);
  const [active, setActive] = useState(MOST_ACTIVE);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [flashes, setFlashes] = useState<
    Record<string, "gain" | "loss" | null>
  >({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [activeNav, setActiveNav] = useState<NavView>("Discover");
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = useCallback((dir: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 170, behavior: "smooth" });
    }
  }, []);

  const handleLikePost = useCallback((id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const update = (s: typeof stocks) =>
        s.map((stock) => {
          const factor = 1 + (Math.random() - 0.5) * 0.002;
          const newPrice = Number.parseFloat((stock.price * factor).toFixed(2));
          const basePrice = stock.price - stock.change;
          const newChange = Number.parseFloat(
            (newPrice - basePrice).toFixed(2),
          );
          const newPct = Number.parseFloat(
            ((newChange / basePrice) * 100).toFixed(2),
          );
          const flash = newPrice > stock.price ? "gain" : "loss";
          setFlashes((prev) => ({ ...prev, [stock.ticker]: flash }));
          setTimeout(
            () => setFlashes((prev) => ({ ...prev, [stock.ticker]: null })),
            600,
          );
          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePct: newPct,
          };
        });
      setStocks((prev) => update(prev));
      setGainers((prev) => update(prev));
      setActive((prev) => update(prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const NAV_LINKS: NavView[] = [
    "Discover",
    "Markets",
    "Signals",
    "Community",
    "Learning",
    "Portfolio",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border"
        data-ocid="header.section"
      >
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart2 className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold">
              <span className="text-foreground">Bazaar</span>
              <span className="text-primary">Buzz</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => setActiveNav(link)}
                data-ocid={`nav.${link.toLowerCase()}.link`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeNav === link
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-[280px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search stocks, trends…"
              data-ocid="header.search_input"
              className="w-full bg-secondary border border-border rounded-full py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-2">
            <button
              type="button"
              data-ocid="header.bell.button"
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onPostClick}
              data-ocid="post.open_modal_button"
              className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Post Update
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
              VP
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div
          className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => setActiveNav(link)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeNav === link
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      </header>

      {/* Page content based on nav */}
      {activeNav === "Community" ? (
        <CommunityPage />
      ) : activeNav === "Signals" ? (
        <StockSignalsPage />
      ) : (
        <DiscoverView
          stocks={stocks}
          gainers={gainers}
          active={active}
          selectedTicker={selectedTicker}
          flashes={flashes}
          likedPosts={likedPosts}
          carouselRef={carouselRef as React.RefObject<HTMLDivElement>}
          scrollCarousel={scrollCarousel}
          onStockClick={(s) => {
            setSelectedTicker(s.ticker);
            onStockClick(s);
          }}
          onLikePost={handleLikePost}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-sm">
            <div>
              <div className="font-semibold text-foreground mb-3">
                BazaarBuzz
              </div>
              <div className="space-y-1.5 text-muted-foreground text-xs">
                <div>About Us</div>
                <div>Careers</div>
                <div>Press</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-3">Markets</div>
              <div className="space-y-1.5 text-muted-foreground text-xs">
                <div>NSE</div>
                <div>BSE</div>
                <div>MCX</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-3">
                Community
              </div>
              <div className="space-y-1.5 text-muted-foreground text-xs">
                <div>Forums</div>
                <div>Webinars</div>
                <div>Blog</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-3">Support</div>
              <div className="space-y-1.5 text-muted-foreground text-xs">
                <div>Help Center</div>
                <div>Contact</div>
                <div>Privacy Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} BazaarBuzz. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
