"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";
import { useMemoryGame } from "./use-memory-game";

export function MemoryGame() {
  const { deck, flipped, matchedPairs, moves, isComplete, flip, reset } = useMemoryGame();

  useEffect(() => {
    if (isComplete) trackEvent("game_complete", { game_id: "memory", moves });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once when isComplete flips true, not on every `moves` change
  }, [isComplete]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm font-bold text-muted-foreground">
        <span>Moves: {moves}</span>
        <span>
          Pairs found: {matchedPairs.size} / {deck.length / 2}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {deck.map((card) => {
          const isFlipped = flipped.includes(card.id) || matchedPairs.has(card.pairId);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(card.id)}
              aria-label={isFlipped ? card.label : "Hidden card"}
              disabled={matchedPairs.has(card.pairId)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-2xl text-3xl shadow-md transition-transform focus-visible:outline-2 focus-visible:outline-ring",
                isFlipped ? "bg-card" : "bg-primary hover:scale-[1.03]",
                matchedPairs.has(card.pairId) && "opacity-50",
              )}
            >
              {isFlipped ? card.icon : ""}
            </button>
          );
        })}
      </div>

      {isComplete && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-success/10 p-5 text-center">
          <p className="font-display text-lg font-bold text-success">All pairs matched! 🎉</p>
          <Button type="button" size="kid" onClick={reset}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
