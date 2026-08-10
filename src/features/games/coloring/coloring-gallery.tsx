"use client";

import { useState } from "react";
import { Check, Download, Images, Pencil, Trash2 } from "lucide-react";
import { StaticLink } from "@/components/shared/static-link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { saveImageToDevice } from "@/lib/save-image-to-device";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { useColoringSavesStore } from "@/store/coloring-saves-store";
import type { SavedColoring } from "@/types/coloring";

function formatSavedAt(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type SaveToDeviceState = "idle" | "saving" | "saved" | "error";

function ColoringDialog({ coloring, onClose }: { coloring: SavedColoring; onClose: () => void }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saveState, setSaveState] = useState<SaveToDeviceState>("idle");
  const deleteColoring = useColoringSavesStore((state) => state.deleteColoring);

  async function handleSaveToDevice() {
    setSaveState("saving");
    const ok = await saveImageToDevice(coloring.dataUrl, `my-coloring-${coloring.id}.png`);
    setSaveState(ok ? "saved" : "error");
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coloring.sceneLabel}</DialogTitle>
        </DialogHeader>

        {/* eslint-disable-next-line @next/next/no-img-element -- a saved base64 PNG, not an optimizable remote/static asset */}
        <img
          src={coloring.dataUrl}
          alt={`Your colored ${coloring.sceneLabel}`}
          className="w-full rounded-2xl border border-border bg-white"
        />
        <p className="text-center text-xs text-muted-foreground">Saved {formatSavedAt(coloring.updatedAt)}</p>

        {/* Stacked full-width, not the shared DialogFooter's row layout —
            three "kid"-sized buttons with real text labels don't fit side
            by side inside a max-w-md dialog. */}
        <div className="mt-4 flex flex-col gap-2">
          {/* Only colorings saved after "Edit" shipped carry `sceneId`/`fills`
              (the region data needed to reopen this exact picture) — older
              ones are a flattened PNG only, so there's nothing to resume
              coloring into and the button is left off rather than offering
              something that can't work. */}
          {coloring.sceneId && coloring.fills && (
            <Button asChild size="md" className="w-full">
              <StaticLink href={`/games/coloring?edit=${coloring.id}`}>
                <Pencil className="size-5" aria-hidden="true" />
                Edit coloring
              </StaticLink>
            </Button>
          )}
          <Button
            type="button"
            variant={confirmingDelete ? "destructive" : "outline"}
            size="md"
            className="w-full"
            onClick={() => {
              if (confirmingDelete) {
                deleteColoring(coloring.id);
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

export function ColoringGallery() {
  const hydrated = useStoreHydrated(useColoringSavesStore);
  // `colorings` is already kept newest-first inside the store itself (see
  // coloring-saves-store.ts) — read it directly rather than through a
  // selector that would allocate a new sorted array on every call.
  const colorings = useColoringSavesStore((state) => state.colorings);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeColoring = colorings.find((coloring) => coloring.id === activeId) ?? null;

  if (!hydrated) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading your colorings"
        className="grid min-h-40 animate-pulse grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="aspect-square rounded-2xl bg-secondary" />
        ))}
      </div>
    );
  }

  if (colorings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-md">
        <Images className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-muted-foreground">
          No colorings saved yet. Color a picture in the Coloring game, then tap Save!
        </p>
        <Button asChild size="md">
          <StaticLink href="/games/coloring">Go to Coloring</StaticLink>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {colorings.map((coloring) => (
          <button
            key={coloring.id}
            type="button"
            onClick={() => setActiveId(coloring.id)}
            aria-label={`Open ${coloring.sceneLabel} saved ${formatSavedAt(coloring.updatedAt)}`}
            className="flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-white shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="aspect-square w-full">
              {/* eslint-disable-next-line @next/next/no-img-element -- a saved base64 PNG, not an optimizable remote/static asset */}
              <img src={coloring.dataUrl} alt="" className="size-full object-contain" />
            </span>
            <span className="truncate px-2 py-1 text-xs font-bold text-muted-foreground">{coloring.sceneLabel}</span>
          </button>
        ))}
      </div>

      {activeColoring && <ColoringDialog coloring={activeColoring} onClose={() => setActiveId(null)} />}
    </>
  );
}
