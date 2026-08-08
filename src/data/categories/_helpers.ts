import type { LearningItem } from "@/types/item";

/**
 * Builds a list of simple "name + emoji" items sharing one detail label,
 * e.g. all Animals share detail "Animal". Mirrors the Android `namedItems()` helper.
 *
 * `images` is a sparse, name-aligned override list (see e.g. `vegetables.ts`)
 * for the handful of items that don't have a real Unicode emoji — those use
 * a small illustration instead of `icons[index]` wherever the picture is
 * actually shown.
 */
export function namedItems(
  slug: string,
  names: readonly string[],
  icons: readonly string[],
  detail: string,
  sounds?: readonly string[],
  images?: readonly (string | undefined)[],
): LearningItem[] {
  return names.map((name, index) => ({
    id: `${slug}-${index}`,
    icon: icons[index],
    image: images?.[index],
    label: name,
    detail,
    speech: name,
    sound: sounds?.[index] || undefined,
  }));
}
