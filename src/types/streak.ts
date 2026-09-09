/** Persisted daily-streak progress — mirrors the shape of `ProgressState`/`WritingPracticeState`. */
export interface StreakState {
  readonly currentStreak: number;
  readonly longestStreak: number;
  /** Local "YYYY-MM-DD" of the last day activity was recorded, or `null` before the first-ever visit. */
  readonly lastActiveDate: string | null;
  /**
   * Local date keys activity was recorded on, oldest first, capped to
   * `ACTIVE_DATES_WINDOW` entries — enough to power a "last 7 days" strip
   * (with headroom for the UI to grow) without the array growing forever.
   */
  readonly activeDates: readonly string[];
  /**
   * Local "YYYY-MM-DD" the once-per-day home page welcome moment
   * (`StreakWelcomeModal`) was last shown, or `null` before it's ever run —
   * separate from `lastActiveDate` so a milestone day (which suppresses the
   * plain welcome in favor of `StreakMilestoneCelebration`) doesn't cause it
   * to reappear later that same day once the milestone modal is dismissed.
   */
  readonly lastWelcomeShownDate: string | null;
}

export const INITIAL_STREAK: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  activeDates: [],
  lastWelcomeShownDate: null,
};

/** How many of the most recent local date keys `activeDates` retains. */
export const ACTIVE_DATES_WINDOW = 60;

/** Streak lengths (in days) that trigger a celebration + coin bonus — see `MILESTONE_COINS` in `streak-store.ts`. */
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const;
