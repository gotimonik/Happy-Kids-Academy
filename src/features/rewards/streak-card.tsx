"use client";

import { lastNDateKeys, localDateKey } from "@/lib/date/local-date-key";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { useTranslation } from "@/lib/i18n/use-translation";
import { tileGradient } from "@/lib/ui/tile-gradient";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings-store";
import { useStreakStore } from "@/store/streak-store";
import { LANGUAGE_LOCALES } from "@/types/settings";
import { Skeleton } from "@/components/shared/skeleton-card";

const STREAK_COLOR = "#FF7A45";
const WEEK_LENGTH = 7;

function StreakCardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your streak" className="w-full rounded-3xl p-6 sm:p-8" style={tileGradient(STREAK_COLOR)}>
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 shrink-0 rounded-2xl bg-white/30" />
        <div className="flex-1">
          <Skeleton className="h-7 w-32 rounded-full bg-white/30" />
          <Skeleton className="mt-2 h-4 w-40 rounded-full bg-white/25" />
        </div>
      </div>
      <div className="mt-5 flex justify-between gap-1.5">
        {Array.from({ length: WEEK_LENGTH }, (_, i) => (
          <Skeleton key={i} className="size-8 rounded-full bg-white/25 sm:size-9" />
        ))}
      </div>
    </div>
  );
}

/**
 * Rewards dashboard's streak showcase: today's streak count, an
 * encouraging line, and a 7-day activity strip (🔥 for a day that was
 * active, the weekday initial otherwise — localized via `Intl`, matching
 * `numberScript`/`alphabetCase`'s "content stays English, UI chrome follows
 * `language`" split documented in `translations.ts`). See `StreakFlameBadge`
 * for the compact version shown on the home hero.
 */
export function StreakCard() {
  const currentStreak = useStreakStore((state) => state.currentStreak);
  const longestStreak = useStreakStore((state) => state.longestStreak);
  const activeDates = useStreakStore((state) => state.activeDates);
  const language = useSettingsStore((state) => state.language);
  const hydrated = useStoreHydrated(useStreakStore);
  const t = useTranslation();

  if (!hydrated) return <StreakCardSkeleton />;

  const today = new Date();
  const weekKeys = lastNDateKeys(WEEK_LENGTH, today);
  const todayKey = localDateKey(today);
  const activeSet = new Set(activeDates);

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-8"
      style={tileGradient(STREAK_COLOR)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
      />
      <span aria-hidden="true" className="absolute -right-10 -top-12 size-40 rounded-full bg-white/15" />
      <span aria-hidden="true" className="absolute -left-12 -bottom-16 size-40 rounded-full bg-black/10 blur-md" />

      <div className="relative flex items-center gap-4">
        <span
          aria-hidden="true"
          className="animate-float flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-4xl backdrop-blur-sm"
        >
          🔥
        </span>
        <div>
          <p className="font-display text-3xl font-bold drop-shadow-sm">
            {t("streak.dayCount", { count: currentStreak })}
          </p>
          <p className="mt-0.5 text-sm text-white/85">
            {currentStreak > 0 ? t("streak.keepItUp") : t("streak.startToday")}
          </p>
        </div>
      </div>

      <div className="relative mt-5 flex justify-between gap-1.5" role="list" aria-label="Last 7 days">
        {weekKeys.map((key) => {
          const date = new Date(`${key}T00:00:00`);
          const label = date.toLocaleDateString(LANGUAGE_LOCALES[language], { weekday: "narrow" });
          const isActive = activeSet.has(key);
          const isToday = key === todayKey;
          return (
            <div key={key} role="listitem" className="flex flex-col items-center gap-1">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-bold sm:size-9",
                  isActive ? "bg-white text-[#FF7A45]" : "bg-white/20 text-white/70",
                  isToday && !isActive && "ring-2 ring-white/70",
                )}
              >
                {isActive ? "🔥" : label}
              </span>
              <span className="sr-only">
                {label}
                {isActive ? " — active" : isToday ? " — today" : ""}
              </span>
            </div>
          );
        })}
      </div>

      {longestStreak > currentStreak && (
        <p className="relative mt-4 text-center text-xs font-semibold text-white/80">
          {t("streak.longestRecord", { count: longestStreak })}
        </p>
      )}
    </div>
  );
}
