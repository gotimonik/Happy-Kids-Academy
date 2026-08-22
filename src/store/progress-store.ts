"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { starsForRatio } from "@/lib/scoring";
import type { CategorySlug } from "@/types/category";
import { INITIAL_PROGRESS, type ProgressState } from "@/types/progress";

interface ProgressActions {
  /** Records a completed quiz round for a category: updates best score and stars if improved. */
  recordQuizResult: (
    category: CategorySlug,
    score: number,
    totalRounds: number,
  ) => void;
  addCoins: (amount: number) => void;
  incrementLessonsCompleted: () => void;
  addTimeSeconds: (seconds: number) => void;
  resetProgress: () => void;
}

export type ProgressStore = ProgressState & ProgressActions;

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      ...INITIAL_PROGRESS,
      recordQuizResult: (category, score, totalRounds) =>
        set((state) => {
          const previousBest = state.bestScoreByCategory[category] ?? 0;
          const previousStars = state.starsByCategory[category] ?? 0;
          const ratio = totalRounds === 0 ? 0 : score / totalRounds;
          const earnedStars = starsForRatio(ratio);
          return {
            bestScoreByCategory: {
              ...state.bestScoreByCategory,
              [category]: Math.max(previousBest, score),
            },
            starsByCategory: {
              ...state.starsByCategory,
              [category]: Math.max(previousStars, earnedStars),
            },
            coins: state.coins + score * 2,
          };
        }),
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      incrementLessonsCompleted: () =>
        set((state) => ({ lessonsCompleted: state.lessonsCompleted + 1 })),
      addTimeSeconds: (seconds) =>
        set((state) => ({ timeSeconds: state.timeSeconds + seconds })),
      resetProgress: () => set(() => ({ ...INITIAL_PROGRESS })),
    }),
    {
      name: "hka-progress",
      partialize: (state) => ({
        starsByCategory: state.starsByCategory,
        bestScoreByCategory: state.bestScoreByCategory,
        coins: state.coins,
        lessonsCompleted: state.lessonsCompleted,
        timeSeconds: state.timeSeconds,
      }),
    },
  ),
);

export function selectTotalStars(state: ProgressStore): number {
  return Object.values(state.starsByCategory).reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0,
  );
}

export function selectLevel(state: ProgressStore): number {
  return 1 + Math.floor(selectTotalStars(state) / 8);
}

export function selectBadges(state: ProgressStore): number {
  return Math.floor(selectTotalStars(state) / 3);
}
