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
    };
  }),
};
