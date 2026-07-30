import type { CategorySlug, LearningCategory } from "@/types/category";
import { alphabetCategory } from "./alphabet";
import { numbersCategory } from "./numbers";
import { mathCategory } from "./math";
import { shapesCategory } from "./shapes";
import { colorsCategory } from "./colors";
import { animalsCategory } from "./animals";
import { birdsCategory } from "./birds";
import { fruitsCategory } from "./fruits";
import { vegetablesCategory } from "./vegetables";
import { vehiclesCategory } from "./vehicles";
import { bodyPartsCategory } from "./body-parts";
import { gujaratiCategory } from "./gujarati";
import { hindiCategory } from "./hindi";

/** All 13 learning categories, in the same order as the original app's home grid. */
export const categories: readonly LearningCategory[] = [
  alphabetCategory,
  numbersCategory,
  mathCategory,
  shapesCategory,
  colorsCategory,
  animalsCategory,
  birdsCategory,
  fruitsCategory,
  vegetablesCategory,
  vehiclesCategory,
  bodyPartsCategory,
  gujaratiCategory,
  hindiCategory,
];

const categoryBySlug = new Map<CategorySlug, LearningCategory>(
  categories.map((category) => [category.slug, category]),
);

export function getCategory(slug: string): LearningCategory | undefined {
  return categoryBySlug.get(slug as CategorySlug);
}

export function getAllCategorySlugs(): CategorySlug[] {
  return categories.map((category) => category.slug);
}
