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
import { heroGradient, tileGradient } from "@/lib/ui/tile-gradient";
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
 *
 * Layout is deliberately restrained: a single color band themed to today's
 * pick with the hero badge overlapping down into the white body below (one
 * clear focal point), a plain title/description, today's pick as a lightly
 * tinted row, and a button — rather than stacking glow/sparkle/wash effects
 * on every element at once.
 */
/** Shared classes for the bottom CTA, whichever element (link or plain button) renders it. */
const welcomeCtaClassName =
  "animate-in fade-in slide-in-from-bottom-2 fill-mode-both mt-3 w-full gap-2 duration-500 delay-300";

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
  // The one color driving the band + hero badge below — today's pick when
  // there is one, otherwise the app's own brand purple — so the dialog
  // reads as "themed for today" instead of a fixed palette that never
  // changes.
  const heroColor = pick ? pick.color : "#6C5CE7";

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
      {/* `p-0`: the color band below needs to bleed edge-to-edge, so the
          body content gets its own padded wrapper instead of relying on
          DialogContent's default `p-6`. Only non-position utilities are
          overridden here — `tailwind-merge` treats every CSS `position`
          value as one conflicting group, so anything added to this
          className must never include `fixed`/`relative`/`absolute`, which
          would silently replace DialogContent's own base positioning. */}
      <DialogContent className="overflow-hidden rounded-3xl p-0 text-center shadow-[0_10px_20px_-8px_rgba(20,20,43,0.12),0_35px_70px_-25px_rgba(108,92,231,0.45)] ring-1 ring-black/5">
        {/* A short color band themed to today's pick — the one place color
            lives in this dialog, instead of a wash + glow + sparkles spread
            across every element. */}
        <div
          aria-hidden="true"
          className="animate-in relative h-20 fade-in duration-500"
          style={{
            backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${heroColor} 85%, white), ${heroColor})`,
          }}
        >
          {currentStreak > 1 && (
            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
              🔥 {currentStreak}
            </span>
          )}
        </div>

        {/* The hero icon — today's suggested category's own icon, changing
            daily along with `pick` instead of freezing on one balloon (the
            old behavior for every day-1/2 streak, i.e. most opens).
            `welcomeIcon`'s streak-tier progression becomes the fallback for
            the one case with nothing left to pick — a child who's already
            3-starred every category. A white outer badge overlapping down
            into the body below (rather than sitting inside the band) keeps
            one clear focal point instead of a glow blob + floating icon. */}
        <div className="relative z-10 -mt-10 flex justify-center">
          <span className="flex size-20 items-center justify-center rounded-[1.75rem] border-4 border-white bg-white shadow-[0_8px_20px_-8px_rgba(20,20,43,0.35)]">
            <span
              aria-hidden="true"
              className="relative flex size-16 items-center justify-center overflow-hidden rounded-2xl"
              style={pick ? tileGradient(pick.color) : heroGradient()}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent [mask-image:linear-gradient(to_bottom,black,transparent_55%)]"
              />
              <span className="relative text-2xl font-black leading-none text-white drop-shadow-sm">
                {pick ? pick.icon : welcomeIcon(currentStreak)}
              </span>
            </span>
          </span>
        </div>

        <div className="px-6 pb-6 pt-3">
          <DialogHeader>
            <DialogTitle className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both text-center font-display text-2xl font-bold tracking-tight duration-500 delay-100">
              {currentStreak > 1
                ? t("streak.welcomeBackTitle", { count: currentStreak })
                : t("streak.welcomeFirstTitle")}
            </DialogTitle>
            <DialogDescription className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both text-center text-sm duration-500 delay-150">
              {currentStreak > 1 ? t("streak.welcomeBackDescription") : t("streak.welcomeFirstDescription")}
            </DialogDescription>
          </DialogHeader>

          {pick && (
            <StaticLink
              href={`/learn/${pick.slug}`}
              onClick={dismiss}
              className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both group mt-4 flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left duration-500 delay-200 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ backgroundColor: `color-mix(in srgb, ${pick.color} 10%, white)` }}
            >
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-[0.625rem] text-sm font-black leading-none text-white"
                style={{ backgroundColor: pick.color }}
              >
                {pick.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block text-[0.62rem] font-extrabold uppercase tracking-wide"
                  style={{ color: `color-mix(in srgb, ${pick.color} 75%, black)` }}
                >
                  {t("streak.todaysPick")}
                </span>
                <span
                  className="block truncate font-display text-sm font-bold"
                  style={{ color: `color-mix(in srgb, ${pick.color} 88%, black)` }}
                >
                  {pick.title}
                </span>
              </span>
              <ChevronRight
                className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                style={{ color: `color-mix(in srgb, ${pick.color} 60%, black)`, opacity: 0.4 }}
                aria-hidden="true"
              />
            </StaticLink>
          )}

          {/* Primary CTA: when there's a pick, this jumps straight into
              today's suggested category (dismissing the dialog on the way),
              matching the row link above — `asChild` lets `StaticLink` (a
              real anchor, so the native-app `.html` rewrite and Capacitor
              handling still apply) render as the button itself instead of
              nesting an anchor inside a `<button>`. With nothing left to
              pick (every category already 3-starred), it falls back to a
              plain dismiss button since there's nowhere to send the child. */}
          {pick ? (
            <Button asChild accentColor={heroColor} className={welcomeCtaClassName}>
              <StaticLink href={`/learn/${pick.slug}`} onClick={dismiss}>
                <Sparkles className="size-4" aria-hidden="true" />
                {t("streak.welcomeButton")}
              </StaticLink>
            </Button>
          ) : (
            <Button onClick={dismiss} accentColor={heroColor} className={welcomeCtaClassName}>
              <Sparkles className="size-4" aria-hidden="true" />
              {t("streak.welcomeButton")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
