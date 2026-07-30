import type { LearningCategory } from "@/types/category";
import { namedItems } from "./_helpers";

const NAMES = [
  "Parrot", "Peacock", "Sparrow", "Pigeon", "Crow", "Eagle", "Owl", "Duck", "Hen", "Rooster",
  "Swan", "Flamingo", "Kingfisher", "Woodpecker", "Penguin", "Ostrich", "Emu", "Turkey", "Goose",
  "Cuckoo", "Nightingale", "Myna", "Vulture", "Hawk", "Crane", "Stork", "Pelican", "Seagull",
  "Kiwi", "Hummingbird",
] as const;

const ICONS = [
  "🦜", "🦚", "🐦", "🕊️", "🐦", "🦅", "🦉", "🦆", "🐔", "🐓",
  "🦢", "🦩", "🐦", "🐦", "🐧", "🐦", "🐦", "🦃", "🪿", "🐦",
  "🐦", "🐦", "🦅", "🦅", "🐦", "🐦", "🐦", "🐦", "🐦", "🐦",
] as const;

export const birdsCategory: LearningCategory = {
  slug: "birds",
  icon: "🦜",
  title: "Birds",
  subtitle: "30 birds with pictures",
  color: "#0984E3",
  trace: false,
  items: namedItems("birds", NAMES, ICONS, "Bird"),
};
