"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";
import { useSortingGame } from "./use-sorting-game";
import type { SortItem } from "./use-sorting-game";

const BUCKETS = ["animals", "vehicles"] as const;

// How far the pointer has to move from where it went down before a press
// counts as a drag rather than a tap — small enough that an intentional
// drag registers immediately, big enough that a slightly wobbly tap doesn't
// misfire as one.
const DRAG_THRESHOLD_PX = 6;

function bucketAt(
  clientX: number,
  clientY: number,
  bucketEls: Record<SortItem["bucket"], HTMLButtonElement | null>,
): SortItem["bucket"] | null {
  for (const bucket of BUCKETS) {
    const el = bucketEls[bucket];
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
      return bucket;
    }
  }
  return null;
}

export function SortingGame() {
  const { items, selectedId, sorted, wrongBucket, isComplete, selectItem, dropItem, dropInBucket, reset } =
    useSortingGame();

  const [draggingId, setDraggingId] = useState<string | null>(null);
  // Only becomes true once a press has actually moved past the drag
  // threshold — kept separate from `draggingId` so a plain tap's brief
  // pointerdown-then-up doesn't flash the "lifted" drag styling first.
  const [isDragActive, setIsDragActive] = useState(false);
  const [hoveredBucket, setHoveredBucket] = useState<SortItem["bucket"] | null>(null);
  const itemElsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const bucketElsRef = useRef<Record<SortItem["bucket"], HTMLButtonElement | null>>({
    animals: null,
    vehicles: null,
  });
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null);
  // Mirrors `isDragActive` but read synchronously by the click handler that
  // fires right after pointerup (for the same press), to tell "the tail end
  // of a drag" apart from a real tap — reset there, not in pointerup, since
  // the click handler needs to see it first. (State wouldn't be readable in
  // time: the click fires before a state update from pointerup would have
  // re-rendered.)
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    if (isComplete) trackEvent("game_complete", { game_id: "sorting" });
  }, [isComplete]);

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>, id: string) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOriginRef.current = { x: event.clientX, y: event.clientY };
    hasDraggedRef.current = false;
    setDraggingId(id);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>, id: string) {
    if (draggingId !== id || !dragOriginRef.current) return;
    const dx = event.clientX - dragOriginRef.current.x;
    const dy = event.clientY - dragOriginRef.current.y;

    if (!hasDraggedRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
      hasDraggedRef.current = true;
      setIsDragActive(true);
    }
    if (!hasDraggedRef.current) return;

    const el = itemElsRef.current[id];
    if (el) el.style.transform = `translate(${dx}px, ${dy}px) scale(1.15)`;
    setHoveredBucket(bucketAt(event.clientX, event.clientY, bucketElsRef.current));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>, id: string) {
    if (draggingId !== id) return;
    setDraggingId(null);
    setIsDragActive(false);
    setHoveredBucket(null);

    if (hasDraggedRef.current) {
      const bucket = bucketAt(event.clientX, event.clientY, bucketElsRef.current);
      if (bucket) dropItem(id, bucket);
      // A correct drop removes the item from the list entirely (filtered
      // out below once `sorted`), so this only matters for a miss — snap
      // back to where it started.
      const el = itemElsRef.current[id];
      if (el) el.style.transform = "";
    }
    // hasDraggedRef itself isn't reset here — `handleClick`, firing right
    // after for this same press, still needs to see it.
  }

  function handleClick(id: string) {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    selectItem(id);
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-center text-sm text-muted-foreground">
        Drag an item to its bucket — or tap it, then tap the bucket.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {items
          .filter((item) => !sorted.has(item.id))
          .map((item) => {
            const isBeingDragged = draggingId === item.id && isDragActive;
            return (
              <button
                key={item.id}
                type="button"
                ref={(el) => {
                  itemElsRef.current[item.id] = el;
                }}
                onPointerDown={(event) => handlePointerDown(event, item.id)}
                onPointerMove={(event) => handlePointerMove(event, item.id)}
                onPointerUp={(event) => handlePointerUp(event, item.id)}
                onClick={() => handleClick(item.id)}
                aria-pressed={selectedId === item.id}
                className={cn(
                  "flex size-16 touch-none items-center justify-center rounded-2xl text-3xl shadow-md transition-transform focus-visible:outline-2 focus-visible:outline-ring",
                  isBeingDragged
                    ? "z-50 scale-[1.15] cursor-grabbing shadow-xl"
                    : "cursor-grab hover:scale-105",
                  selectedId === item.id && !isBeingDragged ? "scale-110 bg-warning/30" : "bg-card",
                )}
                aria-label={item.label}
              >
                {item.icon}
              </button>
            );
          })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {BUCKETS.map((bucket) => (
          <button
            key={bucket}
            type="button"
            ref={(el) => {
              bucketElsRef.current[bucket] = el;
            }}
            onClick={() => dropInBucket(bucket)}
            className={cn(
              "flex min-h-28 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed p-4 font-display text-lg font-bold capitalize transition-colors",
              wrongBucket === bucket
                ? "border-destructive bg-destructive/10 text-destructive"
                : hoveredBucket === bucket
                  ? "scale-105 border-primary bg-primary/10"
                  : "border-border bg-card",
            )}
          >
            {bucket === "animals" ? "🐾" : "🚗"} {bucket}
            <span className="text-xs font-normal text-muted-foreground">
              {items.filter((i) => i.bucket === bucket && sorted.has(i.id)).length} /{" "}
              {items.filter((i) => i.bucket === bucket).length}
            </span>
          </button>
        ))}
      </div>

      {isComplete && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-success/10 p-5 text-center">
          <p className="font-display text-lg font-bold text-success">All sorted! 🎉</p>
          <Button type="button" size="kid" onClick={reset}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
