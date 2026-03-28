import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BuzzStockChartModal } from "./components/BuzzStockChartModal";
import { PostModal } from "./components/PostModal";
import { BazaarBuzzPage } from "./pages/BazaarBuzzPage";

export type SelectedStock = {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
};

export default function App() {
  const [selectedStock, setSelectedStock] = useState<SelectedStock | null>(
    null,
  );
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <BazaarBuzzPage
        onStockClick={setSelectedStock}
        onPostClick={() => setShowPostModal(true)}
      />

      <AnimatePresence>
        {selectedStock && (
          <BuzzStockChartModal
            stock={selectedStock}
            onClose={() => setSelectedStock(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPostModal && <PostModal onClose={() => setShowPostModal(false)} />}
      </AnimatePresence>

      <Toaster />
    </div>
  );
}
