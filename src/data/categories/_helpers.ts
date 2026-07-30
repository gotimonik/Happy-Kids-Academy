import type { LearningItem } from "@/types/item";

/**
 * Builds a list of simple "name + emoji" items sharing one detail label,
 * e.g. all Animals share detail "Animal". Mirrors the Android `namedItems()` helper.
 */
export function namedItems(
  slug: string,
  names: readonly string[],
  icons: readonly string[],
  detail: string,
  sounds?: readonly string[],
): LearningItem[] {
  return names.map((name, index) => ({
    id: `${slug}-${index}`,
    icon: icons[index],
    label: name,
    detail,
    speech: name,
    sound: sounds?.[index] || undefined,
  }));
}
