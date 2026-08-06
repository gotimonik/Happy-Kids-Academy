"use client";

import { motion } from "framer-motion";
import { MapPin, RefreshCw, Sparkles, Target, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StaticLink as Link } from "@/components/shared/static-link";
import { Skeleton } from "@/components/shared/skeleton-card";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { tileGradient } from "@/lib/ui/tile-gradient";
import { cn } from "@/lib/utils";
import { COACH_GAMES, type CoachGrade } from "@/lib/study-coach/guide-content";
import { useStudyCoachStore } from "@/store/study-coach-store";

const GRADES: CoachGrade[] = [1, 2, 3];
const COACH_COLOR = "#6F4EAA";

interface ActionTile {
  readonly href: string;
  readonly title: string;
  readonly subtitle: string;
  readonly icon: LucideIcon;
  readonly color: string;
}

const ACTION_TILES: readonly ActionTile[] = [
  {
    href: "/study-coach/game-variations",
    title: "Customize Game",
    subtitle: "3 variations + materials",
    icon: Target,
    color: "#E17055",
  },
  {
    href: "/study-coach/treasure-hunt",
    title: "Treasure Hunt",
    subtitle: "10 questions + answer key",
    icon: MapPin,
    color: "#00B894",
  },
  {
    href: "/study-coach/daily-routine",
    title: "30-Minute Routine",
    subtitle: "Three 10-minute micro-games",
    icon: Timer,
    color: "#0984E3",
  },
];

function ActionCard({ tile, index }: { tile: ActionTile; index: number }) {
  const Icon = tile.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
    >
      <Link
        href={tile.href}
        className="group relative flex min-h-24 items-center gap-4 overflow-hidden rounded-3xl p-5 text-white shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        style={tileGradient(tile.color)}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute -right-6 -top-8 size-28 rounded-full bg-white/15 transition-transform group-hover:scale-110"
        />
        <span aria-hidden="true" className="absolute -left-8 -bottom-10 size-28 rounded-full bg-black/10 blur-md" />
        <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <span className="relative">
          <span className="block font-display text-lg font-bold drop-shadow-sm">{tile.title}</span>
          <span className="block text-sm text-white/85">{tile.subtitle}</span>
        </span>
      </Link>
    </motion.div>
  );
}

function CoachHubSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading study coach" className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-3xl p-6 shadow-lg sm:p-8" style={tileGradient(COACH_COLOR)}>
        <Skeleton className="size-10 rounded-full bg-white/25" />
        <Skeleton className="mt-3 h-7 w-40 rounded-full bg-white/25" />
        <Skeleton className="mt-2 h-4 w-52 rounded-full bg-white/20" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-[68px] w-full rounded-2xl" />
      <div className="grid gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export function CoachHub() {
  const grade = useStudyCoachStore((state) => state.grade);
  const gameIndex = useStudyCoachStore((state) => state.gameIndex);
  const setGrade = useStudyCoachStore((state) => state.setGrade);
  const cycleGame = useStudyCoachStore((state) => state.cycleGame);
  const hydrated = useStoreHydrated(useStudyCoachStore);

  if (!hydrated) return <CoachHubSkeleton />;

  return (
    <div className="flex flex-col gap-5">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-8"
        style={tileGradient(COACH_COLOR)}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
        />
        <span aria-hidden="true" className="absolute -right-10 -top-12 size-40 rounded-full bg-white/15" />
        <span aria-hidden="true" className="absolute -left-12 -bottom-16 size-40 rounded-full bg-black/10 blur-md" />

        <span aria-hidden="true" className="animate-float relative inline-flex">
          <Sparkles className="size-10" />
        </span>
        <h1 className="relative mt-2 font-display text-2xl font-bold sm:text-3xl">Study Coach</h1>
        <p className="relative mt-1 text-white/85">Choose the child&apos;s standard</p>
      </motion.header>

      <div className="grid grid-cols-3 gap-2">
        {GRADES.map((g) => (
          <motion.button
            key={g}
            type="button"
            onClick={() => setGrade(g)}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "rounded-2xl px-3 py-3 font-bold shadow-sm transition-colors",
              grade === g ? "text-white shadow-md" : "border-2 border-border bg-card text-foreground",
            )}
            style={grade === g ? { backgroundColor: COACH_COLOR } : undefined}
          >
            Standard {g}
          </motion.button>
        ))}
      </div>

      <button
        type="button"
        onClick={cycleGame}
        className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md"
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: COACH_COLOR }}
          >
            🎮
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">Selected game</span>
            <span className="block font-display font-bold">{COACH_GAMES[gameIndex]}</span>
          </span>
        </span>
        <RefreshCw className="size-5" style={{ color: COACH_COLOR }} aria-hidden="true" />
      </button>

      <div className="grid gap-3">
        {ACTION_TILES.map((tile, index) => (
          <ActionCard key={tile.href} tile={tile} index={index} />
        ))}
      </div>
    </div>
  );
}
