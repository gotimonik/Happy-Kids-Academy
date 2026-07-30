import { NumberBall } from "./number-ball";

export function AdditionStory({ a, b, step }: { a: number; b: number; step: number }) {
  const total = Math.min(step, a + b);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2 rounded-2xl border-4 border-amber-700/60 bg-amber-50 p-4 dark:bg-amber-950/40">
        {Array.from({ length: total }, (_, i) => (
          <NumberBall key={i} number={i + 1} color={i < a ? "#45AAF2" : "#FF707D"} />
        ))}
      </div>
      <p className="text-sm font-bold text-primary">Balls in box: {total}</p>
    </div>
  );
}
