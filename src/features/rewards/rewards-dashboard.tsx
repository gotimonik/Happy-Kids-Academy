"use client";

import { Award, CheckCircle2, Coins, GraduationCap, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/shared/skeleton-card";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { tileGradient } from "@/lib/ui/tile-gradient";
import { cn } from "@/lib/utils";
import { selectBadges, selectLevel, selectTotalStars, useProgressStore } from "@/store/progress-store";
import { RewardStatCard } from "./reward-stat-card";

const CERTIFICATE_THRESHOLD = 15;
const LEVEL_STARS = 8;
const TROPHY_COLOR = "#FDCB6E";
const CERTIFICATE_COLOR = "#00B894";

function RewardsDashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your rewards" className="flex w-full flex-col items-center gap-6">
      <div className="w-full rounded-3xl p-6 sm:p-8" style={tileGradient(TROPHY_COLOR)}>
        <Skeleton className="mx-auto h-14 w-14 rounded-full bg-white/30" />
        <Skeleton className="mx-auto mt-3 h-6 w-28 rounded-full bg-white/30" />
        <Skeleton className="mx-auto mt-2 h-4 w-40 rounded-full bg-white/25" />
        <Skeleton className="mx-auto mt-4 h-3 w-full max-w-xs rounded-full bg-white/25" />
      </div>
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  );
}

export function RewardsDashboard() {
  const stars = useProgressStore(selectTotalStars);
  const level = useProgressStore(selectLevel);
  const badges = useProgressStore(selectBadges);
  const coins = useProgressStore((state) => state.coins);
  const lessonsCompleted = useProgressStore((state) => state.lessonsCompleted);
  const hydrated = useStoreHydrated(useProgressStore);

  const starsIntoLevel = stars % LEVEL_STARS;
  const starsToNextLevel = LEVEL_STARS - starsIntoLevel;
  const certificateUnlocked = stars >= CERTIFICATE_THRESHOLD;

  if (!hydrated) return <RewardsDashboardSkeleton />;

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative w-full overflow-hidden rounded-3xl p-6 text-center text-white shadow-lg sm:p-8"
        style={tileGradient(TROPHY_COLOR)}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
        />
        <span aria-hidden="true" className="absolute -right-10 -top-12 size-40 rounded-full bg-white/15" />
        <span aria-hidden="true" className="absolute -left-12 -bottom-16 size-40 rounded-full bg-black/10 blur-md" />

        <p aria-hidden="true" className="animate-float relative text-6xl drop-shadow-sm">
          🏆
        </p>
        <h1 className="relative mt-2 font-display text-2xl font-bold">Level {level}</h1>
        <p className="relative mt-1 text-sm font-semibold text-white/85">
          {starsToNextLevel} more {starsToNextLevel === 1 ? "star" : "stars"} to Level {level + 1}
        </p>
        <div className="relative mx-auto mt-4 max-w-xs">
          <Progress
            value={(starsIntoLevel / LEVEL_STARS) * 100}
            className="bg-white/25"
            indicatorStyle={{ backgroundColor: "white" }}
            aria-label={`${starsIntoLevel} of ${LEVEL_STARS} stars toward Level ${level + 1}`}
          />
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        <RewardStatCard icon={<Star className="fill-current" />} label="Stars" value={stars} accentColor="#FFD166" />
        <RewardStatCard icon={<Coins />} label="Coins" value={coins} accentColor="#E17055" />
        <RewardStatCard icon={<Award />} label="Badges" value={badges} accentColor="#6C5CE7" />
        <RewardStatCard icon={<CheckCircle2 />} label="Lessons" value={lessonsCompleted} accentColor="#37C183" />
      </div>

      <div
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl p-4 font-bold shadow-sm",
          !certificateUnlocked && "bg-muted text-muted-foreground",
        )}
        style={certificateUnlocked ? tileGradient(CERTIFICATE_COLOR) : undefined}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            certificateUnlocked ? "bg-white/20 text-white" : "bg-secondary",
          )}
        >
          <GraduationCap className="size-5" />
        </span>
        <span className={cn("flex-1 text-left", certificateUnlocked && "text-white")}>
          {certificateUnlocked
            ? "Certificate unlocked! 🎓"
            : `Earn ${CERTIFICATE_THRESHOLD - stars} more stars to unlock a certificate`}
        </span>
      </div>
    </div>
  );
}
