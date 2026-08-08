"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackToast } from "@/components/shared/feedback-toast";
import { cn } from "@/lib/utils";
import { leftImageFor, leftValueFor, rightValueFor, useMatchingGame } from "./use-matching-game";

export function MatchingGame() {
  const {
    mode,
    title,
    items,
    rightOrder,
    selectedLeft,
    matched,
    feedback,
    allMatched,
    selectLeft,
    selectRight,
    nextRound,
  } = useMatchingGame();

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">Tap one item on the left, then its match</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          {items.map((item, index) => {
            const image = leftImageFor(mode, item);
            return (
              <button
                key={item.id}
                type="button"
                disabled={matched[index]}
                onClick={() => selectLeft(index)}
                aria-pressed={selectedLeft === index}
                className={cn(
                  "flex min-h-24 items-center justify-center rounded-2xl border-2 p-3 text-3xl font-bold shadow-sm transition-colors",
                  matched[index]
                    ? "border-success bg-success/10 text-success"
                    : selectedLeft === index
                      ? "border-warning bg-warning/10"
                      : "border-border bg-card",
                )}
              >
                {image ? <img src={image} alt="" aria-hidden="true" className="size-12" /> : leftValueFor(mode, item)}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          {rightOrder.map((itemIndex, rightPosition) => {
            const item = items[itemIndex];
            if (!item) return null;
            return (
              <button
                key={item.id}
                type="button"
                disabled={matched[itemIndex]}
                onClick={() => selectRight(rightPosition)}
                className={cn(
                  "flex min-h-24 items-center justify-center gap-2 rounded-2xl border-2 p-3 text-center text-lg font-bold shadow-sm transition-colors",
                  matched[itemIndex]
                    ? "border-success bg-success/10 text-success"
                    : "border-border bg-card",
                )}
              >
                {matched[itemIndex] && <Check className="size-5" aria-hidden="true" />}
                {rightValueFor(mode, item)}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <Button type="button" size="kid" onClick={nextRound} className="self-center">
          Next Matching Round ›
        </Button>
      )}

      <FeedbackToast status={feedback?.status ?? null} message={feedback?.message ?? ""} />
    </div>
  );
}
