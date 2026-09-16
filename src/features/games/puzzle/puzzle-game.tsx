"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";
import { GameCompleteModal } from "../game-complete-modal";
import { usePuzzleGame } from "./use-puzzle-game";

export function PuzzleGame() {
  const { tiles, next, wrongTile, isComplete, select, reset } = usePuzzleGame();

  useEffect(() => {
    if (isComplete) trackEvent("game_complete", { game_id: "puzzle" });
  }, [isComplete]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm text-muted-foreground">
        Tap the numbers in order, starting from 1.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {tiles.map((value) => {
          const isDone = value < next;
          return (
            <button
              key={value}
              type="button"
              onClick={() => select(value)}
              disabled={isDone}
              className={cn(
                "flex aspect-square items-center justify-center rounded-2xl font-display text-3xl font-bold shadow-md transition-transform focus-visible:outline-2 focus-visible:outline-ring",
                isDone && "bg-success/15 text-success opacity-60",
                !isDone && wrongTile === value && "bg-destructive/15 text-destructive",
                !isDone && wrongTile !== value && "bg-primary text-primary-foreground hover:scale-[1.03]",
              )}
            >
              {value}
            </button>
          );
        })}
      </div>

      <GameCompleteModal trigger={isComplete} title="Puzzle solved! 🎉" onPlayAgain={reset} />
    </div>
  );
}
