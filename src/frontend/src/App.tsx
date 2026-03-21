import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useActor } from "./hooks/useActor";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";

const queryClient = new QueryClient();

export type AppView =
  | { screen: "home" }
  | { screen: "quiz"; categoryId: string; categoryName: string }
  | { screen: "results"; score: number; total: number; categoryName: string }
  | { screen: "leaderboard" };

function AppInner() {
  const [view, setView] = useState<AppView>({ screen: "home" });
  const { actor } = useActor();

  useEffect(() => {
    if (actor) {
      actor.forceReinitialize().catch(() => {});
    }
  }, [actor]);

  return (
    <>
      {view.screen === "home" && (
        <HomePage
          onSelectCategory={(id, name) =>
            setView({ screen: "quiz", categoryId: id, categoryName: name })
          }
          onViewLeaderboard={() => setView({ screen: "leaderboard" })}
        />
      )}
      {view.screen === "quiz" && (
        <QuizPage
          categoryId={view.categoryId}
          categoryName={view.categoryName}
          onFinish={(score, total) =>
            setView({
              screen: "results",
              score,
              total,
              categoryName: view.categoryName,
            })
          }
          onBack={() => setView({ screen: "home" })}
        />
      )}
      {view.screen === "results" && (
        <ResultsPage
          score={view.score}
          total={view.total}
          categoryName={view.categoryName}
          onTryAgain={() =>
            setView((prev) =>
              prev.screen === "results"
                ? {
                    screen: "quiz",
                    categoryId: "",
                    categoryName: prev.categoryName,
                  }
                : { screen: "home" },
            )
          }
          onChooseCategory={() => setView({ screen: "home" })}
          onViewLeaderboard={() => setView({ screen: "leaderboard" })}
        />
      )}
      {view.screen === "leaderboard" && (
        <LeaderboardPage onBack={() => setView({ screen: "home" })} />
      )}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
