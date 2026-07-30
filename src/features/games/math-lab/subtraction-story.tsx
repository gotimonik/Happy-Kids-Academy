import { NumberBall } from "./number-ball";

export function SubtractionStory({ a, b, step }: { a: number; b: number; step: number }) {
  const removed = Math.min(step, b);
  const left = a - removed;
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
      <div className="flex flex-wrap justify-center gap-2 rounded-2xl border-4 border-amber-700/60 bg-amber-50 p-4 dark:bg-amber-950/40">
        {Array.from({ length: left }, (_, i) => (
          <NumberBall key={i} number={i + 1} color="#45AAF2" />
        ))}
      </div>
      {removed > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: removed }, (_, i) => (
            <span key={i} className="relative">
              <NumberBall number={a - i} color="#B2BEC3" />
              <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-lg font-black text-destructive">
                ×
              </span>
            </span>
          ))}
        </div>
      )}
      <p className="text-sm font-bold text-primary">{left} balls left</p>
    </div>
  );
}
