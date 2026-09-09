"use client";

import { Check, Zap } from "lucide-react";
import { StaticLink } from "@/components/shared/static-link";
import { localDateKey } from "@/lib/date/local-date-key";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { useDailyChallengeStore } from "@/store/daily-challenge-store";

/**
 * Companion to `LevelBadge`/`StreakFlameBadge` on the home hero — same solid
 * white pill for contrast on the gradient, but this one is an actual link
 * (not just a stat readout): tapping it jumps straight into today's Daily
 * Challenge. Swaps to a checkmark once today's challenge is already done,
 * so returning players see at a glance there isn't a fresh one waiting.
 */
export function DailyChallengeBadge() {
  const lastCompletedDate = useDailyChallengeStore((state) => state.lastCompletedDate);
  const hydrated = useStoreHydrated(useDailyChallengeStore);
  const t = useTranslation();

  if (!hydrated) {
    return (
      <span
        className="inline-flex h-8 w-24 animate-pulse items-center rounded-full bg-white/60"
        aria-hidden="true"
      />
    );
  }

  const completedToday = lastCompletedDate === localDateKey();

  return (
    <StaticLink
      href="/daily-challenge"
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-primary shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97]"
    >
      {completedToday ? (
        <Check className="size-4 text-[#00B894]" aria-hidden="true" />
      ) : (
        <Zap className="size-4 fill-current text-[#E84393]" aria-hidden="true" />
      )}
      {completedToday ? t("home.dailyChallengeDone") : t("home.tile.dailyChallengeTitle")}
    </StaticLink>
  );
}
