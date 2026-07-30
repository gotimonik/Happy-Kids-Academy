import type { LearningCategory } from "@/types/category";

const COLORS = [
  ["Red", "#E74C3C"], ["Blue", "#3498DB"], ["Green", "#2ECC71"], ["Yellow", "#F1C40F"],
  ["Orange", "#F39C12"], ["Purple", "#9B59B6"], ["Pink", "#FF69B4"], ["Brown", "#795548"],
  ["Black", "#000000"], ["White", "#FFFFFF"],
] as const;

export const colorsCategory: LearningCategory = {
  slug: "colors",
  icon: "●",
  title: "Colors",
  subtitle: "10 colors with voice",
  color: "#A45EEA",
  trace: false,
  items: COLORS.map(([name, hex], index) => ({
    id: `colors-${index}`,
    symbol: "●",
    label: name,
    detail: "Color",
    speech: name,
    visualColor: hex,
  })),
};
