"use client";

import {
  createMissingNumberQuestion,
  createOddOrEvenQuestion,
  createPatternsQuestion,
  createTimesTablesQuestion,
  createWordBuilderQuestion,
} from "@/lib/quiz/generators";
import { useProgressStore } from "@/store/progress-store";
import type { CategorySlug } from "@/types/category";
import { QuizSession } from "./quiz-session";

const GRADE_GAME_GENERATORS = {
  "missing-number": createMissingNumberQuestion,
  "odd-or-even": createOddOrEvenQuestion,
  "times-tables": createTimesTablesQuestion,
  "word-builder": createWordBuilderQuestion,
  patterns: createPatternsQuestion,
} as const;

export type GradeGameId = keyof typeof GRADE_GAME_GENERATORS;

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
  const generateQuestion = GRADE_GAME_GENERATORS[gameId];
  const recordQuizResult = useProgressStore((state) => state.recordQuizResult);

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
