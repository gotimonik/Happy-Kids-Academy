import type { LearningCategory } from "@/types/category";
import type { QuizQuestion } from "@/types/quiz";
import { alphabetCategory } from "@/data/categories/alphabet";
import { buildOptions, pickDistractors } from "./utils";

/** A standard "identify this card" question, drawn from a single category. */
export function createCategoryQuestion(category: LearningCategory): QuizQuestion {
  const items = category.items;
  const item = items[Math.floor(Math.random() * items.length)];
  if (!item) throw new Error(`Category "${category.slug}" has no items`);

  const prompt = item.symbol || item.icon || "Find the answer";
  const pool = items.map((candidate) => candidate.label);
  const distractors = pickDistractors(pool, item.label, 2);

  return {
    prompt,
    correctAnswer: item.label,
    options: buildOptions(item.label, distractors),
  };
}

/** Draws a question from a random category — powers the Mixed Quiz. */
export function createMixedQuestion(categories: readonly LearningCategory[]): QuizQuestion {
  const category = categories[Math.floor(Math.random() * categories.length)];
  if (!category) throw new Error("No categories available for the mixed quiz");
  return createCategoryQuestion(category);
}

/** "1, 2, __, 4" style sequence with a missing middle number. */
export function createMissingNumberQuestion(): QuizQuestion {
  const start = 1 + Math.floor(Math.random() * 90);
  const answer = start + 2;
  return {
    prompt: `${start}, ${start + 1}, __, ${start + 3}`,
    correctAnswer: String(answer),
    options: buildOptions(String(answer), [String(answer - 1), String(answer + 1)]),
  };
}

/** "N is..." Even / Odd question. */
export function createOddOrEvenQuestion(): QuizQuestion {
  const n = 1 + Math.floor(Math.random() * 100);
  const isEven = n % 2 === 0;
  const correctAnswer = isEven ? "Even" : "Odd";
  const wrongAnswer = isEven ? "Odd" : "Even";
  return {
    prompt: `${n} is...`,
    correctAnswer,
    options: buildOptions(correctAnswer, [wrongAnswer, "Neither"]),
  };
}

/** "a × b = ?" multiplication fact. */
export function createTimesTablesQuestion(): QuizQuestion {
  const a = 2 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 10);
  const answer = a * b;
  return {
    prompt: `${a} × ${b} = ?`,
    correctAnswer: String(answer),
    options: buildOptions(String(answer), [String(answer + a), String(Math.max(1, answer - a))]),
  };
}

/** "Which word starts with X?" — always drawn from the Alphabet category. */
export function createWordBuilderQuestion(): QuizQuestion {
  const items = alphabetCategory.items;
  const index = Math.floor(Math.random() * 26);
  const item = items[index];
  if (!item || !item.symbol) throw new Error("Alphabet data is missing a letter");

  const letterCode = item.symbol.charCodeAt(0) - "A".charCodeAt(0);
  const wrong1 = items[(letterCode + 5) % 26];
  const wrong2 = items[(letterCode + 11) % 26];

  return {
    prompt: `Which word starts with ${item.symbol}?`,
    correctAnswer: item.label,
    options: buildOptions(item.label, [wrong1?.label ?? "", wrong2?.label ?? ""]),
  };
}

/** Arithmetic sequence with a step of 2 or 5, missing the last term. */
export function createPatternsQuestion(): QuizQuestion {
  const start = 1 + Math.floor(Math.random() * 10);
  const step = Math.random() < 0.5 ? 2 : 5;
  const answer = start + step * 3;
  return {
    prompt: `${start}, ${start + step}, ${start + step * 2}, __`,
    correctAnswer: String(answer),
    options: buildOptions(String(answer), [String(answer - step), String(answer + step)]),
  };
}
