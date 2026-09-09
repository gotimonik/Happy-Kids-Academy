import { STREAK_MILESTONES } from "@/types/streak";

/** One emoji per milestone tier (parallel to `STREAK_MILESTONES`), plus the starting tier before any milestone is reached. */
const WELCOME_ICONS = ["🎈", "🔥", "⭐", "🏆", "👑", "💎", "🚀"] as const;

/**
 * The `StreakWelcomeModal` hero icon for a given streak length — a balloon
 * on day 1-2, then upgrading through the same milestone tiers as
 * `STREAK_MILESTONES` (3/7/14/30/60/100 days) as the streak grows, so the
 * icon actually changes over time instead of freezing on one balloon (or a
 * single flame) forever.
 */
export function welcomeIcon(currentStreak: number): string {
  let tier = 0;
  for (const milestone of STREAK_MILESTONES) {
    if (currentStreak >= milestone) tier += 1;
  }
  return WELCOME_ICONS[tier] ?? WELCOME_ICONS[WELCOME_ICONS.length - 1] ?? "🎈";
}
