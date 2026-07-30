import type { LearningItem } from "./item";

/** The 13 top-level learning categories, matching the Android content library. */
export type CategorySlug =
  | "alphabet"
  | "numbers"
  | "math"
  | "shapes"
  | "colors"
  | "animals"
  | "birds"
  | "fruits"
  | "vegetables"
  | "vehicles"
  | "body-parts"
  | "gujarati"
  | "hindi";

export interface LearningCategory {
  readonly slug: CategorySlug;
  /** Decorative icon/badge text shown on the category tile, e.g. "ABC", "🐘". */
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
  /** Tailwind-friendly hex accent color for this category. */
  readonly color: string;
  /** Whether this category offers a writing/trace practice mode. */
  readonly trace: boolean;
  readonly items: readonly LearningItem[];
}
