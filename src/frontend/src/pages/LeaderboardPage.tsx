import { Button } from "@/components/ui/button";
import { useActor } from "@/hooks/useActor";
import { ArrowLeft, Loader2, Medal, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
  category: string;
  date: string;
  percentage: number;
}

const RANK_COLORS = [
  "oklch(0.72 0.13 55)",
  "oklch(0.65 0.05 240)",
  "oklch(0.62 0.10 40)",
];

const RANK_ICONS = [
  <Trophy size={18} key="gold" style={{ color: "oklch(0.72 0.13 55)" }} />,
  <Medal size={18} key="silver" style={{ color: "oklch(0.65 0.05 240)" }} />,
  <Medal size={18} key="bronze" style={{ color: "oklch(0.62 0.10 40)" }} />,
];

interface LeaderboardPageProps {
  onBack: () => void;
}

export default function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const { actor, isFetching } = useActor();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  useEffect(() => {
    if (!actor || isFetching) return;
    async function fetchLeaderboard() {
      if (!actor) return;
      try {
        setLoading(true);
        const raw = await actor.getLeaderboard();
        const mapped: LeaderboardEntry[] = raw.map((e) => ({
          name: e.name,
          score: Number(e.score),
          total: Number(e.total),
          category: e.category,
          date: new Date(Number(e.timestamp / 1_000_000n)).toLocaleDateString(
            "hi-IN",
          ),
          percentage: e.percentage,
        }));
        setEntries(mapped);
      } catch {
        setError("लीडरबोर्ड load करने में error आई। दोबारा try करें।");
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [actor, isFetching]);

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-header">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mr-2"
            data-ocid="leaderboard.back.button"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">Q</span>
          </div>
          <span className="font-bold text-xl text-foreground">QuizWiz</span>
          <span className="text-muted-foreground mx-1">·</span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            <Trophy size={16} className="text-primary" /> Leaderboard
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-center font-bold text-3xl text-foreground mb-2">
            🏆 Hall of Fame
          </h1>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            Top highest scorers — सभी devices पर shared
          </p>

          {loading ? (
            <div
              className="flex items-center justify-center py-20"
              data-ocid="leaderboard.loading_state"
            >
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : error ? (
            <div
              className="bg-card rounded-2xl shadow-card p-12 text-center"
              data-ocid="leaderboard.error_state"
            >
              <p className="text-destructive text-sm">{error}</p>
              <Button className="mt-4 rounded-full" onClick={onBack}>
                वापस जाएं
              </Button>
            </div>
          ) : entries.length === 0 ? (
            <div
              className="bg-card rounded-2xl shadow-card p-12 text-center"
              data-ocid="leaderboard.empty_state"
            >
              <div className="text-5xl mb-4">🎯</div>
              <p className="text-muted-foreground text-sm">
                अभी तक कोई score save नहीं हुआ।
                <br />
                Quiz खेलें और leaderboard में अपना नाम दर्ज करें!
              </p>
              <Button
                className="mt-6 rounded-full px-6"
                onClick={onBack}
                data-ocid="leaderboard.play_quiz.button"
              >
                Quiz खेलें
              </Button>
            </div>
          ) : (
            <div
              className="bg-card rounded-2xl shadow-card overflow-hidden"
              data-ocid="leaderboard.table"
            >
              {entries.map((entry, idx) => {
                const pct = Math.round(entry.percentage);
                const rankColor =
                  idx < 3 ? RANK_COLORS[idx] : "oklch(0.52 0.015 264)";
                return (
                  <motion.div
                    key={`${entry.name}-${idx}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`flex items-center gap-4 px-6 py-4 border-b border-border last:border-b-0 ${
                      idx === 0 ? "bg-[oklch(0.97_0.04_55)]" : ""
                    }`}
                    data-ocid={`leaderboard.item.${idx + 1}`}
                  >
                    {/* Rank */}
                    <div
                      className="w-8 flex-shrink-0 flex items-center justify-center font-bold text-sm"
                      style={{ color: rankColor }}
                    >
                      {idx < 3 ? RANK_ICONS[idx] : <span>#{idx + 1}</span>}
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: "oklch(0.62 0.1 197)" }}
                    >
                      {entry.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {entry.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.category} · {entry.date}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="text-right flex-shrink-0">
                      <p
                        className="font-bold text-lg"
                        style={{ color: rankColor }}
                      >
                        {entry.score}/{entry.total}
                      </p>
                      <p className="text-xs text-muted-foreground">{pct}%</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        © {year}. Built with ❤️ using{" "}
        <a
          href={utmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
