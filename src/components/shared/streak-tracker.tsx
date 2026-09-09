"use client";

import { useEffect } from "react";
import { useStreakStore } from "@/store/streak-store";

/**
 * Marks today as an active day the moment the app is opened. Mounted once in
 * the root layout — the single choke point every page passes through — so
 * no individual game/lesson/quiz needs its own instrumentation to keep the
 * daily streak (`streak-store.ts`) up to date. Renders nothing.
 */
export function StreakTracker() {
  const recordActivity = useStreakStore((state) => state.recordActivity);

  useEffect(() => {
    recordActivity();
  }, [recordActivity]);

  return null;
}
