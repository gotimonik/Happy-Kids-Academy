"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FeedbackToast } from "@/components/shared/feedback-toast";
import { trackEvent } from "@/lib/analytics/track-event";
import type { QuizQuestion, QuizResult } from "@/types/quiz";
import { CelebrateScreen } from "./celebrate-screen";
import { OptionButton, type OptionState } from "./option-button";
import { QuestionCard } from "./question-card";
import { QuizProgressHeader } from "./quiz-progress-header";
import { useQuizEngine } from "./use-quiz-engine";

export interface QuizSessionProps {
  readonly title: string;
  readonly accentColor: string;
  readonly generateQuestion: () => QuizQuestion;
  readonly totalRounds?: number;
  readonly backHref: string;
  readonly onQuizFinish?: (result: QuizResult) => void;
}

export function QuizSession({
  title,
  accentColor,
  generateQuestion,
  totalRounds = 10,
  backHref,
  onQuizFinish,
}: QuizSessionProps) {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { question, round, score, status, feedbackMessage, answer, restart } = useQuizEngine({
    generateQuestion,
    totalRounds,
    onFinish: (quizResult) => {
      setResult(quizResult);
      trackEvent("quiz_complete", {
        quiz_title: title,
        score: quizResult.score,
        total_rounds: quizResult.totalRounds,
        stars_earned: quizResult.starsEarned,
      });
      onQuizFinish?.(quizResult);
    },
  });

  // A new `question` object arrives each round (including the first) — clear
  // the previous pick so old answer highlighting doesn't linger. Adjusted
  // during render rather than in an effect (React's recommended pattern for
  // resetting state when a prop changes) to avoid an extra render pass.
  const [prevQuestion, setPrevQuestion] = useState(question);
  if (prevQuestion !== question) {
    setPrevQuestion(question);
    setSelectedOption(null);
  }

  if (result) {
    return (
      <CelebrateScreen
        result={result}
        onPlayAgain={() => {
          setResult(null);
          restart();
        }}
        onBackHome={() => router.push(backHref)}
      />
    );
  }

  if (!question) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading question"
        className="flex min-h-64 animate-pulse items-center justify-center rounded-3xl border border-border bg-card"
      />
    );
  }

  function optionState(option: string): OptionState {
    if (status === "answering") return "idle";
    if (option === question?.correctAnswer) return "correct";
    if (option === selectedOption) return "incorrect";
    return "dim";
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sr-only">{title}</h1>
      <QuizProgressHeader round={round} totalRounds={totalRounds} score={score} accentColor={accentColor} />
      <QuestionCard key={round} prompt={question.prompt} accentColor={accentColor} />
      <div className="flex flex-col gap-3">
        {question.options.map((option, index) => (
          <OptionButton
            key={`${round}-${option}`}
            label={option}
            index={index}
            accentColor={accentColor}
            state={optionState(option)}
            disabled={status !== "answering"}
            onSelect={() => {
              setSelectedOption(option);
              answer(option);
            }}
          />
        ))}
      </div>
      <FeedbackToast
        status={status === "correct" ? "correct" : status === "incorrect" ? "incorrect" : null}
        message={feedbackMessage}
      />
    </div>
  );
}
