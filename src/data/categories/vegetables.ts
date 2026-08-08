import type { LearningCategory } from "@/types/category";
import { namedItems } from "./_helpers";

const NAMES = [
  "Carrot", "Potato", "Tomato", "Onion", "Cabbage", "Cauliflower", "Broccoli", "Spinach", "Peas",
  "Corn", "Eggplant", "Cucumber", "Pumpkin", "Radish", "Beetroot", "Capsicum", "Chili", "Garlic",
  "Ginger", "Okra", "Bottle gourd", "Bitter gourd", "Sweet potato", "Turnip", "Mushroom",
  "Celery", "Lettuce", "Zucchini", "Green beans", "Drumstick",
] as const;

// Every vegetable has its own distinct icon — no two entries share a
// picture. Unicode doesn't have a dedicated emoji for several of these, so
// those use a small hand-drawn illustration instead (see IMAGE_OVERRIDES
// below) rather than a color swatch or unrelated glyph that doesn't
// actually look like the vegetable.
const ICONS = [
  "🥕", "🥔", "🍅", "🧅", "🍏", "☁️", "🥦", "🍃", "🫛", "🌽",
  "🍆", "🥒", "🎃", "🔴", "🟣", "🫑", "🌶️", "🧄", "🫚", "🟢",
  "🍐", "🥝", "🍠", "⚪", "🍄", "🎋", "🥬", "🎍", "🫘", "🟤",
] as const;

// For the vegetables that don't have a real, recognizable Unicode emoji at
// all, a small hand-drawn illustration is used instead wherever the
// picture is shown — see src/types/item.ts. Everything else keeps its emoji.
const IMAGE_OVERRIDES: Partial<Record<(typeof NAMES)[number], string>> = {
  Cabbage: "/images/produce/cabbage.svg",
  Cauliflower: "/images/produce/cauliflower.svg",
  Radish: "/images/produce/radish.svg",
  Beetroot: "/images/produce/beetroot.svg",
  Okra: "/images/produce/okra.svg",
  "Bottle gourd": "/images/produce/bottle-gourd.svg",
  "Bitter gourd": "/images/produce/bitter-gourd.svg",
  Turnip: "/images/produce/turnip.svg",
  Celery: "/images/produce/celery.svg",
  Zucchini: "/images/produce/zucchini.svg",
  Drumstick: "/images/produce/drumstick.svg",
};
const IMAGES = NAMES.map((name) => IMAGE_OVERRIDES[name]);

export const vegetablesCategory: LearningCategory = {
  slug: "vegetables",
  icon: "🥕",
  title: "Vegetables",
  subtitle: "30 vegetables with pictures",
  color: "#27AE60",
  trace: false,
  items: namedItems("vegetables", NAMES, ICONS, "Vegetable", undefined, IMAGES),
};
