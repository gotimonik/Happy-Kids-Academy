"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { localDateKey } from "@/lib/date/local-date-key";

interface DailyChallengeState {
  /** Local date key ("YYYY-MM-DD") of the last day the player finished the Daily Challenge, or `null` before their first one. */
  readonly lastCompletedDate: string | null;
  readonly recordCompletion: () => void;
  readonly resetAll: () => void;
}

export const useDailyChallengeStore = create<DailyChallengeState>()(
  persist(
    (set) => ({
      lastCompletedDate: null,
      recordCompletion: () => set({ lastCompletedDate: localDateKey() }),
      resetAll: () => set({ lastCompletedDate: null }),
    }),
    { name: "hka-daily-challenge" },
  ),
);
