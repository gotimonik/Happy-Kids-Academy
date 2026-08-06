"use client";

import { Star } from "lucide-react";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { selectLevel, useProgressStore } from "@/store/progress-store";

/**
 * Always shown on top of the colorful hero gradient — a solid white pill
 * gives reliable contrast there regardless of theme, unlike the generic
 * `Badge` component's tinted variants (which read as washed-out against a
 * vivid background, especially in dark mode).
 */
export function LevelBadge() {
  const level = useProgressStore(selectLevel);
  const hydrated = useStoreHydrated(useProgressStore);

  if (!hydrated) {
    return (
      <span
        className="inline-flex h-8 w-24 animate-pulse items-center rounded-full bg-white/60"
        aria-hidden="true"
      />
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-primary shadow-sm">
      <Star className="size-4 fill-current text-[#FDCB6E]" aria-hidden="true" />
      Level {level}
    </span>
  );
}
