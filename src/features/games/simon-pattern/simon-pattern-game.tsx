"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";
import { PAD_COUNT, useSimonPattern } from "./use-simon-pattern";

const PAD_COLORS = ["#EE6352", "#45AAF2", "#37C183", "#FFD166"];
const PAD_LABELS = ["Red", "Blue", "Green", "Yellow"];

export function SimonPatternGame() {
  const { phase, activePad, level, bestLevel, tapPad, start } = useSimonPattern();

  useEffect(() => {
    if (phase === "gameover") trackEvent("game_complete", { game_id: "simon-pattern", level_reached: level });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once when phase flips to gameover
  }, [phase]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground">
        <span>Level {level}</span>
        {bestLevel > 0 && <span>Best {bestLevel}</span>}
      </div>

      <p className="text-center text-sm text-muted-foreground" aria-live="polite">
        {phase === "playing" && "Watch the pattern..."}
        {phase === "input" && "Your turn — repeat the pattern"}
        {phase === "idle" && "Get ready..."}
        {phase === "gameover" && "Game over!"}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: PAD_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => tapPad(i)}
            disabled={phase !== "input"}
            aria-label={`${PAD_LABELS[i]} pad`}
            className={cn(
              "size-28 rounded-3xl shadow-md transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-32",
              activePad === i ? "scale-95 brightness-125" : "hover:scale-[1.02]",
              phase !== "input" && phase !== "playing" && "opacity-70",
            )}
            style={{ backgroundColor: PAD_COLORS[i] }}
          />
        ))}
      </div>

      {phase === "gameover" && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-destructive/10 p-5 text-center">
          <p className="font-display text-lg font-bold text-destructive">
            You reached level {level}!
          </p>
          <Button type="button" size="md" onClick={start}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
