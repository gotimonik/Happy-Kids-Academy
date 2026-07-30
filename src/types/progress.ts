import type { CategorySlug } from "./category";

/** Persisted learning progress, replacing the Android `SharedPreferences "progress"` file. */
export interface ProgressState {
  readonly starsByCategory: Partial<Record<CategorySlug, number>>;
  readonly bestScoreByCategory: Partial<Record<CategorySlug, number>>;
  readonly coins: number;
  readonly lessonsCompleted: number;
  readonly timeSeconds: number;
}

export const INITIAL_PROGRESS: ProgressState = {
  starsByCategory: {},
  bestScoreByCategory: {},
  coins: 0,
  lessonsCompleted: 0,
  timeSeconds: 0,
};
