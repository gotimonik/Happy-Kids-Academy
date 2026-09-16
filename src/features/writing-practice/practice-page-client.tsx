"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Eraser, Lightbulb, Star } from "lucide-react";
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

  // What the progress bar's tooltip shows, and whether it's forced open
  // rather than left to hover (see `Progress`'s own doc for why): a
  // just-scored result takes priority while its flash is up, falling back
  // to this letter's best score once that fades (or immediately, if there
  // was never a fresh result to show). `undefined` means neither applies,
  // so the tooltip just reverts to plain hover-for-percentage.
  const progressTooltip =
    result ? (
      <span className="flex items-center gap-1.5">
        <span>{t("practice.resultFlash", { score: result.score })}</span>
        {result.coins > 0 && <span>{t("practice.coinsEarned", { count: result.coins })}</span>}
      </span>
    ) : hydrated && currentProgress ? (
      <span className="flex items-center gap-1.5">
        {t("practice.bestScorePercent", { score: currentProgress.bestScore })}
        <span className="flex items-center gap-0.5" aria-hidden="true">
          {Array.from({ length: 3 }, (_, i) => (
            <Star
              key={i}
              className={i < currentStars ? "size-3 fill-current text-[#FDCB6E]" : "size-3 fill-current opacity-40"}
            />
          ))}
        </span>
      </span>
    ) : undefined;

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
          tooltipContent={progressTooltip}
          tooltipOpen={progressTooltip !== undefined}
        />
      </div>

      {/*
        A screen reader still gets the just-scored result the instant it
        happens — the tooltip above it is a *visual* affordance (and,
        being a portal, silent to assistive tech until it's focused/hovered
        the trigger), so this is the only way that announcement actually
        reaches anyone relying on one.
      */}
      {result && (
        <span className="sr-only" aria-live="polite">
          {t("practice.resultFlash", { score: result.score })}
          {result.coins > 0 && ` ${t("practice.coinsEarned", { count: result.coins })}`}
        </span>
      )}

      {/*
        A quick "did you know" fact about whatever's being traced (see
        `LearningItem.fact`) — kids get a little real-world context for the
        letter/number they're practicing, not just the glyph itself.
        Categories that don't have facts yet (Gujarati, Hindi, Numbers)
        simply render nothing here. `line-clamp-2` keeps this row's height
        predictable regardless of how long a given fact is, which is what
        the trace pad's own height reservation just below is budgeted
        against.
      */}
      {currentGuide?.fact && (
        <p className="mx-auto flex max-w-md items-start gap-1.5 text-center text-xs text-muted-foreground sm:text-sm">
          <Lightbulb
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0 sm:size-4"
            style={{ color: category.color }}
          />
          <span className="line-clamp-2 text-left">{currentGuide.fact}</span>
        </p>
      )}

      {/*
        `containerClassName` caps the pad's height (not just its width) to
        whatever room is actually left above/below it. Without this, the
        canvas's own `aspect-square` sizing only ever looked at available
        *width* — so on a short/wide desktop window the square could render
        taller than (viewport height minus everything else on the page),
        pushing its bottom edge down into the same strip of the screen the
        sticky button bar below pins itself to. Since the bar is *always*
        kept visible (see the sticky bar's own comment below), it wins that
        fight and visually sits on top of the pad's bottom edge instead of
        the pad shrinking to make room. Reserving space this way instead
        keeps the pad and the bar from ever overlapping, whatever the
        viewport's height. `min-h-64` is just a floor so the pad never
        collapses to nothing on a genuinely tiny viewport (a rare case where
        some scrolling is an acceptable fallback).
      */}
      <TraceCanvas
        key={index}
        ref={canvasRef}
        guideText={guideText}
        strokeColor={category.color}
        containerClassName={
          currentGuide?.fact
            ? "max-h-[calc(100dvh-29rem)] min-h-64"
            : "max-h-[calc(100dvh-25rem)] min-h-64"
        }
      />

      {/* Sticky rather than a plain in-flow row: the trace pad above is a
          tall `aspect-square` card, so on a shorter viewport these buttons
          would otherwise sit below the fold, needing a scroll to reach on
          every single letter. Sticking to the bottom of the viewport (the
          same treatment `TimesTablesHub`'s "Pick a table" bar uses) keeps
          Next Guide reachable at all times without shrinking the pad
          itself.
          Capped to the same `max-w-md` as the progress bar and the trace
          pad above (rather than stretching edge-to-edge): a full-width bar
          with a small cluster of buttons centered inside it reads as an odd
          mismatch against the narrower card stack above it. `flex-1` on
          every button then fills that matched width evenly instead of
          leaving slack around a centered clump. Back is always rendered
          (just disabled on the first letter) instead of being added/removed
          from the row, so the bar keeps the same three-button shape and
          spacing throughout — matching `LessonCarousel`'s Back/Next bar,
          the same "generic" pattern used elsewhere in the app. */}
      <div className="sticky bottom-3 z-10 mx-auto flex w-full max-w-md items-center gap-2 rounded-3xl border border-border bg-card/95 p-2.5 shadow-lg backdrop-blur sm:gap-3 sm:p-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={t("learn.back")}
          onClick={handleBack}
          disabled={index === 0}
          className="flex-1 sm:h-11 sm:gap-2 sm:px-5 sm:text-sm"
        >
          <ChevronLeft className="size-4 sm:size-5" aria-hidden="true" />
          <span className="hidden sm:inline">{t("learn.back")}</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Clear"
          className="flex-1 sm:h-11 sm:gap-2 sm:px-5 sm:text-sm"
          onClick={() => {
            canvasRef.current?.clear();
            // Otherwise a stale pre-Clear snapshot from an earlier visit
            // would still be sitting in the session cache and silently
            // "undo" this Clear the next time Back/Next brings this letter
            // back up.
            if (currentItemId) sessionDrawingsRef.current.delete(currentItemId);
          }}
        >
          <Eraser className="size-4 sm:size-5" aria-hidden="true" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
        <Button
          type="button"
          size="sm"
          accentColor={category.color}
          className="flex-1 text-white hover:brightness-110 sm:h-11 sm:gap-2 sm:px-5 sm:text-sm"
          onClick={handleNext}
        >
          <span className="hidden sm:inline">Next Guide</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="size-4 sm:size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
