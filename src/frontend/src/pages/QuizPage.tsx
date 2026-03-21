import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Trophy, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetQuestionsByCategory } from "../hooks/useQueries";

interface QuizPageProps {
  categoryId: string;
  categoryName: string;
  onFinish: (score: number, total: number) => void;
  onBack: () => void;
}

const LETTER = ["A", "B", "C", "D"];
const TIMER_SECONDS = 30;

function computeScore(
  questions: { correctAnswer: bigint }[],
  answers: (number | null)[],
): number {
  return answers.reduce<number>((acc, ans, i) => {
    const q = questions[i];
    return acc + (q && ans !== null && Number(q.correctAnswer) === ans ? 1 : 0);
  }, 0);
}

export default function QuizPage({
  categoryId,
  categoryName,
  onFinish,
  onBack,
}: QuizPageProps) {
  const { data: questions, isLoading } = useGetQuestionsByCategory(categoryId);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Ref to call advanceQuestion from interval without stale closure issues
  const advanceRef = useRef<(() => void) | null>(null);

  const total = questions?.length ?? 0;
  const question = questions?.[currentIdx];
  const score = questions ? computeScore(questions, answers) : 0;

  const advanceQuestion = useCallback(
    (ans: number | null) => {
      setAnswers((prev) => {
        const newAnswers = [...prev, ans];
        if (currentIdx + 1 >= total) {
          const finalScore = questions
            ? computeScore(questions, newAnswers)
            : 0;
          onFinish(finalScore, total);
        } else {
          setCurrentIdx((i) => i + 1);
          setSelectedIdx(null);
          setAnswered(false);
        }
        return newAnswers;
      });
    },
    [currentIdx, total, questions, onFinish],
  );

  // Keep advanceRef in sync
  useEffect(() => {
    advanceRef.current = () => advanceQuestion(null);
  }, [advanceQuestion]);

  // Reset and start timer when question index changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: currentIdx triggers reset
  useEffect(() => {
    if (!questions || questions.length === 0) return;
    setTimeLeft(TIMER_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // Mark as time-up (no selection)
          setAnswered(true);
          setStreak(0);
          // Auto-advance after short delay
          setTimeout(() => {
            advanceRef.current?.();
          }, 1400);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, questions]);

  // Stop timer when user answers
  useEffect(() => {
    if (answered && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [answered]);

  function handleSelect(idx: number) {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    const correct = question && Number(question.correctAnswer) === idx;
    if (correct) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  }

  function handleNext() {
    advanceQuestion(selectedIdx);
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-background flex flex-col"
        data-ocid="quiz.loading_state"
      >
        <QuizHeader
          categoryName={categoryName}
          current={0}
          total={0}
          onBack={onBack}
        />
        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <Skeleton className="h-64 rounded-2xl mb-4" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <QuizHeader
          categoryName={categoryName}
          current={0}
          total={0}
          onBack={onBack}
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">
            No questions found for this category.
          </p>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentIdx + 1 >= total;
  const isCurrentCorrect =
    selectedIdx !== null && Number(question.correctAnswer) === selectedIdx;
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const isTimerCritical = timeLeft <= 10;

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      <QuizHeader
        categoryName={categoryName}
        current={currentIdx + 1}
        total={total}
        onBack={onBack}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main quiz panel */}
          <div className="flex-1 bg-card rounded-2xl shadow-card p-6 md:p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>
                  Question {currentIdx + 1} of {total}
                </span>
                <span>{Math.round(((currentIdx + 1) / total) * 100)}%</span>
              </div>
              <Progress
                value={((currentIdx + 1) / total) * 100}
                className="h-2.5 rounded-full"
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-bold text-xl md:text-2xl text-foreground mb-6 leading-snug">
                  {question.text}
                </h2>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  data-ocid="quiz.answers.list"
                >
                  {question.options.map((option, idx) => {
                    const correctIdx = Number(question.correctAnswer);
                    const isSelected = selectedIdx === idx;
                    const isCorrect = idx === correctIdx;

                    let optionClass =
                      "w-full text-left rounded-xl border-2 p-4 flex items-center gap-3 transition-all cursor-pointer font-medium text-sm md:text-base ";
                    let badgeClass =
                      "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ";

                    if (!answered) {
                      optionClass +=
                        "border-border bg-card text-foreground hover:border-primary hover:bg-accent";
                      badgeClass += "bg-muted text-muted-foreground";
                    } else if (isCorrect) {
                      optionClass +=
                        "border-correct bg-correct text-correct-foreground";
                      badgeClass += "bg-white/30 text-correct-foreground";
                    } else if (isSelected && !isCorrect) {
                      optionClass +=
                        "border-destructive bg-destructive/10 text-destructive";
                      badgeClass += "bg-destructive/20 text-destructive";
                    } else {
                      optionClass +=
                        "border-border bg-card text-muted-foreground opacity-60";
                      badgeClass += "bg-muted text-muted-foreground";
                    }

                    return (
                      <button
                        type="button"
                        key={`opt-${question.id}-${idx}`}
                        className={optionClass}
                        onClick={() => handleSelect(idx)}
                        disabled={answered}
                        data-ocid={`quiz.answer.button.${idx + 1}`}
                        aria-pressed={isSelected}
                      >
                        <span className={badgeClass}>{LETTER[idx]}</span>
                        <span className="flex-1">{option}</span>
                        {answered && isCorrect && (
                          <span className="text-xs font-bold ml-1">
                            ✓ Correct
                          </span>
                        )}
                        {answered && isSelected && !isCorrect && (
                          <span className="text-xs font-bold ml-1">
                            ✗ Wrong
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-between gap-3 ${
                      isCurrentCorrect
                        ? "bg-correct text-correct-foreground"
                        : selectedIdx === null
                          ? "bg-muted text-muted-foreground"
                          : "bg-destructive/10 text-destructive"
                    }`}
                    data-ocid="quiz.feedback.panel"
                  >
                    <span className="flex-1">
                      {selectedIdx === null
                        ? `⏱️ Time's up! Correct: ${question.options[Number(question.correctAnswer)]}`
                        : isCurrentCorrect
                          ? "🎉 Correct! Well done!"
                          : `❌ Wrong! Answer: ${question.options[Number(question.correctAnswer)]}`}
                    </span>
                    {selectedIdx !== null && (
                      <Button
                        size="sm"
                        className="rounded-full font-semibold flex-shrink-0"
                        onClick={handleNext}
                        data-ocid="quiz.next.button"
                      >
                        {isLastQuestion ? "See Results" : "Next"} →
                      </Button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:w-56 flex flex-row lg:flex-col gap-4">
            {/* Score */}
            <div className="flex-1 bg-card rounded-2xl shadow-card p-5 flex flex-col items-center justify-center gap-1 text-center">
              <Trophy size={28} className="text-primary mb-1" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Score
              </p>
              <p
                className="text-3xl font-bold text-foreground"
                data-ocid="quiz.score.panel"
              >
                {score}
              </p>
              <p className="text-xs text-muted-foreground">out of {total}</p>
            </div>
            {/* Streak */}
            <div className="flex-1 bg-card rounded-2xl shadow-card p-5 flex flex-col items-center justify-center gap-1 text-center">
              <Zap
                size={28}
                style={{ color: "oklch(0.72 0.13 55)" }}
                className="mb-1"
              />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Streak
              </p>
              <p
                className="text-3xl font-bold text-foreground"
                data-ocid="quiz.streak.panel"
              >
                {streak}
              </p>
              <p className="text-xs text-muted-foreground">in a row</p>
            </div>
            {/* Timer */}
            <div
              className="flex-1 bg-card rounded-2xl shadow-card p-5 flex flex-col items-center justify-center gap-2 text-center"
              data-ocid="quiz.timer.panel"
            >
              <Clock
                size={28}
                style={{
                  color: isTimerCritical
                    ? "oklch(0.52 0.18 15)"
                    : "oklch(0.62 0.1 197)",
                }}
                className="mb-1"
              />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Timer
              </p>
              <p
                className="text-3xl font-bold"
                style={{
                  color: isTimerCritical
                    ? "oklch(0.52 0.18 15)"
                    : "oklch(0.18 0.015 264)",
                }}
              >
                {timeLeft}
              </p>
              {/* Bar */}
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${timerPct}%`,
                    backgroundColor: isTimerCritical
                      ? "oklch(0.52 0.18 15)"
                      : "oklch(0.62 0.1 197)",
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">seconds</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuizHeader({
  categoryName,
  current,
  total,
  onBack,
}: {
  categoryName: string;
  current: number;
  total: number;
  onBack: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-card shadow-header">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="quiz.back.button"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-border">|</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                Q
              </span>
            </div>
            <span className="font-bold text-foreground">QuizWiz</span>
          </div>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          <span className="text-primary font-semibold">{categoryName}</span>
          {total > 0 && (
            <span>
              {" "}
              · Question {current}/{total}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
