"use client";

import { useMemo } from "react";
import { useSettingsStore } from "@/store/settings-store";
import type { LearningCategory } from "@/types/category";
import { toGujaratiNumerals } from "./gujarati-digits";

/**
 * Applies the user's Alphabet letter-case (single/double) and Numbers
 * digit-script (English/Gujarati) preferences to a category's items before
 * they're rendered — flashcards, quiz prompts, and the writing-practice
 * guide glyph all read from this instead of the raw category data.
 *
 * This only rewrites the display `symbol`; `id`/`label`/`speech` stay as-is,
 * so progress tracking and quiz answer-matching are unaffected either way.
 */
export function useDisplayCategory(category: LearningCategory): LearningCategory {
  const alphabetCase = useSettingsStore((state) => state.alphabetCase);
  const numberScript = useSettingsStore((state) => state.numberScript);

  return useMemo(() => {
    if (category.slug === "alphabet" && alphabetCase === "double") {
      return {
        ...category,
        items: category.items.map((item) =>
          item.symbol ? { ...item, symbol: `${item.symbol}${item.symbol.toLowerCase()}` } : item,
        ),
      };
    }

    if (category.slug === "numbers" && numberScript === "gujarati") {
      return {
        ...category,
        items: category.items.map((item) =>
          item.symbol ? { ...item, symbol: toGujaratiNumerals(item.symbol) } : item,
        ),
      };
    }

    return category;
  }, [category, alphabetCase, numberScript]);
}
