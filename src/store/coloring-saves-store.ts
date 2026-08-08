"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_COLORING_GALLERY, type ColoringGalleryState, type SavedColoring } from "@/types/coloring";

interface ColoringGalleryActions {
  /**
   * Creates a new saved coloring (`id: null`) or overwrites an existing
   * one's image in place (repeated "Save" taps on the same picture update
   * it rather than piling up near-duplicates), moving it to the front
   * either way. Returns the id to keep saving into — callers should
   * remember it (per scene) for the next save/until "New Design".
   */
  saveColoring: (id: string | null, dataUrl: string, sceneLabel: string) => string;
  deleteColoring: (id: string) => void;
}

export type ColoringGalleryStore = ColoringGalleryState & ColoringGalleryActions;

// Each saved PNG is a fairly large base64 string; localStorage is typically
// capped around 5MB per origin, so keep only the most recent pieces rather
// than growing without bound — oldest drops off first, like a rolling
// "recent creations" shelf rather than a permanent archive.
const MAX_SAVED_COLORINGS = 40;

function generateId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `coloring-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// `colorings` is always kept newest-first *in the stored array itself* (both
// branches below place the changed entry at index 0) — see the matching
// note in drawings-store.ts for why a derived/re-sorting selector would
// instead trip up `useSyncExternalStore`'s snapshot caching.
export const useColoringSavesStore = create<ColoringGalleryStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_COLORING_GALLERY,
      saveColoring: (id, dataUrl, sceneLabel) => {
        const now = Date.now();
        const existing = id ? get().colorings.find((coloring) => coloring.id === id) : undefined;

        if (existing) {
          const updated: SavedColoring = { ...existing, dataUrl, sceneLabel, updatedAt: now };
          set((state) => ({
            colorings: [updated, ...state.colorings.filter((coloring) => coloring.id !== existing.id)],
          }));
          return existing.id;
        }

        const created: SavedColoring = {
          id: generateId(),
          dataUrl,
          sceneLabel,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          colorings: [created, ...state.colorings].slice(0, MAX_SAVED_COLORINGS),
        }));
        return created.id;
      },
      deleteColoring: (id) =>
        set((state) => ({ colorings: state.colorings.filter((coloring) => coloring.id !== id) })),
    }),
    {
      name: "hka-colorings",
    },
  ),
);
