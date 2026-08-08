import type { LearningCategory } from "@/types/category";
import { namedItems } from "./_helpers";

const NAMES = [
  "Parrot", "Peacock", "Sparrow", "Pigeon", "Crow", "Eagle", "Owl", "Duck", "Hen", "Rooster",
  "Swan", "Flamingo", "Kingfisher", "Woodpecker", "Penguin", "Ostrich", "Emu", "Turkey", "Goose",
  "Cuckoo", "Nightingale", "Myna", "Vulture", "Hawk", "Crane", "Stork", "Pelican", "Seagull",
  "Kiwi", "Hummingbird",
] as const;

// Every bird has its own distinct icon — no two entries share a picture.
// Unicode only has dedicated emoji for a fairly small set of specific
// birds, so several of these use a small hand-drawn illustration instead
// (see IMAGE_OVERRIDES below) rather than an unrelated glyph that doesn't
// actually look like a bird.
const ICONS = [
  "🦜", "🦚", "🐦", "🕊️", "⚫", "🦅", "🦉", "🦆", "🐔", "🐓",
  "🦢", "🦩", "🐤", "🐥", "🐧", "🦤", "🥚", "🦃", "🪿", "🕐",
  "🎵", "🐣", "🍖", "🎯", "🦵", "👶", "🐟", "🌊", "🥝", "🌺",
] as const;

// For the birds that don't have a real Unicode emoji (a plain circle, a
// clock, a baby, a fish, ... don't actually look like a bird), a small
// hand-drawn illustration is used instead wherever the picture is shown —
// see src/types/item.ts. Sparrow, Eagle, Owl, Duck, and the rest keep
// their real bird emoji.
const IMAGE_OVERRIDES: Partial<Record<(typeof NAMES)[number], string>> = {
  Crow: "/images/produce/crow.svg",
  Kingfisher: "/images/produce/kingfisher.svg",
  Woodpecker: "/images/produce/woodpecker.svg",
  Ostrich: "/images/produce/ostrich.svg",
  Emu: "/images/produce/emu.svg",
  Cuckoo: "/images/produce/cuckoo.svg",
  Nightingale: "/images/produce/nightingale.svg",
  Myna: "/images/produce/myna.svg",
  Vulture: "/images/produce/vulture.svg",
  Hawk: "/images/produce/hawk.svg",
  Crane: "/images/produce/crane.svg",
  Stork: "/images/produce/stork.svg",
  Pelican: "/images/produce/pelican.svg",
  Seagull: "/images/produce/seagull.svg",
  Kiwi: "/images/produce/kiwi-bird.svg",
  Hummingbird: "/images/produce/hummingbird.svg",
};
const IMAGES = NAMES.map((name) => IMAGE_OVERRIDES[name]);

export const birdsCategory: LearningCategory = {
  slug: "birds",
  icon: "🦜",
  title: "Birds",
  subtitle: "30 birds with pictures",
  color: "#0984E3",
  trace: false,
  items: namedItems("birds", NAMES, ICONS, "Bird", undefined, IMAGES),
};
