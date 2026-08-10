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
}: {
  title: string;
  accentColor: string;
  gameId: GradeGameId;
  recordAgainstCategory: CategorySlug;
}) {
  const recordQuizResult = useProgressStore((state) => state.recordQuizResult);
  // Created once per quiz session (not once per round!) so its "don't repeat
  // a question until every possibility's been asked" memory survives across
  // all 10 rounds — see `createCategoryQuestionGenerator`'s doc comment in
  // generators.ts for why a fresh instance every round would defeat the point.
  const generateQuestion = useMemo(() => GRADE_GAME_GENERATOR_FACTORIES[gameId](), [gameId]);

  return (
    <QuizSession
      title={title}
      accentColor={accentColor}
      backHref="/games"
      generateQuestion={generateQuestion}
      onQuizFinish={(result) =>
        recordQuizResult(recordAgainstCategory, result.score, result.totalRounds)
      }
    />
  );
}
