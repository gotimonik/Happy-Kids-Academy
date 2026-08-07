/**
 * "Living Scene" animation presets — the shared engine behind Living Alphabet,
 * and (reused as-is) Sleepy Animals / Emotional Animals / Rain Mode later:
 * one small set of "how does this item enter the world" animations, picked by
 * keyword-matching the item's label rather than hand-tagging every data entry.
 *
 * Intentionally label-driven (not category-driven): a bird is a "land" no
 * matter which category it shows up in (Alphabet, Animals, Birds), so this
 * keeps working as more categories opt into Living Scene without edits here.
 */

export type LivingPreset =
  | "grow"
  | "land"
  | "walk"
  | "swim"
  | "fly"
  | "drive-in"
  | "twinkle"
  | "pop";

const KEYWORD_PRESETS: ReadonlyArray<readonly [RegExp, LivingPreset]> = [
  [/apple|mango|grape|orange|melon|pumpkin|seed|plant|flower|tree|corn|sprout/i, "grow"],
  [/bird|parrot|duck|eagle|owl|crow|peacock|sparrow|hen|chick|penguin|flamingo|stork/i, "land"],
  [
    /cat|dog|elephant|lion|tiger|rabbit|yak|zebra|bear|horse|cow|goat|sheep|monkey|ant\b|fox|deer|camel|kangaroo|pig|donkey|squirrel/i,
    "walk",
  ],
  [/fish|shark|whale|dolphin|turtle|frog|otter|seal/i, "swim"],
  [/kite|airplane|plane|butterfly|bee\b|bat\b|dragonfly|jet/i, "fly"],
  [/van|car\b|bus|truck|train|bike|scooter|tractor|ship|boat/i, "drive-in"],
  [/sun\b|star\b|moon|light|lamp|firefly/i, "twinkle"],
];

/** Picks a Living Scene entrance animation for an item, based on its label. */
export function pickLivingPreset(label: string): LivingPreset {
  for (const [pattern, preset] of KEYWORD_PRESETS) {
    if (pattern.test(label)) {
      return preset;
    }
  }
  return "pop";
}
