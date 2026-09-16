"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/lib/i18n/use-translation";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/store/progress-store";
import type { LearningCategory } from "@/types/category";
import { FlashCard } from "./flash-card";

/**
 * The "More about X" paragraph, collapsed by default. It's genuinely useful
 * reading content (see `LearningItem.longDescription`'s doc), but at 5-7
 * sentences it's also the single biggest thing pushing this page below the
 * fold — collapsing it behind a tap keeps that content available without
 * forcing everyone to scroll past it just to reach Back/Next. `key={item.id}`
 * on the call site remounts this fresh per item, so flipping to the next
 * letter/item always starts collapsed again rather than carrying over
 * whatever the previous item's toggle was left at.
 */
function ItemLongDescription({
  text,
  label,
  accentColor,
}: {
  text: string;
  label: string;
  accentColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslation();

  return (
    <div className="rounded-3xl border border-border bg-card p-5 text-left shadow-lg sm:p-6">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <BookOpen aria-hidden="true" className="size-4" style={{ color: accentColor }} />
          {t("learn.moreAbout", { label })}
        </span>
        <span
          className="flex shrink-0 items-center gap-1 text-xs font-bold"
          style={{ color: accentColor }}
        >
          {expanded ? t("common.showLess") : t("common.readMore")}
          <ChevronDown
            aria-hidden="true"
            className={cn("size-4 transition-transform", expanded && "rotate-180")}
          />
        </span>
      </button>
      {expanded && (
        <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">{text}</p>
      )}
    </div>
  );
}

export function LessonCarousel({
  category,
  onFinish,
}: {
  category: LearningCategory;
  onFinish: () => void;
}) {
  const [index, setIndex] = useState(0);
  const incrementLessonsCompleted = useProgressStore((state) => state.incrementLessonsCompleted);
  const t = useTranslation();
  const total = category.items.length;
  const item = category.items[index];

  const goNext = useCallback(() => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      incrementLessonsCompleted();
      trackEvent("lesson_complete", { category: category.slug, items_count: total });
      onFinish();
    }
  }, [index, total, incrementLessonsCompleted, onFinish, category.slug]);

  const goBack = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goBack();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goBack]);

  if (!item) return null;

  return (
    // Capped to `max-w-md` — the same single-column width the writing
    // practice pad, drawing game, and coloring game all use — instead of
    // stretching to fill the whole main content column. Left uncapped, this
    // page's narrow content (a single card, a couple of buttons) spread out
    // across the full ~6xl main width on a wide desktop window, leaving a
    // huge empty gutter on both sides of everything.
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-3">
        <Progress value={((index + 1) / total) * 100} className="flex-1" />
        <span className="shrink-0 text-sm font-bold text-muted-foreground">
          {index + 1} / {total}
        </span>
      </div>

      <FlashCard key={item.id} item={item} accentColor={category.color} />

      {/*
        Deliberately NOT sticky/height-clamped like the Writing Practice
        bar: a `sticky` bar pins itself near the bottom of the viewport
        from the moment the page loads (not just once you've scrolled to
        it), which only avoids covering the card above if that card's
        height is capped to leave room — and capping a *text* card like
        this one means it can need its own inner scrollbar the moment real
        content (a longer fact, a wrapped label, a narrower window) makes
        it taller than expected. A plain in-flow row avoids both problems
        at once: it always sits right after the card with a normal gap, so
        there's nothing to overlap and nothing needs to scroll except the
        page itself, exactly like any other content. Styled to look like a
        floating bar for visual consistency with the rest of the app, it
        just isn't actually pinned to the viewport.
      */}
      <div className="flex gap-3 rounded-3xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
        <Button
          type="button"
          variant="outline"
          size="md"
          className="flex-1"
          onClick={goBack}
          disabled={index === 0}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
          {t("learn.back")}
        </Button>
        <Button
          type="button"
          size="md"
          className="flex-1"
          accentColor={category.color}
          onClick={goNext}
        >
          {index < total - 1 ? t("learn.next") : t("learn.finish")}
          <ChevronRight className="size-5" aria-hidden="true" />
        </Button>
      </div>

      {/*
        A longer, substantive paragraph about the current item — separate
        from the flash card above (which stays focused on the compact
        name/detail/short-fact layout it was designed around) and from the
        short `fact` line on it. Plain in-flow content like the nav bar
        above, so it's part of the normal page flow rather than an overlay.
        Not every item has one yet (see `LearningItem.longDescription`), so
        this simply renders nothing for those rather than an empty card.
        Collapsed by default — see `ItemLongDescription`'s own doc.
      */}
      {item.longDescription && (
        // `key` is prefixed rather than reusing the bare `item.id` FlashCard
        // uses above — both are just individual JSX children here, not a
        // mapped list, but React still checks key uniqueness across all of
        // a parent's children, so two siblings keyed identically (they're
        // for the *same* item, after all) trip its "duplicate key" warning
        // even though neither is actually a duplicate render.
        <ItemLongDescription
          key={`desc-${item.id}`}
          text={item.longDescription}
          label={item.label}
          accentColor={category.color}
        />
      )}
    </div>
  );
}
