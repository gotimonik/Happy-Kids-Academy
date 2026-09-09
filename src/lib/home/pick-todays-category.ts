import { categories } from "@/data/categories";
import { seededShuffle } from "@/lib/quiz/seeded-random";
import type { LearningCategory } from "@/types/category";

const MAX_STARS_PER_CATEGORY = 3;

/**
 * Picks one category to spotlight for a given day: prefers whichever has
 * the fewest stars (framed as "explore this today", not "you're behind"),
 * while skipping anything in `recentSlugs` — the categories already picked
 * within the no-repeat window (see `useDailyPickStore`) — so the suggestion
 * doesn't repeat within the same week. Falls back to ignoring that history
 * once every eligible category has been picked recently (e.g. a child with
 * fewer than 7 categories still in progress) rather than showing nothing.
 *
 * Ties among equally-weak categories are broken with a PRNG seeded from
 * `seed` (the day's local date key) so the pick still varies day to day —
 * deterministically, same seed always gives the same answer — even on a
 * day where nothing about the child's progress changed, instead of
 * freezing on whichever tied category happens to sort first.
 *
 * `null` once every category is fully starred — nothing left to spotlight.
 */
export function pickTodaysCategory(
  starsByCategory: Partial<Record<string, number>>,
  recentSlugs: readonly string[],
  seed: string,
): LearningCategory | null {
  const eligible = categories.filter(
    (category) => (starsByCategory[category.slug] ?? 0) < MAX_STARS_PER_CATEGORY,
  );
  if (eligible.length === 0) return null;

  const notRecentlyPicked = eligible.filter((category) => !recentSlugs.includes(category.slug));
  const pool = notRecentlyPicked.length > 0 ? notRecentlyPicked : eligible;

  const lowestStars = Math.min(...pool.map((category) => starsByCategory[category.slug] ?? 0));
  const lowestTier = pool.filter((category) => (starsByCategory[category.slug] ?? 0) === lowestStars);

  return seededShuffle(lowestTier, seed)[0] ?? null;
}
