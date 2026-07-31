"use client";

import { FeedbackToast } from "@/components/shared/feedback-toast";
import { useBalloonPop } from "./use-balloon-pop";

export function BalloonPopGame() {
  const { balloons, target, pops, feedback, pop } = useBalloonPop();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-muted-foreground">Popped: {pops}</p>
        <div className="rounded-full bg-[#FF5B6F] px-5 py-2 text-lg font-bold text-white shadow-md">
          Pop letter {target}
        </div>
      </div>

      <div
        className="relative h-[28rem] @container overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-sky-100 to-sky-50 dark:from-slate-800 dark:to-slate-900"
        aria-label="Balloon pop play area"
      >
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            type="button"
            onClick={() => pop(balloon.id)}
            aria-label={`Balloon with the letter ${balloon.letter}`}
            className="absolute flex size-[clamp(2.75rem,9cqw,4rem)] -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full text-[clamp(1rem,3.5cqw,1.5rem)] font-black text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95"
            style={{
              left: `${balloon.x}%`,
              top: `${balloon.y}%`,
              backgroundColor: balloon.color,
            }}
          >
            {balloon.letter}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">Tap only the correct letter</p>
      <FeedbackToast status={feedback?.status ?? null} message={feedback?.message ?? ""} />
    </div>
  );
}
