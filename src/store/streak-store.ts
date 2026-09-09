"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, localDateKey } from "@/lib/date/local-date-key";
import { ACTIVE_DATES_WINDOW, INITIAL_STREAK, STREAK_MILESTONES, type StreakState } from "@/types/streak";
import { useProgressStore } from "./progress-store";

// Bonus coins awarded the instant a streak lands on one of `STREAK_MILESTONES`
// — scales up for longer milestones, same spirit as `COINS_PER_STAR` in
// writing-practice-store.ts rewarding sustained effort more than one round.
const MILESTONE_COINS: Record<number, number> = { 3: 15, 7: 30, 14: 50, 30: 100, 60: 200, 100: 350 };

/** Coins awarded for reaching `milestone` days — exported so UI copy (the celebration modal) can show the exact amount without duplicating this table. */
export function coinsForMilestone(milestone: number): number {
  return MILESTONE_COINS[milestone] ?? 0;
}

interface StreakTransientState {
  /**
   * The milestone just reached this session, or `null` — set by
   * `recordActivity` and read by `StreakMilestoneCelebration` to show/dismiss
   * its confetti + modal. Deliberately excluded from persistence (see
   * `partialize` below): a page reload should never re-show a celebration
   * for a milestone that was already hit and dismissed.
   */
  readonly celebratingMilestone: number | null;
}

interface StreakActions {
  /**
   * Marks today as an active day. Safe to call as often as you like (e.g.
   * every app open, via `StreakTracker`) — a no-op if today was already
   * recorded. Extends the streak by one when yesterday was the last active
   * day, starts a fresh streak of 1 otherwise (first-ever visit, or a missed
   * day — no shaming, just a clean restart), and the moment the new streak
   * lands on a milestone, awards a one-time coin bonus and flags it for
   * `StreakMilestoneCelebration` to celebrate.
   */
  recordActivity: () => void;
  /** Clears `celebratingMilestone` once its celebration has been shown/dismissed. */
  acknowledgeMilestone: () => void;
  /** Marks today as the day `StreakWelcomeModal` last showed itself, so it doesn't show again until a new calendar day. */
  acknowledgeWelcomeShown: () => void;
  /** Wipes all streak progress — used by Settings' global "Reset Progress". */
  resetAll: () => void;
}

export type StreakStore = StreakState & StreakTransientState & StreakActions;

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STREAK,
      celebratingMilestone: null,
      recordActivity: () => {
        const today = localDateKey();
        const { lastActiveDate, currentStreak, longestStreak, activeDates } = get();
        if (lastActiveDate === today) return;

        const yesterday = localDateKey(addDays(new Date(), -1));
        const nextStreak = lastActiveDate === yesterday ? currentStreak + 1 : 1;
        const nextActiveDates = activeDates.includes(today)
          ? activeDates
          : [...activeDates, today].slice(-ACTIVE_DATES_WINDOW);
        const milestoneHit = (STREAK_MILESTONES as readonly number[]).includes(nextStreak) ? nextStreak : null;

        set({
          currentStreak: nextStreak,
          longestStreak: Math.max(longestStreak, nextStreak),
          lastActiveDate: today,
          activeDates: nextActiveDates,
          celebratingMilestone: milestoneHit,
        });

        if (milestoneHit) {
          const bonus = coinsForMilestone(milestoneHit);
          if (bonus > 0) useProgressStore.getState().addCoins(bonus);
        }
      },
      acknowledgeMilestone: () => set({ celebratingMilestone: null }),
      acknowledgeWelcomeShown: () => set({ lastWelcomeShownDate: localDateKey() }),
      resetAll: () => set({ ...INITIAL_STREAK, celebratingMilestone: null }),
    }),
    {
      name: "hka-streak",
      // `celebratingMilestone` is intentionally left out — see its doc above.
      partialize: (state) => ({
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastActiveDate: state.lastActiveDate,
        activeDates: state.activeDates,
        lastWelcomeShownDate: state.lastWelcomeShownDate,
      }),
    },
  ),
);
