"use client";

import { useMemo } from "react";
import { categories } from "@/data/categories";
import { createMixedQuestionGenerator } from "@/lib/quiz/generators";
import { useProgressStore } from "@/store/progress-store";
import { QuizSession } from "./quiz-session";

export function MixedQuizClient() {
  const addCoins = useProgressStore((state) => state.addCoins);
  // Created once per quiz session (not once per round!) so its "don't repeat
  // a question until every item's been asked" memory survives across all 10
  // rounds — see `createMixedQuestionGenerator`'s doc comment.
  const generateQuestion = useMemo(() => createMixedQuestionGenerator(categories), []);

  return (
    <QuizSession
      title="Mixed Quiz"
      accentColor="#6C5CE7"
      backHref="/"
      generateQuestion={generateQuestion}
      onQuizFinish={(result) => addCoins(result.score * 2)}
    />
  );
}
