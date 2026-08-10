"use client";

import { useState } from "react";
import { Check, Download, Images, Pencil, Trash2 } from "lucide-react";
import { StaticLink } from "@/components/shared/static-link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { saveImageToDevice } from "@/lib/save-image-to-device";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { useDrawingsStore } from "@/store/drawings-store";
import type { SavedDrawing } from "@/types/drawing";

function formatSavedAt(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type SaveToDeviceState = "idle" | "saving" | "saved" | "error";

function DrawingDialog({ drawing, onClose }: { drawing: SavedDrawing; onClose: () => void }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saveState, setSaveState] = useState<SaveToDeviceState>("idle");
  const deleteDrawing = useDrawingsStore((state) => state.deleteDrawing);

  async function handleSaveToDevice() {
    setSaveState("saving");
    const ok = await saveImageToDevice(drawing.dataUrl, `my-drawing-${drawing.id}.png`);
    setSaveState(ok ? "saved" : "error");
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>My Drawing</DialogTitle>
        </DialogHeader>

        {/* eslint-disable-next-line @next/next/no-img-element -- a saved base64 PNG, not an optimizable remote/static asset */}
        <img
          src={drawing.dataUrl}
          alt="Your saved drawing"
          className="w-full rounded-2xl border border-border bg-white"
        />
        <p className="text-center text-xs text-muted-foreground">Saved {formatSavedAt(drawing.updatedAt)}</p>

        {/* Three "kid"-sized buttons with real text labels don't fit side by
            side inside a max-w-md dialog — stacking full-width avoids the
            squeeze (and the square corners it was pushing past the card's
            rounded edge) regardless of screen size. */}
        <div className="mt-4 flex flex-col gap-2">
          <Button asChild size="md" className="w-full">
            <StaticLink href={`/games/drawing?edit=${drawing.id}`}>
              <Pencil className="size-5" aria-hidden="true" />
              Edit drawing
            </StaticLink>
          </Button>
          <Button
            type="button"
            variant={confirmingDelete ? "destructive" : "outline"}
            size="md"
            className="w-full"
            onClick={() => {
              if (confirmingDelete) {
                deleteDrawing(drawing.id);
                onClose();
                return;
              }
              setConfirmingDelete(true);
            }}
          >
            <Trash2 className="size-5" aria-hidden="true" />
            {confirmingDelete ? "Tap again to delete" : "Delete"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full"
            disabled={saveState === "saving"}
            onClick={handleSaveToDevice}
          >
            {saveState === "saved" ? <Check className="size-5" aria-hidden="true" /> : (
              <Download className="size-5" aria-hidden="true" />
            )}
            {saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
                ? "Saved!"
                : saveState === "error"
                  ? "Couldn't save — try again"
                  : "Save to device"}
          </Button>
          <DialogClose asChild>
            <Button type="button" size="md" className="w-full">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DrawingGallery() {
  const hydrated = useStoreHydrated(useDrawingsStore);
  // `drawings` is already kept newest-first inside the store itself (see
  // drawings-store.ts) — read it directly rather than through a selector
  // that would allocate a new sorted array on every call.
  const drawings = useDrawingsStore((state) => state.drawings);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeDrawing = drawings.find((drawing) => drawing.id === activeId) ?? null;

  if (!hydrated) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading your drawings"
        className="grid min-h-40 animate-pulse grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="aspect-square rounded-2xl bg-secondary" />
        ))}
      </div>
    );
  }

  if (drawings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-md">
        <Images className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-muted-foreground">
          No drawings saved yet. Make something in the Drawing game, then tap Save!
        </p>
        <Button asChild size="md">
          <StaticLink href="/games/drawing">Go to Drawing</StaticLink>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {drawings.map((drawing) => (
          <button
            key={drawing.id}
            type="button"
            onClick={() => setActiveId(drawing.id)}
            aria-label={`Open drawing saved ${formatSavedAt(drawing.updatedAt)}`}
            className="aspect-square overflow-hidden rounded-2xl border-2 border-border bg-white shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-ring"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- a saved base64 PNG, not an optimizable remote/static asset */}
            <img src={drawing.dataUrl} alt="" className="size-full object-contain" />
          </button>
        ))}
      </div>

      {activeDrawing && <DrawingDialog drawing={activeDrawing} onClose={() => setActiveId(null)} />}
    </>
  );
}
