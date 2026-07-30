import type { GameDefinition } from "@/types/game";

const PALETTE = ["#6C5CE7", "#EE6352", "#37C183", "#F39C12", "#0984E3"] as const;

function color(index: number): string {
  return PALETTE[index % PALETTE.length] ?? "#6C5CE7";
}

/** All 16 game tiles, in the same order as the Android app's Games hub. */
export const GAME_REGISTRY: readonly GameDefinition[] = [
  { id: "memory", title: "Memory Game", icon: "🧠", color: color(0), description: "Flip and match pairs", href: "/games/memory" },
  { id: "balloon-pop", title: "Balloon Pop", icon: "🎈", color: color(1), description: "Pop the correct letter", href: "/games/balloon-pop" },
  { id: "drag-and-drop", title: "Drag and Drop", icon: "☝️", color: color(2), description: "Sort items into buckets", href: "/games/drag-and-drop" },
  { id: "puzzle", title: "Puzzle", icon: "🧩", color: color(3), description: "Put the sequence in order", href: "/games/puzzle" },
  { id: "find-correct-answer", title: "Find Correct Answer", icon: "✅", color: color(4), description: "Mixed questions, quick-fire", href: "/quiz" },
  { id: "matching", title: "Matching Game", icon: "🔗", color: color(0), description: "Match pairs across categories", href: "/games/matching" },
  { id: "coloring", title: "Coloring", icon: "🎨", color: color(1), description: "Fill a picture with color", href: "/games/coloring" },
  { id: "drawing", title: "Drawing", icon: "✏️", color: color(2), description: "Free-draw on a blank canvas", href: "/games/drawing" },
  { id: "tracing-letters", title: "Tracing Letters", icon: "🔤", color: color(3), description: "Trace A to Z", href: "/learn/alphabet/practice" },
  { id: "tracing-numbers", title: "Tracing Numbers", icon: "🔢", color: color(4), description: "Trace 1 to 100", href: "/learn/numbers/practice" },
  { id: "missing-number", title: "Missing Number", icon: "❓", color: color(0), description: "Fill the missing number", href: "/games/missing-number" },
  { id: "odd-or-even", title: "Odd or Even", icon: "🔢", color: color(1), description: "Is it odd or even?", href: "/games/odd-or-even" },
  { id: "times-tables", title: "Times Tables", icon: "✖️", color: color(2), description: "Practice multiplication", href: "/games/times-tables" },
  { id: "math-lab", title: "Math Stories", icon: "🔵", color: color(3), description: "Watch balls explain each sum", href: "/games/math-lab" },
  { id: "word-builder", title: "Word Builder", icon: "🅰️", color: color(4), description: "Which word starts with...?", href: "/games/word-builder" },
  { id: "patterns", title: "Patterns", icon: "🔷", color: color(0), description: "Complete the pattern", href: "/games/patterns" },
  { id: "speed-round", title: "Speed Round", icon: "⏱️", color: color(1), description: "Beat the 60-second clock", href: "/games/speed-round" },
  { id: "simon-pattern", title: "Color Memory", icon: "🔴", color: color(2), description: "Watch and repeat the pattern", href: "/games/simon-pattern" },
  { id: "sound-safari", title: "Sound Safari", icon: "🦁", color: color(3), description: "Listen and find the animal", href: "/games/sound-safari" },
];
