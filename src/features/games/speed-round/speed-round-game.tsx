"use client";

import { useMemo, useState } from "react";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiOverlay } from "@/components/shared/confetti-overlay";
import { FeedbackToast } from "@/components/shared/feedback-toast";
import { OptionButton, type OptionState } from "@/features/quiz/option-button";
import { QuestionCard } from "@/features/quiz/question-card";
import { categories } from "@/data/categories";
import { createMixedQuestionGenerator } from "@/lib/quiz/generators";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/store/progress-store";
import { useSpeedRound } from "./use-speed-round";

const ACCENT = "#EE6352";

export function SpeedRoundGame() {
  const addCoins = useProgressStore((state) => state.addCoins);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // Created once per game session (not once per round!) so its "don't repeat
  // a question until every item's been asked" memory survives the whole
  // 60-second round, however many questions that ends up being — see
  // `createMixedQuestionGenerator`'s doc comment in generators.ts.
  const generateQuestion = useMemo(() => createMixedQuestionGenerator(categories), []);
  const { question, score, answered, timeLeft, durationSeconds, status, answer, restart } = useSpeedRound({
    generateQuestion,
    onFinish: (finalScore) => {
      addCoins(finalScore * 2);
      trackEvent("game_complete", { game_id: "speed-round", score: finalScore, answered });
    },
  });

  // A new `question` arrives each round (including the first) — clear the
  // previous pick so old answer highlighting doesn't linger. Adjusted during
  // render rather than in an effect (React's recommended pattern for
  // resetting state when a prop changes) to avoid an extra render pass.
  const [prevQuestion, setPrevQuestion] = useState(question);
  if (prevQuestion !== question) {
    setPrevQuestion(question);
    setSelectedOption(null);
  }

  const isLowTime = timeLeft <= 10;

  if (status === "finished") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
        <ConfettiOverlay />
        <h2 className="font-display text-3xl font-bold">Time&apos;s up!</h2>
        <p className="text-lg font-bold text-primary">
          You answered {score} out of {answered} correctly
        </p>
        <p className="text-sm font-bold text-[#E17055]">+{score * 2} coins</p>
        <Button type="button" size="md" onClick={restart}>
          Play Again
        </Button>
      </div>
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
      <div className="flex items-center justify-between text-sm font-bold">
        <span className="text-muted-foreground">Score {score}</span>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-white",
            isLowTime ? "bg-destructive animate-pulse" : "bg-[#EE6352]",
          )}
          aria-live="polite"
        >
          <Timer className="size-4" aria-hidden="true" />
          {timeLeft}s
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-[#EE6352] transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / durationSeconds) * 100}%` }}
        />
      </div>

      <QuestionCard key={answered} prompt={question.prompt} accentColor={ACCENT} />
      <div className="flex flex-col gap-3">
        {question.options.map((option, index) => (
          <OptionButton
            key={`${answered}-${option}`}
            label={option}
            index={index}
            accentColor={ACCENT}
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
        message={status === "correct" ? "Nice!" : "Keep going!"}
      />
    </div>
  );
}
