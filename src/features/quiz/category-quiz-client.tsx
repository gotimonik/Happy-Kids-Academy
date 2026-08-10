"use client";

import { useMemo } from "react";
import { useDisplayCategory } from "@/lib/categories/use-display-category";
import { createCategoryQuestionGenerator } from "@/lib/quiz/generators";
import { useProgressStore } from "@/store/progress-store";
import type { LearningCategory } from "@/types/category";
import { QuizSession } from "./quiz-session";

export function CategoryQuizClient({ category }: { category: LearningCategory }) {
  const recordQuizResult = useProgressStore((state) => state.recordQuizResult);
  const displayCategory = useDisplayCategory(category);
  // Created once per quiz session (not once per round!) so its "don't repeat
  // an item until every item's been asked" memory survives across all 10
  // rounds — see `createCategoryQuestionGenerator`'s doc comment.
  const generateQuestion = useMemo(
    () => createCategoryQuestionGenerator(displayCategory),
    [displayCategory],
  );

  return (
    <QuizSession
      title={`${category.title} quiz`}
      accentColor={category.color}
      backHref={`/learn/${category.slug}`}
      generateQuestion={generateQuestion}
      onQuizFinish={(result) => recordQuizResult(category.slug, result.score, result.totalRounds)}
    />
  );
}
