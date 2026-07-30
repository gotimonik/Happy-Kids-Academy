"use client";

import { Clock, Coins, ListChecks, Star, Target, Award } from "lucide-react";
import { categories } from "@/data/categories";
import { selectBadges, useProgressStore } from "@/store/progress-store";
import { ProgressRow } from "./progress-row";
import { StarsByCategoryChart } from "./stars-by-category-chart";

export function ParentDashboard() {
  const timeSeconds = useProgressStore((state) => state.timeSeconds);
  const lessonsCompleted = useProgressStore((state) => state.lessonsCompleted);
  const bestScoreByCategory = useProgressStore((state) => state.bestScoreByCategory);
  const coins = useProgressStore((state) => state.coins);
  const badges = useProgressStore(selectBadges);

  const topicsAttempted = Object.values(bestScoreByCategory).filter((score) => (score ?? 0) > 0).length;
  const quizScoreTotal = Object.values(bestScoreByCategory).reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">Learning summary</h1>

      <div className="grid gap-3 sm:grid-cols-2">
        <ProgressRow icon={<Clock />} label="Time spent" value={`${Math.round(timeSeconds / 60)} min`} />
        <ProgressRow icon={<ListChecks />} label="Completed lessons" value={String(lessonsCompleted)} />
        <ProgressRow
          icon={<Target />}
          label="Topics attempted"
          value={`${topicsAttempted} / ${categories.length}`}
        />
        <ProgressRow icon={<Star />} label="Quiz score total" value={String(quizScoreTotal)} />
        <ProgressRow icon={<Coins />} label="Coins earned" value={String(coins)} />
        <ProgressRow icon={<Award />} label="Badges" value={String(badges)} />
      </div>

      <StarsByCategoryChart />
    </div>
  );
}
