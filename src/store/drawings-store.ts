"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_DRAWING_GALLERY, type DrawingGalleryState, type SavedDrawing } from "@/types/drawing";

interface DrawingGalleryActions {
  /**
   * Creates a new saved drawing (`id: null`) or overwrites an existing one's
   * image in place (repeated "Save" taps on the same picture update it
   * rather than piling up near-duplicates), moving it to the front either
   * way. Returns the id to keep saving into — callers should remember it
   * for the next save/until "New Canvas".
   */
  saveDrawing: (id: string | null, dataUrl: string) => string;
  deleteDrawing: (id: string) => void;
}

export type DrawingGalleryStore = DrawingGalleryState & DrawingGalleryActions;

// Each saved PNG is a fairly large base64 string; localStorage is typically
// capped around 5MB per origin, so keep only the most recent pieces rather
// than growing without bound — oldest drops off first, like a rolling
// "recent creations" shelf rather than a permanent archive.
const MAX_SAVED_DRAWINGS = 40;

function generateId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `drawing-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// `drawings` is always kept newest-first *in the stored array itself* (both
// branches below place the changed entry at index 0) — components can read
// `state.drawings` straight off the store and get the right order for free.
// A derived selector that re-sorts on every call would instead allocate a
// new array each time, and handing `useSyncExternalStore` (what zustand's
// hook is built on) a snapshot that's never reference-equal to itself is
// exactly what causes an infinite render loop.
export const useDrawingsStore = create<DrawingGalleryStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_DRAWING_GALLERY,
      saveDrawing: (id, dataUrl) => {
        const now = Date.now();
        const existing = id ? get().drawings.find((drawing) => drawing.id === id) : undefined;

        if (existing) {
          const updated: SavedDrawing = { ...existing, dataUrl, updatedAt: now };
          set((state) => ({
            drawings: [updated, ...state.drawings.filter((drawing) => drawing.id !== existing.id)],
          }));
          return existing.id;
        }

        const created: SavedDrawing = { id: generateId(), dataUrl, createdAt: now, updatedAt: now };
        set((state) => ({
          drawings: [created, ...state.drawings].slice(0, MAX_SAVED_DRAWINGS),
        }));
        return created.id;
      },
      deleteDrawing: (id) =>
        set((state) => ({ drawings: state.drawings.filter((drawing) => drawing.id !== id) })),
    }),
    {
      name: "hka-drawings",
    },
  ),
);
