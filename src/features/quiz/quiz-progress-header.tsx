"use client";

import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/lib/i18n/use-translation";

export function QuizProgressHeader({
  round,
  totalRounds,
  score,
  accentColor,
}: {
  round: number;
  totalRounds: number;
  score: number;
  accentColor: string;
}) {
  const t = useTranslation();
  const questionLabel = t("quiz.questionOf", {
    current: Math.min(round + 1, totalRounds),
    total: totalRounds,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-bold">
        <span
          className="rounded-full px-3 py-1 text-white shadow-sm"
          style={{ backgroundColor: accentColor }}
        >
          {questionLabel}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-warning/20 px-3 py-1 text-warning-foreground">
          <Star className="size-4 fill-current" aria-hidden="true" />
          {score}
        </span>
      </div>
      <Progress
        value={(round / totalRounds) * 100}
        indicatorStyle={{ backgroundColor: accentColor }}
        aria-label={questionLabel}
      />
    </div>
  );
}
