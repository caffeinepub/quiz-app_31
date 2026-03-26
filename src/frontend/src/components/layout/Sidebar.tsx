import {
  BarChart2,
  BookOpen,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Rss,
  ShieldQuestion,
  Star,
  Wrench,
} from "lucide-react";
import type { NavPage } from "./TopHeader";

const MENU_ITEMS: {
  id: string;
  label: string;
  icon: React.ReactNode;
  page?: NavPage;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    page: "dashboard",
  },
  {
    id: "nifty50",
    label: "Nifty 50",
    icon: <LineChart className="w-4 h-4" />,
    page: "index-fno",
  },
  {
    id: "banknifty",
    label: "Bank Nifty",
    icon: <BarChart2 className="w-4 h-4" />,
    page: "index-fno",
  },
  {
    id: "finnifty",
    label: "Fin Nifty",
    icon: <BarChart2 className="w-4 h-4" />,
    page: "index-fno",
  },
  {
    id: "watchlist",
    label: "Watchlist",
    icon: <Star className="w-4 h-4" />,
    page: "equity-fno",
  },
  {
    id: "tools",
    label: "Trading Tools",
    icon: <Wrench className="w-4 h-4" />,
    page: "market-trends",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BookOpen className="w-4 h-4" />,
    page: "market-trends",
  },
  {
    id: "community",
    label: "Community Feed",
    icon: <Rss className="w-4 h-4" />,
    page: "community",
  },
  {
    id: "support",
    label: "Support",
    icon: <ShieldQuestion className="w-4 h-4" />,
    page: "support",
  },
];

interface SidebarProps {
  activePage: NavPage;
  onPageChange: (page: NavPage) => void;
}

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-52 bg-sidebar border-r border-border shrink-0 py-3">
      <div className="px-3 mb-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2">
          Navigation
        </p>
      </div>
      <nav className="flex flex-col gap-0.5 px-2">
        {MENU_ITEMS.map((item) => {
          const isActive = item.page === activePage;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`sidebar.${item.id}.link`}
              onClick={() => item.page && onPageChange(item.page)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors w-full text-left ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              <span
                className={isActive ? "text-primary" : "text-muted-foreground"}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom info card */}
      <div className="mt-auto px-3 pb-2">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <p className="text-xs font-semibold text-primary mb-1">
            🚀 Option Traders
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Platform for Traders by Traders
          </p>
          <p className="text-[10px] text-primary/80 mt-1">60,000+ Members</p>
        </div>
      </div>
    </aside>
  );
}
