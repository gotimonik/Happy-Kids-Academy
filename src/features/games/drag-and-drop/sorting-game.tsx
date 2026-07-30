"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSortingGame } from "./use-sorting-game";

export function SortingGame() {
  const { items, selectedId, sorted, wrongBucket, isComplete, selectItem, dropInBucket, reset } =
    useSortingGame();

  return (
    <div className="flex flex-col gap-5">
      <p className="text-center text-sm text-muted-foreground">
        Tap an item, then tap the bucket it belongs in.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {items
          .filter((item) => !sorted.has(item.id))
          .map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectItem(item.id)}
              aria-pressed={selectedId === item.id}
              className={cn(
                "flex size-16 items-center justify-center rounded-2xl text-3xl shadow-md transition-transform focus-visible:outline-2 focus-visible:outline-ring",
                selectedId === item.id ? "scale-110 bg-warning/30" : "bg-card hover:scale-105",
              )}
              aria-label={item.label}
            >
              {item.icon}
            </button>
          ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(["animals", "vehicles"] as const).map((bucket) => (
          <button
            key={bucket}
            type="button"
            onClick={() => dropInBucket(bucket)}
            className={cn(
              "flex min-h-28 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed p-4 font-display text-lg font-bold capitalize transition-colors",
              wrongBucket === bucket ? "border-destructive bg-destructive/10 text-destructive" : "border-border bg-card",
            )}
          >
            {bucket === "animals" ? "🐾" : "🚗"} {bucket}
            <span className="text-xs font-normal text-muted-foreground">
              {items.filter((i) => i.bucket === bucket && sorted.has(i.id)).length} /{" "}
              {items.filter((i) => i.bucket === bucket).length}
            </span>
          </button>
        ))}
      </div>

      {isComplete && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-success/10 p-5 text-center">
          <p className="font-display text-lg font-bold text-success">All sorted! 🎉</p>
          <Button type="button" size="kid" onClick={reset}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
