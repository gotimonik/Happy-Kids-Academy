import type { LearningCategory } from "@/types/category";
import { namedItems } from "./_helpers";

const NAMES = [
  "Eye", "Ear", "Nose", "Mouth", "Hand", "Arm", "Leg", "Head", "Finger", "Foot",
  "Toe", "Hair", "Teeth", "Tongue", "Neck", "Shoulder", "Knee", "Elbow", "Chest", "Back",
] as const;

// Every body part has its own distinct icon — no two entries share a
// picture. Unicode doesn't have dedicated emoji for toe, knee, elbow, or
// back, so those use the closest distinct stand-in (a kneeling person for
// "knee", a backpack — worn on your back — for "back", etc.) instead of
// reusing foot/leg/arm's exact icon.
const ICONS = [
  "👁️", "👂", "👃", "👄", "✋", "💪", "🦵", "🙂", "☝️", "🦶",
  "🔟", "💇", "🦷", "👅", "🧣", "🤷", "🧎", "🦾", "🫁", "🎒",
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
