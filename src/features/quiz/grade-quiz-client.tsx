"use client";

import { useMemo } from "react";
import {
  createMissingNumberQuestionGenerator,
  createOddOrEvenQuestionGenerator,
  createPatternsQuestionGenerator,
  createTimesTablesQuestionGenerator,
  createWordBuilderQuestionGenerator,
} from "@/lib/quiz/generators";
import { useProgressStore } from "@/store/progress-store";
import type { CategorySlug } from "@/types/category";
import { QuizSession } from "./quiz-session";

const GRADE_GAME_GENERATOR_FACTORIES = {
  "missing-number": createMissingNumberQuestionGenerator,
  "odd-or-even": createOddOrEvenQuestionGenerator,
  "times-tables": createTimesTablesQuestionGenerator,
  "word-builder": createWordBuilderQuestionGenerator,
  patterns: createPatternsQuestionGenerator,
} as const;

export type GradeGameId = keyof typeof GRADE_GAME_GENERATOR_FACTORIES;

export function GradeQuizClient({
  title,
  accentColor,
  gameId,
  /** Which category's best-score/stars this grade game counts toward, matching the Android app. */
  recordAgainstCategory,
  backHref = "/games",
  /** Times Tables only: restrict every question to just this number's table (e.g. only "7 × ?" facts, one per multiplier 1–10), instead of drawing from every table 2–10. Ignored for every other `gameId`. */
  tableNumber,
}: {
  title: string;
  accentColor: string;
  gameId: GradeGameId;
  recordAgainstCategory: CategorySlug;
  /** Where "Back to Home" on the results screen goes — defaults to the games list. The Times Tables picker (`/games/times-tables`) overrides this so a scoped or mixed practice session returns to the picker instead. */
  backHref?: string;
  tableNumber?: number;
}) {
  const recordQuizResult = useProgressStore((state) => state.recordQuizResult);
  // Created once per quiz session (not once per round!) so its "don't repeat
  // a question until every possibility's been asked" memory survives across
  // all 10 rounds — see `createCategoryQuestionGenerator`'s doc comment in
  // generators.ts for why a fresh instance every round would defeat the point.
  const generateQuestion = useMemo(
    () =>
      gameId === "times-tables"
        ? createTimesTablesQuestionGenerator(tableNumber)
        : GRADE_GAME_GENERATOR_FACTORIES[gameId](),
    [gameId, tableNumber],
  );

  return (
    <QuizSession
      title={title}
      accentColor={accentColor}
      backHref={backHref}
      generateQuestion={generateQuestion}
      onQuizFinish={(result) =>
        recordQuizResult(recordAgainstCategory, result.score, result.totalRounds)
      }
    />
  );
}
