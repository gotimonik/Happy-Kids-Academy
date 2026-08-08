"use client";

import { Award, Clock, Coins, ListChecks, Star, Target } from "lucide-react";
import { categories } from "@/data/categories";
import { RewardStatCard } from "@/features/rewards/reward-stat-card";
import { Skeleton } from "@/components/shared/skeleton-card";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { heroGradient } from "@/lib/ui/tile-gradient";
import { selectBadges, useProgressStore } from "@/store/progress-store";
import { StarsByCategoryChart } from "./stars-by-category-chart";

/** Renders `125` as `2h 5m` and anything under an hour as e.g. `42 min`, so a
 * parent skimming the summary reads a natural duration instead of a raw
 * (and, after a few sessions, three-digit) minute count. */
function formatTimeSpent(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

function ParentDashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading learning summary" className="flex flex-col gap-6">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  );
}

export function ParentDashboard() {
  const timeSeconds = useProgressStore((state) => state.timeSeconds);
  const lessonsCompleted = useProgressStore((state) => state.lessonsCompleted);
  const bestScoreByCategory = useProgressStore((state) => state.bestScoreByCategory);
  const coins = useProgressStore((state) => state.coins);
  const badges = useProgressStore(selectBadges);
  const hydrated = useStoreHydrated(useProgressStore);

  const topicsAttempted = Object.values(bestScoreByCategory).filter((score) => (score ?? 0) > 0).length;
  const quizScoreTotal = Object.values(bestScoreByCategory).reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0,
  );

  if (!hydrated) return <ParentDashboardSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <div
        className="relative w-full overflow-hidden rounded-3xl p-6 text-center text-white shadow-lg sm:p-8"
        style={heroGradient()}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
        />
        <span aria-hidden="true" className="absolute -right-10 -top-12 size-40 rounded-full bg-white/15" />
        <span aria-hidden="true" className="absolute -left-12 -bottom-16 size-40 rounded-full bg-black/10 blur-md" />

        <p aria-hidden="true" className="relative text-6xl drop-shadow-sm">
          📊
        </p>
        <h1 className="relative mt-2 font-display text-2xl font-bold">Learning summary</h1>
        <p className="relative mx-auto mt-1 max-w-xs text-sm font-semibold text-white/85">
          A quick look at how your child is progressing across Happy Kids Academy
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <RewardStatCard
          icon={<Clock />}
          label="Time spent"
          value={formatTimeSpent(timeSeconds)}
          accentColor="#4C9AFF"
        />
        <RewardStatCard
          icon={<ListChecks />}
          label="Lessons completed"
          value={lessonsCompleted}
          accentColor="#37C183"
        />
        <RewardStatCard
          icon={<Target />}
          label="Topics attempted"
          value={`${topicsAttempted}/${categories.length}`}
          accentColor="#FF9F43"
        />
        <RewardStatCard
          icon={<Star className="fill-current" />}
          label="Quiz score total"
          value={quizScoreTotal}
          accentColor="#A45EEA"
        />
        <RewardStatCard icon={<Coins />} label="Coins earned" value={coins} accentColor="#E17055" />
        <RewardStatCard icon={<Award />} label="Badges" value={badges} accentColor="#6C5CE7" />
      </div>

      <StarsByCategoryChart />
    </div>
  );
}
