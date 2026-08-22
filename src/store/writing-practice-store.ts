"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { starsForRatio } from "@/lib/scoring";
import type { CategorySlug } from "@/types/category";
import {
  INITIAL_WRITING_PRACTICE,
  type ItemWritingProgress,
  type WritingPracticeState,
} from "@/types/writing-practice";
import { useProgressStore } from "./progress-store";

interface WritingPracticeActions {
  /**
   * Records one traced-letter attempt: keeps the best score per item (so
   * practicing a letter again never *lowers* its recorded result) and tops
   * up coins in the shared progress store — but only for a genuine
   * improvement to a new star tier, the same "reward getting better, not
   * repetition" rule `recordQuizResult` follows, so re-tracing an
   * already-mastered letter for fun doesn't mint infinite coins.
   *
   * Returns the coins awarded by this attempt (0 if the score didn't beat
   * the item's previous best tier), so the caller can flash that feedback.
   */
  recordAttempt: (category: CategorySlug, itemId: string, score: number) => number;
  /** Remembers which guide index a category's practice was left on, so reopening it resumes there. */
  setLastIndex: (category: CategorySlug, index: number) => void;
  /** Wipes traced-letter scores and the resume position for one category only — everything else (stars, coins, other categories) is untouched. */
  clearCategoryProgress: (category: CategorySlug) => void;
  /** Wipes every category's writing-practice progress — used by Settings' global "Reset Progress". */
  resetAll: () => void;
}

export type WritingPracticeStore = WritingPracticeState & WritingPracticeActions;

// Coins awarded per *newly earned* star tier on a letter — matches the quiz's
// scale (score * 2 coins for the whole round) roughly per star for a single
// item, without needing to know the category's item count up front.
const COINS_PER_STAR = 3;

export const useWritingPracticeStore = create<WritingPracticeStore>()(
  persist(
    (set) => ({
      ...INITIAL_WRITING_PRACTICE,
      recordAttempt: (category, itemId, score) => {
        const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
        let coinsAwarded = 0;

        set((state) => {
          const categoryProgress = state.itemProgressByCategory[category] ?? {};
          const existing = categoryProgress[itemId];
          const previousBest = existing?.bestScore ?? 0;
          const bestScore = Math.max(previousBest, clampedScore);

          if (bestScore > previousBest) {
            const newStars = starsForRatio(bestScore / 100);
            // No prior attempt at all: the full star tier just earned is new.
            // Otherwise only the *increase* over the previous tier counts —
            // `starsForRatio` never returns 0, so comparing tiers (not a
            // fictitious "0 stars" baseline) is what keeps repeated practice
            // at the same tier from awarding coins again.
            const newStarTiers = existing ? newStars - starsForRatio(previousBest / 100) : newStars;
            if (newStarTiers > 0) coinsAwarded = newStarTiers * COINS_PER_STAR;
          }

          const updated: ItemWritingProgress = {
            bestScore,
            attempts: (existing?.attempts ?? 0) + 1,
            updatedAt: Date.now(),
          };

          return {
            itemProgressByCategory: {
              ...state.itemProgressByCategory,
              [category]: { ...categoryProgress, [itemId]: updated },
            },
          };
        });

        if (coinsAwarded > 0) useProgressStore.getState().addCoins(coinsAwarded);
        return coinsAwarded;
      },
      setLastIndex: (category, index) =>
        set((state) => ({
          lastIndexByCategory: { ...state.lastIndexByCategory, [category]: index },
        })),
      clearCategoryProgress: (category) =>
        set((state) => {
          const lastIndexByCategory = { ...state.lastIndexByCategory };
          delete lastIndexByCategory[category];
          const itemProgressByCategory = { ...state.itemProgressByCategory };
          delete itemProgressByCategory[category];
          return { lastIndexByCategory, itemProgressByCategory };
        }),
      resetAll: () => set(() => ({ ...INITIAL_WRITING_PRACTICE })),
    }),
    { name: "hka-writing-practice" },
  ),
);

/** How many items in `category` have at least one recorded trace attempt. */
export function selectCategoryTracedCount(state: WritingPracticeStore, category: CategorySlug): number {
  return Object.keys(state.itemProgressByCategory[category] ?? {}).length;
}
