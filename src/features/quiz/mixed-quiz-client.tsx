"use client";

import { categories } from "@/data/categories";
import { createMixedQuestion } from "@/lib/quiz/generators";
import { useProgressStore } from "@/store/progress-store";
import { QuizSession } from "./quiz-session";

export function MixedQuizClient() {
  const addCoins = useProgressStore((state) => state.addCoins);

  return (
    <QuizSession
      title="Mixed Quiz"
      accentColor="#6C5CE7"
      backHref="/"
      generateQuestion={() => createMixedQuestion(categories)}
      onQuizFinish={(result) => addCoins(result.score * 2)}
    />
  );
}
