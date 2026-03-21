import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Facebook, Github, Trophy, Twitter } from "lucide-react";
import { motion } from "motion/react";
import { useGetCategories } from "../hooks/useQueries";

const CATEGORY_STYLES: Record<string, { bg: string; emoji: string }> = {
  general: { bg: "bg-[oklch(0.88_0.10_55)]", emoji: "🌍" },
  "सामान्य ज्ञान": { bg: "bg-[oklch(0.88_0.10_55)]", emoji: "🌍" },
  science: { bg: "bg-[oklch(0.82_0.09_210)]", emoji: "🔬" },
  विज्ञान: { bg: "bg-[oklch(0.82_0.09_210)]", emoji: "🔬" },
  math: { bg: "bg-[oklch(0.84_0.10_155)]", emoji: "🔢" },
  गणित: { bg: "bg-[oklch(0.84_0.10_155)]", emoji: "🔢" },
  computer: { bg: "bg-[oklch(0.93_0.01_240)]", emoji: "💻" },
  कंप्यूटर: { bg: "bg-[oklch(0.93_0.01_240)]", emoji: "💻" },
  fun: { bg: "bg-[oklch(0.88_0.13_85)]", emoji: "🎉" },
  मनोरंजन: { bg: "bg-[oklch(0.88_0.13_85)]", emoji: "🎉" },
  history: { bg: "bg-[oklch(0.88_0.10_55)]", emoji: "📜" },
  geography: { bg: "bg-[oklch(0.84_0.10_155)]", emoji: "🌍" },
  "pop culture": { bg: "bg-[oklch(0.88_0.13_85)]", emoji: "🎬" },
  sports: { bg: "bg-[oklch(0.78_0.13_145)]", emoji: "⚽" },
  technology: { bg: "bg-[oklch(0.93_0.01_240)]", emoji: "💻" },
};

function getCategoryStyle(id: string, name: string) {
  return (
    CATEGORY_STYLES[id] ??
    CATEGORY_STYLES[name.toLowerCase()] ?? {
      bg: "bg-[oklch(0.84_0.10_197)]",
      emoji: "❓",
    }
  );
}

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Category चुनें",
    desc: "सामान्य ज्ञान, विज्ञान, गणित, कंप्यूटर और मनोरंजन में से अपनी पसंदीदा category चुनें।",
  },
  {
    step: 2,
    title: "सवालों के जवाब दें",
    desc: "हर सवाल को ध्यान से पढ़ें और सही उत्तर चुनें। 30 सेकंड का समय होगा!",
  },
  {
    step: 3,
    title: "Score देखें",
    desc: "हर जवाब पर instant feedback पाएं और अंत में leaderboard में नाम दर्ज करें।",
  },
];

const FOOTER_LINKS = [
  "Categories",
  "Features",
  "About Us",
  "Support",
  "Privacy",
  "Terms",
];
const NAV_LINKS = ["Explore Quizzes", "Categories", "Leaderboard", "About"];

const QUESTION_MARK_DOODLES = [
  {
    id: "q1",
    x: "8%",
    y: "15%",
    color: "oklch(0.75 0.13 55)",
    size: 42,
    rotate: -20,
  },
  {
    id: "q2",
    x: "18%",
    y: "65%",
    color: "oklch(0.88 0.13 85)",
    size: 28,
    rotate: 10,
  },
  {
    id: "q3",
    x: "78%",
    y: "20%",
    color: "oklch(0.78 0.13 145)",
    size: 36,
    rotate: 15,
  },
  {
    id: "q4",
    x: "88%",
    y: "60%",
    color: "oklch(0.75 0.1 210)",
    size: 44,
    rotate: -10,
  },
  {
    id: "q5",
    x: "50%",
    y: "10%",
    color: "oklch(0.72 0.10 197)",
    size: 24,
    rotate: 5,
  },
  {
    id: "q6",
    x: "35%",
    y: "75%",
    color: "oklch(0.75 0.13 55)",
    size: 32,
    rotate: 25,
  },
  {
    id: "q7",
    x: "65%",
    y: "80%",
    color: "oklch(0.88 0.13 85)",
    size: 22,
    rotate: -15,
  },
  {
    id: "q8",
    x: "92%",
    y: "35%",
    color: "oklch(0.84 0.10 155)",
    size: 30,
    rotate: 8,
  },
];

interface HomePageProps {
  onSelectCategory: (id: string, name: string) => void;
  onViewLeaderboard: () => void;
}

export default function HomePage({
  onSelectCategory,
  onViewLeaderboard,
}: HomePageProps) {
  const { data: categories, isLoading } = useGetCategories();
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-header">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                Q
              </span>
            </div>
            <span className="font-bold text-xl text-foreground">QuizWiz</span>
          </div>
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-ocid={`nav.${link.toLowerCase().replace(/ /g, "_")}.link`}
                onClick={link === "Leaderboard" ? onViewLeaderboard : undefined}
              >
                {link}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={onViewLeaderboard}
              data-ocid="nav.leaderboard.button"
            >
              <Trophy size={15} /> Leaderboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ backgroundColor: "oklch(0.94 0.04 197)" }}
      >
        {QUESTION_MARK_DOODLES.map((d) => (
          <div
            key={d.id}
            className="absolute select-none pointer-events-none font-bold opacity-60"
            style={{
              left: d.x,
              top: d.y,
              color: d.color,
              fontSize: d.size,
              transform: `rotate(${d.rotate}deg)`,
            }}
          >
            ?
          </div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        >
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-4">
            अपना ज्ञान परखें!
            <br />
            <span style={{ color: "oklch(0.55 0.1 197)" }}>मज़ेदार Quiz खेलें!</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            100 सवाल, 5 categories — सामान्य ज्ञान, विज्ञान, गणित, कंप्यूटर और मनोरंजन।
            Timer के साथ खेलें और Leaderboard में नाम दर्ज करें!
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="rounded-full px-8 text-base font-semibold"
              data-ocid="hero.start_quiz.button"
              onClick={() =>
                document
                  .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Quiz शुरू करें
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-base font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              data-ocid="hero.leaderboard.button"
              onClick={onViewLeaderboard}
            >
              <Trophy size={16} className="mr-1" /> Leaderboard
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-16 max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center font-bold text-3xl text-foreground mb-10"
        >
          Categories चुनें
        </motion.h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["s1", "s2", "s3", "s4", "s5"].map((k) => (
              <Skeleton key={k} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="categories.list"
          >
            {(categories ?? []).map((cat, idx) => {
              const style = getCategoryStyle(cat.id, cat.name);
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  data-ocid={`categories.item.${idx + 1}`}
                >
                  <div
                    className={`${style.bg} rounded-2xl shadow-card p-6 flex flex-col items-center gap-3 h-52 justify-between`}
                  >
                    <div className="text-5xl mt-2">{style.emoji}</div>
                    <h3 className="font-bold text-lg text-foreground text-center">
                      {cat.name}
                    </h3>
                    <Button
                      className="rounded-full px-6 font-semibold"
                      onClick={() => onSelectCategory(cat.id, cat.name)}
                      data-ocid={`categories.play.button.${idx + 1}`}
                    >
                      Play Now
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="py-16 bg-card">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center font-bold text-3xl text-foreground mb-10"
          >
            कैसे खेलें?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                className="bg-background rounded-2xl shadow-card p-6 flex flex-col items-center text-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg"
                  style={{ backgroundColor: "oklch(0.62 0.1 197)" }}
                >
                  {item.step}
                </div>
                <h3 className="font-bold text-lg text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">Q</span>
              </div>
              <span className="font-bold text-foreground">QuizWiz</span>
            </div>
            <nav className="flex flex-wrap items-center gap-5 justify-center">
              {FOOTER_LINKS.map((link) => (
                <button
                  type="button"
                  key={link}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </button>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </button>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </button>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            © {year}. Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
