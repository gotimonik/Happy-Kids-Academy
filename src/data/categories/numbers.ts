import type { LearningCategory } from "@/types/category";

const NUMBER_NAMES = [
  "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
  "Nineteen", "Twenty",
] as const;

function detailFor(n: number): string {
  const parity = n % 2 === 0 ? "Even" : "Odd";
  const count = n < 10 ? "●".repeat(n) : `Count to ${n}`;
  return `${parity} • ${count}`;
}

// A handful of numbers carry a fun, real-world meaning worth calling out
// (a dozen, a score, the days in a week, ...). Everything else falls back
// to the generic pattern-based sentences in describeNumber() below.
const SPECIAL_FACTS: Partial<Record<number, string>> = {
  1: "the very first counting number — the starting point for counting anything at all",
  2: "how many shoes make a pair, or how many hands most people have",
  3: "how many sides a triangle has, and how many colors light up a traffic signal",
  4: "how many legs most pets like cats and dogs stand on, and how many seasons make up a year",
  5: "how many fingers are on one hand",
  6: "how many legs an insect has, and how many sides one honeycomb cell has",
  7: "how many days make up one whole week",
  8: "how many legs a spider has",
  9: "one less than ten, and how many innings are played in a full baseball game",
  10: "how many fingers most people have on their two hands, or toes on their two feet",
  11: "how many players take the field for one soccer team",
  12: "a dozen, like a dozen eggs, and also how many months make up a year",
  13: "a baker's dozen — one extra treat tossed in on top of a dozen",
  14: "two whole weeks' worth of days",
  15: "a quarter of an hour, if you're counting minutes on a clock",
  16: "four equal groups of four",
  18: "three equal groups of six, or two equal groups of nine",
  20: 'a "score" — an old-fashioned way of counting by twenties — and also every finger and toe on two hands and two feet together',
  24: "how many hours make up one full day",
  25: "a quarter of a hundred, and also 5 × 5",
  30: "how many days are in many months of the year, like April and June",
  50: "half of a hundred, sometimes called a half-century",
  52: "how many weeks are in a year, and also how many cards are in a full deck",
  60: "how many minutes make an hour, and how many seconds make a minute",
  99: "just one single step away from a hundred",
  100: "a century — 100 years is called a century, and 100 is also ten equal groups of ten",
};

const CLOSING_LINES = [
  (n: number) => `Try counting all the way up to ${n} out loud — it's great practice for learning number order.`,
  (n: number) => `Numbers like ${n} are a good chance to practice counting, adding, and spotting patterns.`,
  (n: number) => `The more you practice counting to ${n} and beyond, the more comfortable numbers will start to feel.`,
  (n: number) => `Spotting patterns in numbers like ${n} is one of the first steps toward becoming a math whiz.`,
  (n: number) => `Getting to know ${n} is one more step on the journey to counting all the way to one hundred.`,
];

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) {
    if (n % d === 0) return false;
  }
  return true;
}

function smallestFactorPair(n: number): [number, number] | null {
  for (let d = 2; d * d <= n; d += 1) {
    if (n % d === 0) return [d, n / d];
  }
  return null;
}

function isPerfectSquare(n: number): number | null {
  const root = Math.sqrt(n);
  return Number.isInteger(root) ? root : null;
}

function positionSentence(n: number): string {
  if (n === 1) {
    return "The number 1 is where counting begins — every number after it is built by adding one more.";
  }
  if (n === 100) {
    return "The number 100 comes right after 99, marking a full hundred and the top of this counting chart.";
  }
  return `The number ${n} comes right after ${n - 1} and right before ${n + 1} when you're counting in order.`;
}

function paritySentence(n: number): string {
  if (n % 2 === 0) {
    const half = n / 2;
    return `${n} is an even number, which means it can be split into two equal groups of ${half}, with nothing left over.`;
  }
  return `${n} is an odd number, so if you try to split it into two equal groups, one will always end up with one extra.`;
}

function factorSentence(n: number): string {
  if (n === 1) {
    return "It's a special number too: multiplying anything by 1 always leaves it exactly the same.";
  }
  if (isPrime(n)) {
    return `${n} is also a prime number — the only way to multiply two whole numbers together and land on ${n} is 1 × ${n}.`;
  }
  const pair = smallestFactorPair(n);
  const square = isPerfectSquare(n);
  if (square !== null) {
    return `${n} is a perfect square, since ${square} × ${square} = ${n}${pair ? `, and you can also make it as ${pair[0]} × ${pair[1]}` : ""}.`;
  }
  if (pair) {
    return `You can also make ${n} by multiplying ${pair[0]} × ${pair[1]}.`;
  }
  return `${n} shows up often once you start practicing addition and multiplication with bigger numbers.`;
}

function specialSentence(n: number): string {
  const special = SPECIAL_FACTS[n];
  if (special) {
    return `Beyond the math, ${n} has a fun everyday meaning: it's ${special}.`;
  }
  const nearestTen = Math.round(n / 10) * 10;
  if (nearestTen === n) {
    return `${n} is a nice, round number — a nifty multiple of ten that's easy to count up to by tens.`;
  }
  const distance = Math.abs(n - nearestTen);
  return `${n} sits just ${distance} away from the round number ${nearestTen}, which can make it easier to picture on a number line.`;
}

function describeNumber(n: number): string {
  const closing = CLOSING_LINES[n % CLOSING_LINES.length]!(n);
  return [positionSentence(n), paritySentence(n), factorSentence(n), specialSentence(n), closing].join(" ");
}

export const numbersCategory: LearningCategory = {
  slug: "numbers",
  icon: "123",
  title: "Numbers",
  subtitle: "1–100 • counting • odd & even",
  color: "#45AAF2",
  trace: true,
  items: Array.from({ length: 100 }, (_, index) => {
    const n = index + 1;
    const label = n <= 20 ? (NUMBER_NAMES[n - 1] ?? `Number ${n}`) : `Number ${n}`;
    return {
      id: `numbers-${n}`,
      symbol: String(n),
      label,
      detail: detailFor(n),
      speech: label,
      longDescription: describeNumber(n),
    };
  }),
};
