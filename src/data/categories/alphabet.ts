import type { LearningCategory } from "@/types/category";

const WORDS = [
  "Apple", "Ball", "Cat", "Dog", "Elephant", "Fish", "Grapes", "House", "Ice cream", "Jug",
  "Kite", "Lion", "Mango", "Nest", "Orange", "Parrot", "Queen", "Rabbit", "Sun", "Tiger",
  "Umbrella", "Van", "Watch", "Xylophone", "Yak", "Zebra",
] as const;

const ICONS = [
  "🍎", "⚽", "🐱", "🐶", "🐘", "🐟", "🍇", "🏠", "🍦", "🏺",
  "🪁", "🦁", "🥭", "🪺", "🍊", "🦜", "👸", "🐇", "☀️", "🐯",
  "☂️", "🚐", "⌚", "🎵", "🐂", "🦓",
] as const;

export const alphabetCategory: LearningCategory = {
  slug: "alphabet",
  icon: "ABC",
  title: "Alphabet",
  subtitle: "A–Z • words • pronunciation",
  color: "#FF707D",
  trace: true,
  items: WORDS.map((word, index) => {
    const letter = String.fromCharCode(65 + index);
    return {
      id: `alphabet-${letter.toLowerCase()}`,
      symbol: letter,
      icon: ICONS[index],
      label: word,
      detail: `Pronunciation: ${letter}`,
      speech: `${letter} for ${word}`,
    };
  }),
};
