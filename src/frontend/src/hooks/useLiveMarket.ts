import { useCallback, useEffect, useState } from "react";
import {
  INDICES,
  type IndexData,
  STOCKS,
  type StockData,
} from "../data/marketData";

function randomFluctuation(value: number, maxPct = 0.15): number {
  const delta = value * (maxPct / 100) * (Math.random() * 2 - 1);
  return Math.round((value + delta) * 100) / 100;
}

export function useLiveMarket() {
  const [indices, setIndices] = useState<IndexData[]>(INDICES);
  const [stocks, setStocks] = useState<StockData[]>(STOCKS);
  const [flashMap, setFlashMap] = useState<
    Record<string, "gain" | "loss" | null>
  >({});

  const tick = useCallback(() => {
    setIndices((prev) =>
      prev.map((idx) => {
        const newVal = randomFluctuation(idx.value);
        const diff = newVal - idx.value;
        return {
          ...idx,
          value: newVal,
          change: Math.round((idx.change + diff) * 100) / 100,
          changePct:
            Math.round(
              ((idx.change + diff) / (newVal - idx.change - diff)) * 10000,
            ) / 100,
        };
      }),
    );

    setStocks((prev) => {
      const newFlash: Record<string, "gain" | "loss" | null> = {};
      const updated = prev.map((stock) => {
        const newLtp = randomFluctuation(stock.ltp);
        const direction = newLtp > stock.ltp ? "gain" : "loss";
        newFlash[stock.symbol] = direction;
        const newChangePct =
          Math.round(
            ((newLtp - (stock.ltp - stock.change)) /
              (stock.ltp - stock.change)) *
              10000,
          ) / 100;
        return {
          ...stock,
          ltp: newLtp,
          change: Math.round((newLtp - (stock.ltp - stock.change)) * 100) / 100,
          changePct: newChangePct,
        };
      });
      setFlashMap(newFlash);
      setTimeout(() => setFlashMap({}), 600);
      return updated;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 3000);
    return () => clearInterval(interval);
  }, [tick]);

  return { indices, stocks, flashMap };
}
