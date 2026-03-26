import { Button } from "@/components/ui/button";
import { Bell, Search, Zap } from "lucide-react";

export type NavPage =
  | "dashboard"
  | "index-fno"
  | "equity-fno"
  | "market-trends"
  | "community"
  | "support";

const NAV_LINKS: { id: NavPage; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "index-fno", label: "Index FNO" },
  { id: "equity-fno", label: "Equity FNO" },
  { id: "market-trends", label: "Market Trends" },
  { id: "community", label: "Community" },
  { id: "support", label: "Support" },
];

interface TopHeaderProps {
  activePage: NavPage;
  onPageChange: (page: NavPage) => void;
}

export default function TopHeader({
  activePage,
  onPageChange,
}: TopHeaderProps) {
  return (
    <header className="h-14 bg-sidebar border-b border-border flex items-center justify-between px-4 shrink-0 z-50">
      {/* Brand */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
          <img
            src="/assets/generated/option-traders-logo-transparent.dim_64x64.png"
            alt="Option Traders"
            className="w-6 h-6 object-contain"
          />
        </div>
        <div>
          <div className="text-xs font-bold text-primary tracking-widest leading-none">
            OPTION
          </div>
          <div className="text-xs font-bold text-foreground tracking-widest leading-none">
            TRADERS
          </div>
        </div>
        <div className="flex items-center gap-1 ml-1">
          <span className="live-dot w-1.5 h-1.5 rounded-full bg-success inline-block" />
          <span className="text-[10px] text-success font-medium">LIVE</span>
        </div>
      </div>

      {/* Nav links */}
      <nav
        className="hidden md:flex items-center gap-1"
        data-ocid="nav.section"
      >
        {NAV_LINKS.map((link) => (
          <button
            type="button"
            key={link.id}
            data-ocid={`nav.${link.id}.link`}
            onClick={() => onPageChange(link.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activePage === link.id
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-accent transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-accent transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary">
          AV
        </div>
        <Button
          type="button"
          size="sm"
          data-ocid="nav.upgrade.button"
          className="h-7 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1"
        >
          <Zap className="w-3 h-3" />
          Upgrade
        </Button>
      </div>
    </header>
  );
}
