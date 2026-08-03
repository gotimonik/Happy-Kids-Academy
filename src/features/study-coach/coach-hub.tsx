"use client";

import { MapPin, RefreshCw, Target, Timer } from "lucide-react";
import { StaticLink as Link } from "@/components/shared/static-link";
import { cn } from "@/lib/utils";
import { COACH_GAMES, type CoachGrade } from "@/lib/study-coach/guide-content";
import { useStudyCoachStore } from "@/store/study-coach-store";

const GRADES: CoachGrade[] = [1, 2, 3];

export function CoachHub() {
  const grade = useStudyCoachStore((state) => state.grade);
  const gameIndex = useStudyCoachStore((state) => state.gameIndex);
  const setGrade = useStudyCoachStore((state) => state.setGrade);
  const cycleGame = useStudyCoachStore((state) => state.cycleGame);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold">Study Coach</h1>
      <p className="text-sm text-muted-foreground">Choose the child&apos;s standard</p>

      <div className="grid grid-cols-3 gap-2">
        {GRADES.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGrade(g)}
            className={cn(
              "rounded-2xl px-3 py-3 font-bold shadow-sm transition-colors",
              grade === g ? "bg-[#6F4EAA] text-white" : "bg-card text-foreground",
            )}
          >
            Standard {g}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={cycleGame}
        className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm"
      >
        <span>
          <span className="block text-xs text-muted-foreground">Selected game</span>
          <span className="block font-display font-bold">{COACH_GAMES[gameIndex]}</span>
        </span>
        <RefreshCw className="size-5 text-[#6F4EAA]" aria-hidden="true" />
      </button>

      <div className="grid gap-3">
        <Link
          href="/study-coach/game-variations"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-[#E17055] text-white">
            <Target className="size-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display font-bold">Customize Game</span>
            <span className="block text-sm text-muted-foreground">3 variations + materials</span>
          </span>
        </Link>

        <Link
          href="/study-coach/treasure-hunt"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-[#00B894] text-white">
            <MapPin className="size-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display font-bold">Treasure Hunt</span>
            <span className="block text-sm text-muted-foreground">10 questions + answer key</span>
          </span>
        </Link>

        <Link
          href="/study-coach/daily-routine"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-[#0984E3] text-white">
            <Timer className="size-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display font-bold">30-Minute Routine</span>
            <span className="block text-sm text-muted-foreground">Three 10-minute micro-games</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
