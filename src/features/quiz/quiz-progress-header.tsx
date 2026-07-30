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
    <div className="flex items-center justify-between text-sm font-bold">
      <span className="text-muted-foreground">
        Question {Math.min(round + 1, totalRounds)} / {totalRounds}
      </span>
      <span style={{ color: accentColor }}>Score {score}</span>
    </div>
  );
}
