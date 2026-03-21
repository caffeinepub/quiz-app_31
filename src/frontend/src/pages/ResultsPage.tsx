import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { LayoutGrid, Loader2, RefreshCw, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ResultsPageProps {
  score: number;
  total: number;
  categoryName: string;
  onTryAgain: () => void;
  onChooseCategory: () => void;
  onViewLeaderboard: () => void;
}

function getPerformanceMessage(pct: number): {
  title: string;
  emoji: string;
  color: string;
} {
  if (pct >= 90)
    return {
      title: "Outstanding! You're a genius!",
      emoji: "🏆",
      color: "oklch(0.68 0.15 148)",
    };
  if (pct >= 70)
    return {
      title: "Great job! You really know your stuff!",
      emoji: "🌟",
      color: "oklch(0.72 0.13 55)",
    };
  if (pct >= 50)
    return {
      title: "Not bad! Keep practicing!",
      emoji: "👍",
      color: "oklch(0.62 0.1 197)",
    };
  return {
    title: "Keep going! Practice makes perfect!",
    emoji: "💪",
    color: "oklch(0.55 0.1 15)",
  };
}

export default function ResultsPage({
  score,
  total,
  categoryName,
  onTryAgain,
  onChooseCategory,
  onViewLeaderboard,
}: ResultsPageProps) {
  const { actor } = useActor();
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const perf = getPerformanceMessage(pct);
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave() {
    if (!playerName.trim() || !actor) return;
    setSaving(true);
    setSaveError(null);
    try {
      await actor.submitScore(
        playerName.trim(),
        BigInt(score),
        BigInt(total),
        categoryName,
      );
      setSaved(true);
    } catch {
      setSaveError("Score save नहीं हो सका। दोबारा try करें।");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-header">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">Q</span>
          </div>
          <span className="font-bold text-xl text-foreground">QuizWiz</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-3xl shadow-card p-10 max-w-lg w-full text-center"
          data-ocid="results.panel"
        >
          {/* Big emoji */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="text-7xl mb-4"
          >
            {perf.emoji}
          </motion.div>

          <h1 className="font-bold text-2xl md:text-3xl text-foreground mb-2">
            Quiz Complete!
          </h1>
          <p className="text-muted-foreground text-sm mb-6">{categoryName}</p>

          {/* Score circle */}
          <div
            className="w-36 h-36 rounded-full mx-auto flex flex-col items-center justify-center mb-6 border-8"
            style={{
              borderColor: perf.color,
              backgroundColor: `${perf.color}18`,
            }}
          >
            <span className="font-bold text-4xl" style={{ color: perf.color }}>
              {score}/{total}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {pct}%
            </span>
          </div>

          <p className="font-semibold text-lg text-foreground mb-8">
            {perf.title}
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="font-bold text-2xl text-foreground">{score}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="font-bold text-2xl text-foreground">
                {total - score}
              </p>
              <p className="text-xs text-muted-foreground">Incorrect</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="font-bold text-2xl text-foreground">{pct}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>

          {/* Save to leaderboard */}
          <div className="mb-6 bg-muted rounded-2xl p-4">
            {saved ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-2"
                data-ocid="results.save.success_state"
              >
                <span className="text-2xl">🎉</span>
                <p className="font-semibold text-foreground text-sm">
                  Score saved! Leaderboard में आपका नाम दर्ज हो गया।
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full mt-1 gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={onViewLeaderboard}
                  data-ocid="results.view_leaderboard.button"
                >
                  <Trophy size={14} /> Leaderboard देखें
                </Button>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground mb-1">
                  🏆 अपना score save करें
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="अपना नाम लिखें..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    className="rounded-full text-sm flex-1"
                    data-ocid="results.name.input"
                    disabled={saving}
                  />
                  <Button
                    size="sm"
                    className="rounded-full px-4 font-semibold flex-shrink-0 gap-1"
                    onClick={handleSave}
                    disabled={!playerName.trim() || saving || !actor}
                    data-ocid="results.save_score.button"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save 🏆"
                    )}
                  </Button>
                </div>
                {saveError && (
                  <p
                    className="text-xs text-destructive mt-1"
                    data-ocid="results.save.error_state"
                  >
                    {saveError}
                  </p>
                )}
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors mt-1"
                  onClick={onViewLeaderboard}
                  data-ocid="results.view_leaderboard.button"
                >
                  Leaderboard देखें →
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="rounded-full px-7 gap-2 font-semibold"
              onClick={onChooseCategory}
              data-ocid="results.choose_category.button"
            >
              <LayoutGrid size={16} />
              Choose Another Category
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-7 gap-2 font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={onTryAgain}
              data-ocid="results.try_again.button"
            >
              <RefreshCw size={16} />
              Try Again
            </Button>
          </div>
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
