import Sidebar from "@/components/layout/Sidebar";
import TopHeader, { type NavPage } from "@/components/layout/TopHeader";
import { Toaster } from "@/components/ui/sonner";
import { useLiveMarket } from "@/hooks/useLiveMarket";
import CommunityPage from "@/pages/CommunityPage";
import DashboardPage from "@/pages/DashboardPage";
import EquityFNOPage from "@/pages/EquityFNOPage";
import IndexFNOPage from "@/pages/IndexFNOPage";
import MarketTrendsPage from "@/pages/MarketTrendsPage";
import SupportPage from "@/pages/SupportPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

function AppInner() {
  const [activePage, setActivePage] = useState<NavPage>("dashboard");
  const {
    indices,
    stocks,
    candles,
    signals,
    intradayUpdates,
    communityPosts,
    toggleLike,
    optionChain,
  } = useLiveMarket();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopHeader activePage={activePage} onPageChange={setActivePage} />

      <div className="flex flex-1 min-h-0">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />

        <main className="flex-1 min-w-0 overflow-hidden">
          {activePage === "dashboard" && (
            <DashboardPage
              indices={indices}
              candles={candles}
              signals={signals}
              intradayUpdates={intradayUpdates}
              communityPosts={communityPosts}
              toggleLike={toggleLike}
              optionChain={optionChain}
            />
          )}
          {activePage === "index-fno" && (
            <IndexFNOPage indices={indices} optionChain={optionChain} />
          )}
          {activePage === "equity-fno" && <EquityFNOPage stocks={stocks} />}
          {activePage === "market-trends" && <MarketTrendsPage />}
          {activePage === "community" && (
            <CommunityPage posts={communityPosts} toggleLike={toggleLike} />
          )}
          {activePage === "support" && <SupportPage />}
        </main>
      </div>

      {/* Footer */}
      <footer className="h-8 bg-sidebar border-t border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="cursor-pointer hover:text-foreground">About</span>
          <span className="cursor-pointer hover:text-foreground">Terms</span>
          <span className="cursor-pointer hover:text-foreground">Privacy</span>
          <span className="cursor-pointer hover:text-foreground">API</span>
          <span className="cursor-pointer hover:text-foreground">Contact</span>
          <span className="text-warning/70">
            ⚠ Simulated data only — not for real trading
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} Option Traders India Pvt. Ltd. · Built
          with ❤ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </span>
      </footer>

      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "bg-card border-border text-foreground",
            description: "text-muted-foreground",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
