"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfettiOverlay } from "@/components/shared/confetti-overlay";
import { StaticLink } from "@/components/shared/static-link";
import { categories } from "@/data/categories";
import { lastNDateKeys, localDateKey } from "@/lib/date/local-date-key";
import { useTranslation } from "@/lib/i18n/use-translation";
import { pickTodaysCategory } from "@/lib/home/pick-todays-category";
import { welcomeIcon } from "@/lib/home/welcome-icon";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { tileGradient } from "@/lib/ui/tile-gradient";
import { useDailyPickStore } from "@/store/daily-pick-store";
import { useProgressStore } from "@/store/progress-store";
import { useStreakStore } from "@/store/streak-store";

/** How many trailing calendar days a category is excluded from being picked again. */
const NO_REPEAT_WINDOW_DAYS = 7;

/**
 * A light "welcome back" moment shown once per calendar day on the home
 * page — the everyday counterpart to `StreakMilestoneCelebration` (which
 * only fires on an actual streak milestone, with confetti): a quick streak
 * readout plus one suggested category, giving every app open a warm,
 * guided start instead of dropping straight onto the static grid.
 *
 * `open` is derived straight from persisted store state rather than mirrored
 * into local state: it's true exactly while hydration has finished, today
 * isn't a milestone day (`StreakMilestoneCelebration` already covers that
 * day's "hello"), and today's welcome hasn't been acknowledged yet.
 * Dismissing (button, picking a category, or closing the dialog) just
 * records today as shown, which flips `open` back to false on its own —
 * no effect, no local visibility state to fall out of sync.
 */
export function StreakWelcomeModal() {
  const currentStreak = useStreakStore((state) => state.currentStreak);
  const celebratingMilestone = useStreakStore((state) => state.celebratingMilestone);
  const lastWelcomeShownDate = useStreakStore((state) => state.lastWelcomeShownDate);
  const acknowledgeWelcomeShown = useStreakStore((state) => state.acknowledgeWelcomeShown);
  const starsByCategory = useProgressStore((state) => state.starsByCategory);
  const pickHistory = useDailyPickStore((state) => state.history);
  const recordPick = useDailyPickStore((state) => state.recordPick);
  const streakHydrated = useStoreHydrated(useStreakStore);
  const progressHydrated = useStoreHydrated(useProgressStore);
  const pickHydrated = useStoreHydrated(useDailyPickStore);
  const t = useTranslation();

  const hydrated = streakHydrated && progressHydrated && pickHydrated;
  const today = useMemo(() => localDateKey(), []);
  const open = hydrated && celebratingMilestone === null && lastWelcomeShownDate !== today;

  // Once today's pick has actually been recorded (see the effect below),
  // that recorded slug is the source of truth for the rest of the day —
  // re-deriving from live `starsByCategory` on every render could pick a
  // *different* category the moment a star changes mid-day, contradicting
  // what was already shown/recorded as "today's pick".
  const todaysRecord = pickHistory.find((entry) => entry.date === today);

  const freshPick = useMemo(() => {
    if (todaysRecord) return null; // already decided for today — no need to recompute
    const recentSlugs = new Set(lastNDateKeys(NO_REPEAT_WINDOW_DAYS, new Date()));
    const recentPicks = pickHistory.filter((entry) => recentSlugs.has(entry.date)).map((entry) => entry.slug);
    return pickTodaysCategory(starsByCategory, recentPicks, today);
  }, [todaysRecord, starsByCategory, pickHistory, today]);

  const pick = todaysRecord ? (categories.find((category) => category.slug === todaysRecord.slug) ?? null) : freshPick;

  useEffect(() => {
    if (!todaysRecord && freshPick) {
      recordPick(today, freshPick.slug);
    }
  }, [todaysRecord, freshPick, recordPick, today]);

  function dismiss() {
    acknowledgeWelcomeShown();
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && dismiss()}>
      {open && <ConfettiOverlay count={18} />}
      <DialogContent className="overflow-hidden rounded-3xl text-center">
        <DialogHeader>
          {/* A soft color-blob glow behind the icon, plus a couple of
              twinkling sparkles orbiting it — the same "party card" look
              `StreakMilestoneCelebration` + `ConfettiOverlay` already give a
              milestone, brought to this everyday moment too so it reads as
              a little celebration rather than a plain dialog. */}
          <div className="relative mx-auto flex size-16 items-center justify-center">
            <span
              aria-hidden="true"
              className="absolute size-16 rounded-full bg-gradient-to-br from-primary/25 to-[#FF707D]/25 blur-lg"
            />
            <span
              aria-hidden="true"
              className="animate-twinkle absolute -left-1 top-0 text-base motion-reduce:hidden"
            >
              ✨
            </span>
            <span
              aria-hidden="true"
              className="animate-twinkle absolute -right-1 bottom-0 text-xs motion-reduce:hidden"
              style={{ animationDelay: "-1.4s" }}
            >
              ⭐
            </span>
            {/* Upgrades through `STREAK_MILESTONES`'s tiers as the streak
                grows — see `welcomeIcon` — instead of a single fixed
                balloon/flame that never changes. */}
            <p aria-hidden="true" className="animate-float relative text-4xl drop-shadow-md">
              {welcomeIcon(currentStreak)}
            </p>
          </div>
          <DialogTitle className="text-center font-display text-xl font-bold">
            <span className="bg-gradient-to-r from-primary via-[#A45EEA] to-[#FF707D] bg-clip-text text-transparent">
              {currentStreak > 1
                ? t("streak.welcomeBackTitle", { count: currentStreak })
                : t("streak.welcomeFirstTitle")}
            </span>
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {currentStreak > 1 ? t("streak.welcomeBackDescription") : t("streak.welcomeFirstDescription")}
          </DialogDescription>
        </DialogHeader>

        {pick && (
          <StaticLink
            href={`/learn/${pick.slug}`}
            onClick={dismiss}
            className="group relative mt-1 flex items-center gap-2.5 overflow-hidden rounded-xl p-3 text-left text-white shadow-md transition-transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
            style={tileGradient(pick.color)}
          >
            <span
              aria-hidden="true"
              className="absolute -right-5 -top-6 size-20 rounded-full bg-white/15 transition-transform group-hover:scale-110"
            />
            <span aria-hidden="true" className="absolute -left-6 -bottom-8 size-20 rounded-full bg-black/10 blur-md" />
            <span
              aria-hidden="true"
              className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl drop-shadow-sm"
            >
              {pick.icon}
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-white">
                <Sparkles className="size-2.5" aria-hidden="true" />
                {t("streak.todaysPick")}
              </span>
              <span className="mt-0.5 block truncate font-display text-base font-bold">{pick.title}</span>
            </span>
            <ChevronRight
              className="relative size-4 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </StaticLink>
        )}

        <Button onClick={dismiss} className="mt-3 w-full gap-2">
          <Sparkles className="size-4" aria-hidden="true" />
          {t("streak.welcomeButton")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
