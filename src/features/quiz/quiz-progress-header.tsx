import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-bold">
        <span
          className="rounded-full px-3 py-1 text-white shadow-sm"
          style={{ backgroundColor: accentColor }}
        >
          Question {Math.min(round + 1, totalRounds)} / {totalRounds}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-warning/20 px-3 py-1 text-warning-foreground">
          <Star className="size-4 fill-current" aria-hidden="true" />
          {score}
        </span>
      </div>
      <Progress
        value={(round / totalRounds) * 100}
        indicatorStyle={{ backgroundColor: accentColor }}
        aria-label={`Question ${Math.min(round + 1, totalRounds)} of ${totalRounds}`}
      />
    </div>
  );
}
