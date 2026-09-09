"use client";

import { Flame } from "lucide-react";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useStreakStore } from "@/store/streak-store";

/**
 * Companion to `LevelBadge` on the home hero — a solid white pill (same
 * reasoning as `LevelBadge`'s doc: reliable contrast on the colorful hero
 * gradient in both themes) showing the current daily streak. The flame stays
 * a muted gray until there's an actual streak (`currentStreak > 0`), so a
 * brand-new player doesn't see a lit flame for zero days.
 */
export function StreakFlameBadge() {
  const currentStreak = useStreakStore((state) => state.currentStreak);
  const hydrated = useStoreHydrated(useStreakStore);
  const t = useTranslation();

  if (!hydrated) {
    return (
      <span
        className="inline-flex h-8 w-24 animate-pulse items-center rounded-full bg-white/60"
        aria-hidden="true"
      />
    );
  }

  const lit = currentStreak > 0;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-primary shadow-sm">
      <Flame
        className={lit ? "size-4 fill-current text-[#FF7A45]" : "size-4 text-muted-foreground"}
        aria-hidden="true"
      />
      {lit ? t("streak.dayCount", { count: currentStreak }) : t("streak.startToday")}
    </span>
  );
}
