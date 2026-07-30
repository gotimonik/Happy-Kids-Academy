"use client";

import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiOverlay } from "@/components/shared/confetti-overlay";
import { FeedbackToast } from "@/components/shared/feedback-toast";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";
import { useSoundSafari } from "./use-sound-safari";

const ACCENT = "#00B894";

export function SoundSafariGame() {
  const { round, totalRounds, score, current, status, answer, replay, restart } = useSoundSafari();

  useEffect(() => {
    if (status === "finished") {
      trackEvent("game_complete", { game_id: "sound-safari", score, total_rounds: totalRounds });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once when status flips to finished
  }, [status]);

  if (status === "finished") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
        <ConfettiOverlay />
        <h2 className="font-display text-3xl font-bold">
          {score >= totalRounds * 0.8 ? "Amazing ears!" : "Well done!"}
        </h2>
        <p className="text-lg font-bold text-primary">
          You matched {score} out of {totalRounds} sounds
        </p>
        <Button type="button" size="kid" onClick={restart}>
          Play Again
        </Button>
      </div>
    );
  }

  if (!current) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading round"
        className="flex min-h-64 animate-pulse items-center justify-center rounded-3xl border border-border bg-card"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm font-bold">
        <span className="text-muted-foreground">
          Round {round + 1} / {totalRounds}
        </span>
        <span style={{ color: ACCENT }}>Score {score}</span>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 text-center shadow-md">
        <p className="text-sm text-muted-foreground">Which animal makes this sound?</p>
        <Button type="button" size="kid" style={{ backgroundColor: ACCENT }} className="text-white hover:brightness-110" onClick={replay}>
          <Volume2 className="size-5" aria-hidden="true" />
          Play Sound
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {current.options.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => answer(item.id)}
            disabled={status !== "answering"}
            aria-label={item.label}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-border bg-card text-4xl shadow-sm transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60",
            )}
          >
            <span aria-hidden="true">{item.icon}</span>
          </button>
        ))}
      </div>

      <FeedbackToast
        status={status === "correct" ? "correct" : status === "incorrect" ? "incorrect" : null}
        message={status === "correct" ? "That's right!" : "Try again — listen closely"}
      />
    </div>
  );
}
