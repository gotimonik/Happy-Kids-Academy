"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Eraser, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { trackEvent } from "@/lib/analytics/track-event";
import { useDisplayCategory } from "@/lib/categories/use-display-category";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { starsForRatio } from "@/lib/scoring";
import { selectCategoryTracedCount, useWritingPracticeStore } from "@/store/writing-practice-store";
import type { LearningCategory } from "@/types/category";
import { TraceCanvas, type TraceCanvasHandle } from "./trace-canvas";

// How long the "just scored" feedback pill stays up after tapping Next Guide.
const RESULT_FLASH_MS = 2200;

export function PracticePageClient({ category }: { category: LearningCategory }) {
  const displayCategory = useDisplayCategory(category);
  const guides = useMemo(
    () => displayCategory.items.filter((item) => Boolean(item.symbol)),
    [displayCategory.items],
  );
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<{ score: number; coins: number } | null>(null);
  const canvasRef = useRef<TraceCanvasHandle | null>(null);
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guards the resume-position effect below to a single one-time jump —
  // without it, every hydration-triggered re-render would snap `index` back
  // to the saved position even after the child has since clicked "Next".
  const restoredIndexRef = useRef(false);
  // In-memory only (not persisted) cache of each item's exact pixels for
  // *this* visit to the page — each guide letter remounts a fresh
  // `TraceCanvas` (see `key={index}` below), so without this, going Back to
  // redo an earlier letter would show a blank pad instead of what was just
  // drawn on it. Only the score/stars are saved long-term (see
  // `writing-practice-store.ts`); re-drawing every letter's raster forever
  // would be a lot to keep in localStorage for comparatively little value.
  const sessionDrawingsRef = useRef<Map<string, ImageData>>(new Map());

  const hydrated = useStoreHydrated(useWritingPracticeStore);
  const lastIndex = useWritingPracticeStore((state) => state.lastIndexByCategory[category.slug]);
  const tracedCount = useWritingPracticeStore((state) => selectCategoryTracedCount(state, category.slug));
  const recordAttempt = useWritingPracticeStore((state) => state.recordAttempt);
  const setLastIndex = useWritingPracticeStore((state) => state.setLastIndex);
  const t = useTranslation();

  const currentGuide = guides[index % guides.length];
  const guideText = currentGuide?.symbol ?? category.icon;
  const currentItemId = currentGuide?.id;
  const currentProgress = useWritingPracticeStore((state) =>
    currentItemId ? state.itemProgressByCategory[category.slug]?.[currentItemId] : undefined,
  );

  // Resume where the child left off last time — once, right after this
  // category's writing-practice data finishes hydrating from localStorage.
  // Starting at index 0 until then (rather than reading `lastIndex` straight
  // into `useState`) keeps the client's first render matching the statically
  // pre-rendered HTML; see `useStoreHydrated`'s doc for why that matters on
  // a static export.
  useEffect(() => {
    if (!hydrated || restoredIndexRef.current || guides.length === 0) return;
    restoredIndexRef.current = true;
    if (typeof lastIndex === "number" && lastIndex > 0) {
      // One-time sync from the just-hydrated store into local state, same
      // "synchronize with an external system" case `use-store-hydrated.ts`
      // documents for this lint rule — not a derived-state anti-pattern.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndex(lastIndex % guides.length);
    }
  }, [hydrated, lastIndex, guides.length]);

  useEffect(() => {
    return () => {
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    };
  }, []);

  // Restores this letter's in-progress drawing (if this session has one)
  // right after a fresh `TraceCanvas` mounts for it. Safe to rely on effect
  // ordering here: React fires a child's effects (the pad's own guide paint,
  // triggered by its `key={index}` remount) before this parent effect on the
  // same commit, so the blank guide is already down before this overwrites
  // it with the restored pixels.
  useEffect(() => {
    if (!currentItemId) return;
    const snapshot = sessionDrawingsRef.current.get(currentItemId);
    if (snapshot) canvasRef.current?.restoreSnapshot(snapshot);
  }, [index, currentItemId]);

  function goToIndex(nextIndex: number) {
    setIndex(nextIndex);
    setLastIndex(category.slug, nextIndex);
  }

  /**
   * Scores whatever's on the pad right now (if anything) and records it,
   * and caches its exact pixels for this session so Back can bring the
   * drawing back later — shared by both Back and Next Guide, so revisiting
   * an earlier letter to redo it counts and saves the same as moving
   * forward.
   */
  function commitCurrentAttempt() {
    if (!currentGuide) return;
    const score = canvasRef.current?.score() ?? null;
    // `null` means the pad was never drawn on this round — move on without
    // recording or caching anything, same as leaving a quiz question blank.
    if (score === null) return;
    const snapshot = canvasRef.current?.exportSnapshot();
    if (snapshot) sessionDrawingsRef.current.set(currentGuide.id, snapshot);
    const coins = recordAttempt(category.slug, currentGuide.id, score);
    trackEvent("writing_practice_attempt", { category: category.slug, score });
    setResult({ score, coins });
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    resultTimeoutRef.current = setTimeout(() => setResult(null), RESULT_FLASH_MS);
  }

  function handleNext() {
    commitCurrentAttempt();
    goToIndex((index + 1) % guides.length);
  }

  // Lets a child go back to redo, improve, or just look again at an
  // already-completed letter — without this there was no way back to a
  // guide once "Next" moved past it. Only shown/callable past the first
  // letter (see the Back button below), so no wraparound needed here.
  function handleBack() {
    commitCurrentAttempt();
    goToIndex(Math.max(0, index - 1));
  }

  const currentStars = currentProgress ? starsForRatio(currentProgress.bestScore / 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm text-muted-foreground">
        Trace the letter with your mouse, finger, or stylus.
      </p>

      <div className="mx-auto flex w-full max-w-md flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span>{t("practice.progressOf", { current: index + 1, total: guides.length })}</span>
          <span>{t("practice.tracedOf", { done: tracedCount, total: guides.length })}</span>
        </div>
        <Progress
          value={guides.length > 0 ? (tracedCount / guides.length) * 100 : 0}
          indicatorStyle={{ backgroundColor: category.color }}
        />
      </div>

      {/*
        A fixed-height slot for whichever status pill applies (or neither) —
        both pills below share the exact same padding/font size specifically
        so swapping between them, or between "one of them" and "neither",
        never changes this row's height. Without that, the page visibly
        jumped every time the "just scored" pill appeared after Next Guide
        and then disappeared again a couple seconds later.
      */}
      <div className="mx-auto flex h-7 items-center justify-center">
        {result ? (
          <div
            className="flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success"
            aria-live="polite"
          >
            <span>{t("practice.resultFlash", { score: result.score })}</span>
            {result.coins > 0 && <span>{t("practice.coinsEarned", { count: result.coins })}</span>}
          </div>
        ) : (
          hydrated &&
          currentProgress && (
            <div className="flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1 text-xs font-bold text-muted-foreground">
              {t("practice.bestScorePercent", { score: currentProgress.bestScore })}
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 3 }, (_, i) => (
                  <Star
                    key={i}
                    className={
                      i < currentStars ? "size-3.5 fill-current text-[#FDCB6E]" : "size-3.5 fill-current opacity-25"
                    }
                  />
                ))}
              </span>
            </div>
          )
        )}
      </div>

      <TraceCanvas key={index} ref={canvasRef} guideText={guideText} strokeColor={category.color} />

      <div className="flex flex-wrap justify-center gap-3">
        {index > 0 && (
          <Button type="button" variant="outline" size="md" onClick={handleBack}>
            <ChevronLeft className="size-5" aria-hidden="true" />
            {t("learn.back")}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => {
            canvasRef.current?.clear();
            // Otherwise a stale pre-Clear snapshot from an earlier visit
            // would still be sitting in the session cache and silently
            // "undo" this Clear the next time Back/Next brings this letter
            // back up.
            if (currentItemId) sessionDrawingsRef.current.delete(currentItemId);
          }}
        >
          <Eraser className="size-5" aria-hidden="true" />
          Clear
        </Button>
        <Button
          type="button"
          size="md"
          accentColor={category.color}
          className="text-white hover:brightness-110"
          onClick={handleNext}
        >
          <RefreshCw className="size-5" aria-hidden="true" />
          Next Guide
        </Button>
      </div>
    </div>
  );
}
