"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StaticLink } from "@/components/shared/static-link";
import { categories } from "@/data/categories";
import { localDateKey } from "@/lib/date/local-date-key";
import { useTranslation } from "@/lib/i18n/use-translation";
import { createDailyChallengeGenerator } from "@/lib/quiz/generators";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { QuizSession } from "@/features/quiz/quiz-session";
import { useDailyChallengeStore } from "@/store/daily-challenge-store";
import { useProgressStore } from "@/store/progress-store";

const DAILY_CHALLENGE_ROUNDS = 5;
const DAILY_CHALLENGE_BONUS_COINS = 20;
const DAILY_CHALLENGE_COLOR = "#E84393";

/**
 * A special 5-question mixed quiz that's the same for everyone on a given
 * calendar day (see `createDailyChallengeGenerator`) and pays out an extra
 * flat coin bonus on top of the normal per-question reward — a reason to
 * open the app once a day beyond the streak itself, and available only
 * once per day.
 */
export function DailyChallengeClient() {
  const lastCompletedDate = useDailyChallengeStore((state) => state.lastCompletedDate);
  const recordCompletion = useDailyChallengeStore((state) => state.recordCompletion);
  const addCoins = useProgressStore((state) => state.addCoins);
  const hydrated = useStoreHydrated(useDailyChallengeStore);
  const t = useTranslation();

  const today = useMemo(() => localDateKey(), []);
  const generateQuestion = useMemo(
    () => createDailyChallengeGenerator(categories, today, DAILY_CHALLENGE_ROUNDS),
    [today],
  );

  // Whether today's challenge was already done BEFORE this visit — decided
  // once, the instant hydration finishes, and pinned from then on. This
  // must NOT track `lastCompletedDate` live: finishing the challenge during
  // this very visit updates that same field (via `recordCompletion` below),
  // and re-deriving from it here would swap the "completed" screen in and
  // unmount the in-progress `QuizSession` — losing the celebration screen —
  // the instant the player answers the last question. Same one-shot
  // snapshot-at-hydration pattern `useStoreHydrated` itself uses.
  const [completedBeforeVisit, setCompletedBeforeVisit] = useState<boolean | null>(null);
  useEffect(() => {
    if (hydrated && completedBeforeVisit === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot snapshot at hydration, see comment above
      setCompletedBeforeVisit(lastCompletedDate === today);
    }
  }, [hydrated, completedBeforeVisit, lastCompletedDate, today]);

  if (completedBeforeVisit === null) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading"
        className="flex min-h-64 animate-pulse items-center justify-center rounded-3xl border border-border bg-card"
      />
    );
  }

  if (completedBeforeVisit) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
        <p aria-hidden="true" className="text-6xl drop-shadow-sm">
          🎉
        </p>
        <h1 className="font-display text-2xl font-bold">{t("dailyChallenge.completedTitle")}</h1>
        <p className="text-muted-foreground">{t("dailyChallenge.completedDescription")}</p>
        <Button asChild size="kid" className="mt-2 w-full max-w-xs">
          <StaticLink href="/">{t("common.backToHome")}</StaticLink>
        </Button>
      </div>
    );
  }

  return (
    <QuizSession
      title={t("dailyChallenge.title")}
      accentColor={DAILY_CHALLENGE_COLOR}
      backHref="/"
      totalRounds={DAILY_CHALLENGE_ROUNDS}
      generateQuestion={generateQuestion}
      bonusLine={t("dailyChallenge.bonusEarned", { count: DAILY_CHALLENGE_BONUS_COINS })}
      onQuizFinish={(result) => {
        addCoins(result.coinsEarned + DAILY_CHALLENGE_BONUS_COINS);
        recordCompletion();
      }}
    />
  );
}
