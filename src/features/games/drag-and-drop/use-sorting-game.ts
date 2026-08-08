"use client";

import { useCallback, useEffect, useState } from "react";
import { animalsCategory } from "@/data/categories/animals";
import { vehiclesCategory } from "@/data/categories/vehicles";
import { useChime } from "@/lib/audio/use-chime";
import { vibrate } from "@/lib/haptics/vibrate";
import { shuffle } from "@/lib/quiz/utils";

export interface SortItem {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly bucket: "animals" | "vehicles";
}

const ITEM_COUNT = 8;

function deterministicItems(): SortItem[] {
  const animals = animalsCategory.items
    .slice(0, ITEM_COUNT / 2)
    .map((item) => ({ id: `a-${item.id}`, icon: item.icon ?? "🐾", label: item.label, bucket: "animals" as const }));
  const vehicles = vehiclesCategory.items
    .slice(0, ITEM_COUNT / 2)
    .map((item) => ({ id: `v-${item.id}`, icon: item.icon ?? "🚗", label: item.label, bucket: "vehicles" as const }));
  return [...animals, ...vehicles];
}

function shuffledItems(): SortItem[] {
  const animals = shuffle(animalsCategory.items)
    .slice(0, ITEM_COUNT / 2)
    .map((item) => ({ id: `a-${item.id}`, icon: item.icon ?? "🐾", label: item.label, bucket: "animals" as const }));
  const vehicles = shuffle(vehiclesCategory.items)
    .slice(0, ITEM_COUNT / 2)
    .map((item) => ({ id: `v-${item.id}`, icon: item.icon ?? "🚗", label: item.label, bucket: "vehicles" as const }));
  return shuffle([...animals, ...vehicles]);
}

export function useSortingGame() {
  const [items, setItems] = useState<SortItem[]>(deterministicItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sorted, setSorted] = useState<Set<string>>(new Set());
  const [wrongBucket, setWrongBucket] = useState<SortItem["bucket"] | null>(null);
  const { playWinChime } = useChime();

  useEffect(() => {
    // Shuffled item order depends on `Math.random()`, so it's set post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(shuffledItems());
  }, []);

  const reset = useCallback(() => {
    setItems(shuffledItems());
    setSelectedId(null);
    setSorted(new Set());
    setWrongBucket(null);
  }, []);

  const selectItem = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  /**
   * Tries to place a specific item into a bucket, independent of tap-select
   * state — used directly by the drag gesture (which knows exactly which
   * item is under the finger, unlike the tap flow's `selectedId`).
   */
  const dropItem = useCallback(
    (id: string, bucket: SortItem["bucket"]) => {
      const item = items.find((candidate) => candidate.id === id);
      if (!item) return;

      if (item.bucket === bucket) {
        vibrate(30);
        setSorted((prev) => new Set(prev).add(item.id));
        setSelectedId((current) => (current === id ? null : current));
        if (sorted.size + 1 === items.length) playWinChime();
      } else {
        vibrate(100);
        setWrongBucket(bucket);
        setTimeout(() => setWrongBucket(null), 500);
      }
    },
    [items, sorted, playWinChime],
  );

  /** Tap-to-select flow: drops whichever item is currently selected. */
  const dropInBucket = useCallback(
    (bucket: SortItem["bucket"]) => {
      if (!selectedId) return;
      dropItem(selectedId, bucket);
    },
    [selectedId, dropItem],
  );

  const isComplete = items.length > 0 && sorted.size === items.length;

  return {
    items,
    selectedId,
    sorted,
    wrongBucket,
    isComplete,
    selectItem,
    dropItem,
    dropInBucket,
    reset,
  };
}
