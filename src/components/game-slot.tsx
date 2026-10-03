"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import type { Palette } from "@/lib/cabinets";

type GameName = "balance" | "forecast" | "dock";
type GameComponent = ComponentType<{ colors: Palette }>;

// Each game is its own chunk and only downloads when its cabinet is close.
const loaders: Record<GameName, () => Promise<GameComponent>> = {
  balance: () => import("@/components/games/balance-game").then((m) => m.BalanceGame),
  forecast: () => import("@/components/games/forecast-game").then((m) => m.ForecastGame),
  dock: () => import("@/components/games/dock-game").then((m) => m.DockGame),
};

export function GameSlot({ game, colors }: { game: GameName; colors: Palette }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Game, setGame] = useState<GameComponent | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const load = () => {
      loaders[game]().then((component) => {
        if (!cancelled) setGame(() => component);
      });
    };
    if (!("IntersectionObserver" in window)) {
      load();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [game]);

  return (
    <div ref={ref} className="h-full w-full" style={{ background: colors.bg }}>
      {Game ? <Game colors={colors} /> : null}
    </div>
  );
}
