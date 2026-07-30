"use client";

import { useEffect, useRef } from "react";
import { useProgressStore } from "@/store/progress-store";

const FLUSH_INTERVAL_MS = 30_000;

/**
 * Accumulates time spent in the app into the progress store, replacing the
 * Android app's `onDestroy` → `time_seconds` bookkeeping. Renders nothing.
 */
export function SessionTimeTracker() {
  const addTimeSeconds = useProgressStore((state) => state.addTimeSeconds);
  const lastFlushRef = useRef<number | null>(null);

  useEffect(() => {
    lastFlushRef.current = Date.now();

    function flush() {
      if (lastFlushRef.current === null) return;
      const now = Date.now();
      const elapsedSeconds = Math.round((now - lastFlushRef.current) / 1000);
      if (elapsedSeconds > 0) addTimeSeconds(elapsedSeconds);
      lastFlushRef.current = now;
    }

    const interval = setInterval(flush, FLUSH_INTERVAL_MS);
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);

    return () => {
      flush();
      clearInterval(interval);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
    };
  }, [addTimeSeconds]);

  return null;
}
