"use client";

import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiOverlay } from "@/components/shared/confetti-overlay";
import { FeedbackToast } from "@/components/shared/feedback-toast";
import { OptionButton } from "@/features/quiz/option-button";
import { QuestionCard } from "@/features/quiz/question-card";
import { categories } from "@/data/categories";
import { createMixedQuestion } from "@/lib/quiz/generators";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/store/progress-store";
import { useSpeedRound } from "./use-speed-round";

const ACCENT = "#EE6352";

export function SpeedRoundGame() {
  const addCoins = useProgressStore((state) => state.addCoins);
  const { question, score, answered, timeLeft, durationSeconds, status, answer, restart } = useSpeedRound({
    generateQuestion: () => createMixedQuestion(categories),
    onFinish: (finalScore) => {
      addCoins(finalScore * 2);
      trackEvent("game_complete", { game_id: "speed-round", score: finalScore, answered });
    },
  });

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
        <Button type="button" size="kid" onClick={restart}>
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

      <QuestionCard prompt={question.prompt} />
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <OptionButton
            key={option}
            label={option}
            accentColor={ACCENT}
            disabled={status !== "answering"}
            onSelect={() => answer(option)}
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
