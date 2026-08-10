"use client";

import { useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiOverlay } from "@/components/shared/confetti-overlay";
import { useChime } from "@/lib/audio/use-chime";
import { useTranslation } from "@/lib/i18n/use-translation";
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
  const t = useTranslation();

  useEffect(() => {
    playWinChime();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- celebration chime plays once on mount only
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
      <ConfettiOverlay />
      <h2 className="font-display text-3xl font-bold">
        {result.score >= result.totalRounds * 0.8 ? t("quiz.amazing") : t("quiz.wellDone")}
      </h2>
      <p className="text-lg font-bold text-primary">
        {t("quiz.scoreLine", { score: result.score, total: result.totalRounds })}
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
      <p className="text-sm font-bold text-[#E17055]">{t("quiz.coinsEarned", { count: result.coinsEarned })}</p>

      {/* "kid" size (64px tall, roomier gap) matches every other primary
          button in the app — this pair was still on the smaller "md" size
          (44px), which read as cramped and hard to tap next to everything
          else on a phone. */}
      <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row">
        <Button type="button" size="kid" className="flex-1" onClick={onPlayAgain}>
          {t("common.playAgain")}
        </Button>
        <Button type="button" variant="secondary" size="kid" className="flex-1" onClick={onBackHome}>
          {t("common.backToHome")}
        </Button>
      </div>
    </div>
  );
}
