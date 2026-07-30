import type { LearningCategory } from "@/types/category";
import { namedItems } from "./_helpers";

const NAMES = [
  "Carrot", "Potato", "Tomato", "Onion", "Cabbage", "Cauliflower", "Broccoli", "Spinach", "Peas",
  "Corn", "Eggplant", "Cucumber", "Pumpkin", "Radish", "Beetroot", "Capsicum", "Chili", "Garlic",
  "Ginger", "Okra", "Bottle gourd", "Bitter gourd", "Sweet potato", "Turnip", "Mushroom",
  "Celery", "Lettuce", "Zucchini", "Green beans", "Drumstick",
] as const;

const ICONS = [
  "🥕", "🥔", "🍅", "🧅", "🥬", "🥦", "🥦", "🥬", "🫛", "🌽",
  "🍆", "🥒", "🎃", "🥕", "🟣", "🫑", "🌶️", "🧄", "🫚", "🟢",
  "🥒", "🥒", "🍠", "🥔", "🍄", "🥬", "🥬", "🥒", "🫛", "🟢",
] as const;

export const vegetablesCategory: LearningCategory = {
  slug: "vegetables",
  icon: "🥕",
  title: "Vegetables",
  subtitle: "30 vegetables with pictures",
  color: "#27AE60",
  trace: false,
  items: namedItems("vegetables", NAMES, ICONS, "Vegetable"),
};
