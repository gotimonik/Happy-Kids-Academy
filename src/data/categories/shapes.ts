import type { LearningCategory } from "@/types/category";

const SHAPES = [
  ["●", "Circle"], ["■", "Square"], ["▲", "Triangle"], ["▭", "Rectangle"], ["★", "Star"],
  ["⬭", "Oval"], ["◆", "Diamond"], ["♥", "Heart"], ["⬟", "Pentagon"], ["⬢", "Hexagon"],
] as const;

export const shapesCategory: LearningCategory = {
  slug: "shapes",
  icon: "○ △",
  title: "Shapes",
  subtitle: "10 shapes and matching",
  color: "#FF9F43",
  trace: false,
  items: SHAPES.map(([symbol, name], index) => ({
    id: `shapes-${index}`,
    symbol,
    label: name,
    detail: "Shape",
    speech: name,
  })),
};
