import type { LearningCategory } from "@/types/category";
import type { LearningItem as Item } from "@/types/item";

let autoId = 0;
function fact(expression: string, answer: string, type: string): Item {
  autoId += 1;
  return {
    id: `math-${autoId}`,
    label: answer,
    detail: type,
    speech: `${expression} equals ${answer}`,
  };
}

const items: Item[] = [];
for (let i = 1; i <= 10; i += 1) {
  items.push(fact(`${i} + ${i}`, String(i + i), "Addition"));
  items.push(fact(`${i + 5} − ${i}`, "5", "Subtraction"));
}
for (let i = 1; i <= 10; i += 1) {
  items.push(fact(`${i} × 2`, String(i * 2), "Multiplication"));
}
for (let i = 1; i <= 10; i += 1) {
  items.push(fact(`${i * 2} ÷ 2`, String(i), "Division"));
}
items.push(fact("8 > 3", "Greater than", "Comparison"));
items.push(fact("2 < 7", "Less than", "Comparison"));
items.push(fact("5 = 5", "Equal to", "Comparison"));

// `symbol` for math facts is the expression itself (shown large on the flashcard).
const withExpressions: Item[] = items.map((item, index) => {
  const expression = item.speech.split(" equals ")[0] ?? item.label;
  return { ...item, id: `math-${index + 1}`, symbol: expression };
});

export const mathCategory: LearningCategory = {
  slug: "math",
  icon: "+ −",
  title: "Math",
  subtitle: "Add • subtract • multiply • divide",
  color: "#37C183",
  trace: false,
  items: withExpressions,
};
