import type { LearningCategory } from "@/types/category";
import { namedItems } from "./_helpers";

const NAMES = [
  "Apple", "Banana", "Mango", "Orange", "Grapes", "Watermelon", "Pineapple", "Papaya", "Guava",
  "Pomegranate", "Strawberry", "Blueberry", "Raspberry", "Cherry", "Peach", "Pear", "Plum",
  "Kiwi", "Coconut", "Lemon", "Lime", "Fig", "Date", "Apricot", "Avocado", "Dragon fruit",
  "Lychee", "Jackfruit", "Muskmelon", "Custard apple",
] as const;

const ICONS = [
  "🍎", "🍌", "🥭", "🍊", "🍇", "🍉", "🍍", "🍈", "🍐", "🍎",
  "🍓", "🫐", "🍓", "🍒", "🍑", "🍐", "🟣", "🥝", "🥥", "🍋",
  "🍋", "🟣", "🌴", "🍑", "🥑", "🐉", "🔴", "🟢", "🍈", "🍏",
] as const;

export const fruitsCategory: LearningCategory = {
  slug: "fruits",
  icon: "🍎",
  title: "Fruits",
  subtitle: "30 fruits with pictures",
  color: "#E84393",
  trace: false,
  items: namedItems("fruits", NAMES, ICONS, "Fruit"),
};
