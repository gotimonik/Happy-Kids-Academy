import type { CategorySlug } from "./category";

/** One traced item's saved result — the best (highest) score it's ever earned, plus how many times it's been attempted. */
export interface ItemWritingProgress {
  /** 0–100 trace-accuracy score, the best of every attempt so far. */
  readonly bestScore: number;
  readonly attempts: number;
  readonly updatedAt: number;
}

/**
 * Persisted Writing Practice progress: which guide letter each category was
 * last left on (so reopening Practice resumes there instead of always
 * restarting at the first letter), plus a per-item score record keyed by
 * `LearningItem.id`. Deliberately its own store rather than folded into
 * `ProgressState` — that store's `starsByCategory`/`bestScoreByCategory` are
 * one number per *category* (earned via the quiz), while writing practice
 * needs one score per *item*, so reusing those fields would conflate two
 * different ratings under the same name.
 */
export interface WritingPracticeState {
  readonly lastIndexByCategory: Partial<Record<CategorySlug, number>>;
  readonly itemProgressByCategory: Partial<Record<CategorySlug, Record<string, ItemWritingProgress>>>;
}

export const INITIAL_WRITING_PRACTICE: WritingPracticeState = {
  lastIndexByCategory: {},
  itemProgressByCategory: {},
};
