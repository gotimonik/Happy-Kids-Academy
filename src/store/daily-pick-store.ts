"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PickRecord {
  readonly date: string;
  readonly slug: string;
}

// A little more than the 7-day no-repeat window this feeds (see
// `pickTodaysCategory`), so the lookback always has full context without
// the history growing forever.
const HISTORY_LIMIT = 14;

interface DailyPickState {
  /** One entry per day a "Today's Pick" was actually shown, oldest first. */
  readonly history: readonly PickRecord[];
  /** No-ops if `date` is already recorded — the day's pick, once decided, stays fixed. */
  readonly recordPick: (date: string, slug: string) => void;
  readonly resetAll: () => void;
}

export const useDailyPickStore = create<DailyPickState>()(
  persist(
    (set) => ({
      history: [],
      recordPick: (date, slug) =>
        set((state) => {
          if (state.history.some((entry) => entry.date === date)) return state;
          return { history: [...state.history, { date, slug }].slice(-HISTORY_LIMIT) };
        }),
      resetAll: () => set({ history: [] }),
    }),
    { name: "hka-daily-pick" },
  ),
);
