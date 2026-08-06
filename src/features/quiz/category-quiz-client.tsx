"use client";

import { useDisplayCategory } from "@/lib/categories/use-display-category";
import { createCategoryQuestion } from "@/lib/quiz/generators";
import { useProgressStore } from "@/store/progress-store";
import type { LearningCategory } from "@/types/category";
import { QuizSession } from "./quiz-session";

export function CategoryQuizClient({ category }: { category: LearningCategory }) {
  const recordQuizResult = useProgressStore((state) => state.recordQuizResult);
  const displayCategory = useDisplayCategory(category);

  return (
    <QuizSession
      title={`${category.title} quiz`}
      accentColor={category.color}
      backHref={`/learn/${category.slug}`}
      generateQuestion={() => createCategoryQuestion(displayCategory)}
      onQuizFinish={(result) => recordQuizResult(category.slug, result.score, result.totalRounds)}
    />
  );
}
