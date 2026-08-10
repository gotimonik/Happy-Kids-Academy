"use client";

import { useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiOverlay } from "@/components/shared/confetti-overlay";
import { useChime } from "@/lib/audio/use-chime";
import type { QuizResult } from "@/types/quiz";

export function CelebrateScreen({
  result,
  onPlayAgain,
  onBackHome,
}: {
  result: QuizResult;
  onPlayAgain: () => void;
  onBackHome: () => void;
}) {
  const { playWinChime } = useChime();

  useEffect(() => {
    playWinChime();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- celebration chime plays once on mount only
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
      <ConfettiOverlay />
      <h2 className="font-display text-3xl font-bold">
        {result.score >= result.totalRounds * 0.8 ? "Amazing!" : "Well done!"}
      </h2>
      <p className="text-lg font-bold text-primary">
        You scored {result.score} out of {result.totalRounds}
      </p>
      <div className="flex gap-1 text-warning" aria-label={`${result.starsEarned} out of 3 stars`}>
        {Array.from({ length: 3 }, (_, i) => (
          <Star
            key={i}
            className="size-8"
            fill={i < result.starsEarned ? "currentColor" : "none"}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-sm font-bold text-[#E17055]">+{result.coinsEarned} coins</p>

      <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
        <Button type="button" size="md" className="flex-1" onClick={onPlayAgain}>
          Play Again
        </Button>
        <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onBackHome}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
