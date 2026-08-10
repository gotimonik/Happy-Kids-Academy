import type { LearningCategory } from "@/types/category";
import type { LearningItem } from "@/types/item";
import type { QuizQuestion } from "@/types/quiz";
import { alphabetCategory } from "@/data/categories/alphabet";
import { createNoRepeatGenerator } from "./no-repeat";
import { buildOptions, pickDistractors } from "./utils";

/** The glyph actually shown on screen for an item's picture-identification prompt. */
function displayGlyph(item: LearningItem): string {
  return item.symbol || item.icon || "";
}

/**
 * A standard "identify this card" question for one specific item in a
 * category — the shared core of both the per-category quiz and Mixed Quiz,
 * which only differ in how they pick *which* item/category to ask about.
 *
 * Two content classes need special handling beyond a plain icon-vs-label quiz:
 *
 * 1. Colors: every item shares the same "●" symbol, so the symbol alone can't
 *    be the prompt — it has to be rendered *in the item's actual color*
 *    (`promptColor`), otherwise every question shows an uncolored (black)
 *    dot regardless of which color is being tested.
 * 2. Categories with reused emoji (e.g. Wolf/Hyena/Jackal all render 🐺 in
 *    Animals; several Fruits/Vegetables pairs share a glyph too): if a
 *    distractor happens to render the exact same glyph as the correct
 *    answer, the question becomes unanswerable from the picture alone —
 *    the child is guessing between two options that look identical. We
 *    exclude same-glyph items from the distractor pool so the three shown
 *    options are always visually distinguishable from each other.
 */
function buildQuestionForItem(category: LearningCategory, item: LearningItem): QuizQuestion {
  const items = category.items;

  if (item.visualColor) {
    const pool = items.map((candidate) => candidate.label);
    const distractors = pickDistractors(pool, item.label, 2);
    return {
      prompt: "What color is this?",
      promptColor: item.visualColor,
      correctAnswer: item.label,
      options: buildOptions(item.label, distractors),
    };
  }

  const glyph = displayGlyph(item);
  const distractorPool = items
    .filter((candidate) => candidate.id !== item.id && displayGlyph(candidate) !== glyph)
    .map((candidate) => candidate.label);
  const distractors = pickDistractors(distractorPool, item.label, 2);

  return {
    prompt: glyph || "Find the answer",
    // Some items (a few fruits/vegetables with no real emoji) show a small
    // illustration instead of a text glyph — see `LearningItem.image`.
    promptImage: item.image,
    correctAnswer: item.label,
    options: buildOptions(item.label, distractors),
  };
}

/**
 * One question generator per quiz session for a single category — draws
 * every item once (in shuffled order) before repeating any of them, so a
 * category with at least as many items as the quiz has rounds (the common
 * case) never repeats a question at all. Create one instance per quiz
 * session (e.g. via `useMemo`) and keep calling it round after round;
 * calling this factory itself fresh each round would throw the "no repeat"
 * memory away and defeat the point.
 */
export function createCategoryQuestionGenerator(category: LearningCategory): () => QuizQuestion {
  if (category.items.length === 0) {
    throw new Error(`Category "${category.slug}" has no items`);
  }
  return createNoRepeatGenerator(category.items, (item) => buildQuestionForItem(category, item));
}

/**
 * One question generator per Mixed Quiz session, drawing from every item in
 * every category pooled together — hundreds of possible questions, so a
 * 10-round quiz essentially never repeats one. Same "create once, call every
 * round" rule as `createCategoryQuestionGenerator`.
 */
export function createMixedQuestionGenerator(categories: readonly LearningCategory[]): () => QuizQuestion {
  const pool = categories.flatMap((category) =>
    category.items.map((item) => ({ category, item })),
  );
  if (pool.length === 0) {
    throw new Error("No categories available for the mixed quiz");
  }
  return createNoRepeatGenerator(pool, ({ category, item }) => buildQuestionForItem(category, item));
}

/** "1, 2, __, 4" style sequence with a missing middle number, for one specific starting number. */
function buildMissingNumberQuestion(start: number): QuizQuestion {
  const answer = start + 2;
  return {
    prompt: `${start}, ${start + 1}, __, ${start + 3}`,
    correctAnswer: String(answer),
    options: buildOptions(String(answer), [String(answer - 1), String(answer + 1)]),
  };
}

const MISSING_NUMBER_STARTS = Array.from({ length: 90 }, (_, index) => index + 1);

/** One generator per quiz session — see `createCategoryQuestionGenerator` for why this has to be created once and reused across rounds. */
export function createMissingNumberQuestionGenerator(): () => QuizQuestion {
  return createNoRepeatGenerator(MISSING_NUMBER_STARTS, buildMissingNumberQuestion);
}

/** "N is..." Even / Odd question, for one specific N. */
function buildOddOrEvenQuestion(n: number): QuizQuestion {
  const isEven = n % 2 === 0;
  const correctAnswer = isEven ? "Even" : "Odd";
  const wrongAnswer = isEven ? "Odd" : "Even";
  return {
    prompt: `${n} is...`,
    correctAnswer,
    options: buildOptions(correctAnswer, [wrongAnswer, "Neither"]),
  };
}

const ODD_OR_EVEN_NUMBERS = Array.from({ length: 100 }, (_, index) => index + 1);

/** One generator per quiz session — see `createCategoryQuestionGenerator` for why this has to be created once and reused across rounds. */
export function createOddOrEvenQuestionGenerator(): () => QuizQuestion {
  return createNoRepeatGenerator(ODD_OR_EVEN_NUMBERS, buildOddOrEvenQuestion);
}

/** "a × b = ?" multiplication fact, for one specific (a, b) pair. */
function buildTimesTablesQuestion([a, b]: readonly [number, number]): QuizQuestion {
  const answer = a * b;
  return {
    prompt: `${a} × ${b} = ?`,
    correctAnswer: String(answer),
    options: buildOptions(String(answer), [String(answer + a), String(Math.max(1, answer - a))]),
  };
}

const TIMES_TABLES_PAIRS: ReadonlyArray<readonly [number, number]> = Array.from(
  { length: 9 },
  (_, aIndex) => aIndex + 2,
).flatMap((a) => Array.from({ length: 10 }, (_, bIndex) => [a, bIndex + 1] as const));

/** One generator per quiz session — see `createCategoryQuestionGenerator` for why this has to be created once and reused across rounds. */
export function createTimesTablesQuestionGenerator(): () => QuizQuestion {
  return createNoRepeatGenerator(TIMES_TABLES_PAIRS, buildTimesTablesQuestion);
}

/** "Which word starts with X?" for one specific letter index — always drawn from the Alphabet category. */
function buildWordBuilderQuestion(letterIndex: number): QuizQuestion {
  const items = alphabetCategory.items;
  const item = items[letterIndex];
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

const WORD_BUILDER_LETTER_INDEXES = Array.from({ length: 26 }, (_, index) => index);

/** One generator per quiz session — see `createCategoryQuestionGenerator` for why this has to be created once and reused across rounds. */
export function createWordBuilderQuestionGenerator(): () => QuizQuestion {
  return createNoRepeatGenerator(WORD_BUILDER_LETTER_INDEXES, buildWordBuilderQuestion);
}

/** Arithmetic sequence missing its last term, for one specific (start, step) pair. */
function buildPatternsQuestion([start, step]: readonly [number, number]): QuizQuestion {
  const answer = start + step * 3;
  return {
    prompt: `${start}, ${start + step}, ${start + step * 2}, __`,
    correctAnswer: String(answer),
    options: buildOptions(String(answer), [String(answer - step), String(answer + step)]),
  };
}

const PATTERNS_PAIRS: ReadonlyArray<readonly [number, number]> = Array.from(
  { length: 10 },
  (_, index) => index + 1,
).flatMap((start) => [
  [start, 2],
  [start, 5],
] as const);

/** One generator per quiz session — see `createCategoryQuestionGenerator` for why this has to be created once and reused across rounds. */
export function createPatternsQuestionGenerator(): () => QuizQuestion {
  return createNoRepeatGenerator(PATTERNS_PAIRS, buildPatternsQuestion);
}
