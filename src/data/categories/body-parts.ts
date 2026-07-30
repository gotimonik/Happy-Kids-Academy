import type { LearningCategory } from "@/types/category";
import { namedItems } from "./_helpers";

const NAMES = [
  "Eye", "Ear", "Nose", "Mouth", "Hand", "Arm", "Leg", "Head", "Finger", "Foot",
  "Toe", "Hair", "Teeth", "Tongue", "Neck", "Shoulder", "Knee", "Elbow", "Chest", "Back",
] as const;

const ICONS = [
  "👁️", "👂", "👃", "👄", "✋", "💪", "🦵", "🙂", "☝️", "🦶",
  "🦶", "💇", "🦷", "👅", "🧣", "🤷", "🦵", "💪", "🫁", "🔙",
] as const;

export const bodyPartsCategory: LearningCategory = {
  slug: "body-parts",
  icon: "👁️",
  title: "Body Parts",
  subtitle: "Learn your body",
  color: "#E17055",
  trace: false,
  items: namedItems("body-parts", NAMES, ICONS, "Body part"),
};
