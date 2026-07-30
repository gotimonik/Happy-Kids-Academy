"use client";

import { Award, CheckCircle2, Coins, GraduationCap, Star } from "lucide-react";
import { selectBadges, selectLevel, selectTotalStars, useProgressStore } from "@/store/progress-store";
import { RewardStatCard } from "./reward-stat-card";

const CERTIFICATE_THRESHOLD = 15;

export function RewardsDashboard() {
  const stars = useProgressStore(selectTotalStars);
  const level = useProgressStore(selectLevel);
  const badges = useProgressStore(selectBadges);
  const coins = useProgressStore((state) => state.coins);
  const lessonsCompleted = useProgressStore((state) => state.lessonsCompleted);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p aria-hidden="true" className="text-6xl">
          🏆
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold">Level {level}</h1>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        <RewardStatCard icon={<Star className="fill-current" />} label="Stars" value={stars} accentColor="#FFD166" />
        <RewardStatCard icon={<Coins />} label="Coins" value={coins} accentColor="#E17055" />
        <RewardStatCard icon={<Award />} label="Badges" value={badges} accentColor="#6C5CE7" />
        <RewardStatCard icon={<CheckCircle2 />} label="Lessons" value={lessonsCompleted} accentColor="#37C183" />
      </div>

      <div
        className={
          stars >= CERTIFICATE_THRESHOLD
            ? "flex items-center gap-2 rounded-2xl bg-success/10 px-5 py-3 font-bold text-success"
            : "flex items-center gap-2 rounded-2xl bg-muted px-5 py-3 font-bold text-muted-foreground"
        }
      >
        <GraduationCap className="size-5" aria-hidden="true" />
        {stars >= CERTIFICATE_THRESHOLD
          ? "Certificate unlocked! 🎓"
          : `Earn ${CERTIFICATE_THRESHOLD - stars} more stars to unlock a certificate`}
      </div>
    </div>
  );
}
