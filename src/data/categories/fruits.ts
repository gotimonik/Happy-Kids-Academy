import type { LearningCategory } from "@/types/category";
import { namedItems } from "./_helpers";

const NAMES = [
  "Apple", "Banana", "Mango", "Orange", "Grapes", "Watermelon", "Pineapple", "Papaya", "Guava",
  "Pomegranate", "Strawberry", "Blueberry", "Raspberry", "Cherry", "Peach", "Pear", "Plum",
  "Kiwi", "Coconut", "Lemon", "Lime", "Fig", "Date", "Apricot", "Avocado", "Dragon fruit",
  "Lychee", "Jackfruit", "Muskmelon", "Custard apple",
] as const;

// Every fruit has its own distinct icon — no two entries share a picture.
// Unicode doesn't have a dedicated emoji for several of these (papaya,
// pomegranate, raspberry, fig, date, lychee, jackfruit, custard apple), so
// those used the closest distinct stand-in (a matching color/shape, or —
// for dragon fruit and custard apple — a fun pun on the name) instead of
// reusing another fruit's exact icon.
const ICONS = [
  "🍎", "🍌", "🥭", "🍊", "🍇", "🍉", "🍍", "🧡", "🍏", "❤️",
  "🍓", "🫐", "🔴", "🍒", "🍑", "🍐", "🟣", "🥝", "🥥", "🍋",
  "🟢", "🟤", "🌰", "🟠", "🥑", "🐉", "💗", "🟩", "🍈", "🟡",
] as const;

// For the fruits that don't have a real, recognizable Unicode emoji at all
// (a color swatch or an unrelated glyph doesn't actually look like the
// fruit), a small hand-drawn illustration is used instead wherever the
// picture is shown — see src/types/item.ts. Everything else keeps its emoji.
const IMAGE_OVERRIDES: Partial<Record<(typeof NAMES)[number], string>> = {
  Papaya: "/images/produce/papaya.svg",
  Guava: "/images/produce/guava.svg",
  Pomegranate: "/images/produce/pomegranate.svg",
  Raspberry: "/images/produce/raspberry.svg",
  Fig: "/images/produce/fig.svg",
  Date: "/images/produce/date.svg",
  Lychee: "/images/produce/lychee.svg",
  Jackfruit: "/images/produce/jackfruit.svg",
  "Custard apple": "/images/produce/custard-apple.svg",
};
const IMAGES = NAMES.map((name) => IMAGE_OVERRIDES[name]);

export const fruitsCategory: LearningCategory = {
  slug: "fruits",
  icon: "🍎",
  title: "Fruits",
  subtitle: "30 fruits with pictures",
  color: "#E84393",
  trace: false,
  items: namedItems("fruits", NAMES, ICONS, "Fruit", undefined, IMAGES),
};
