import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Clock, Newspaper } from "lucide-react";
import { motion } from "motion/react";

export interface NewsDetailItem {
  id: number;
  title: string;
  category: string;
  time: string;
  source: string;
  body: string;
  keyPoints: string[];
  sentiment?: "bullish" | "bearish";
}

interface NewsDetailViewProps {
  news: NewsDetailItem;
  onBack: () => void;
}

export function NewsDetailView({ news, onBack }: NewsDetailViewProps) {
  const paragraphs = news.body.split("\n\n").filter(Boolean);

  return (
    <motion.div
      data-ocid="news.detail.panel"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
      className="fixed inset-0 z-50 bg-background flex flex-col max-w-md mx-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border flex items-center gap-3 px-4 py-3 shadow-sm">
        <button
          type="button"
          data-ocid="news.detail.close_button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Newspaper className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-semibold text-foreground truncate">
            {news.source}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-5 pb-10 space-y-4">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="text-[11px] font-semibold border-primary/40 text-primary"
            >
              {news.category}
            </Badge>
            {news.sentiment && (
              <Badge
                variant="outline"
                className={`text-[11px] font-semibold ${
                  news.sentiment === "bullish"
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-red-50 text-red-700 border-red-300"
                }`}
              >
                {news.sentiment === "bullish" ? "📈 Bullish" : "📉 Bearish"}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-foreground leading-tight">
            {news.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground/70">
              {news.source}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {news.time}
            </span>
          </div>

          <Separator />

          {/* Body paragraphs */}
          <div className="space-y-4">
            {paragraphs.map((para, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static content
              <p key={i} className="text-sm text-foreground/85 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Key Points */}
          {news.keyPoints.length > 0 && (
            <div className="bg-primary/5 rounded-xl border border-primary/15 p-4 space-y-3">
              <h2 className="text-sm font-bold text-foreground">
                Key Takeaways
              </h2>
              <ul className="space-y-2.5">
                {news.keyPoints.map((point, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static content
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs text-foreground/80 leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
