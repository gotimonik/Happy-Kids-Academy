"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Eraser, FilePlus2, Images, Pencil, Save, Trash2, Undo2 } from "lucide-react";
import { StaticLink } from "@/components/shared/static-link";
import { ToolIconButton } from "@/components/shared/tool-icon-button";
import { Button } from "@/components/ui/button";
import { COLOR_PALETTE } from "@/features/games/coloring/use-coloring-game";
import { TraceCanvas, type TraceCanvasHandle } from "@/features/writing-practice/trace-canvas";
import type { DrawTool, ToolSize } from "@/features/writing-practice/use-trace-pad";
import { useDrawingsStore } from "@/store/drawings-store";
import { cn } from "@/lib/utils";

const SIZES: { value: ToolSize; label: string; dotClass: string }[] = [
  { value: "small", label: "Small", dotClass: "size-1.5" },
  { value: "medium", label: "Medium", dotClass: "size-2.5" },
  { value: "large", label: "Large", dotClass: "size-4" },
];

// How long the "Saved!" confirmation stays up after tapping Save.
const SAVED_FLASH_MS = 1500;

function SizeButton({
  dotClass,
  label,
  active,
  onClick,
}: {
  dotClass: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 shadow-sm transition-transform focus-visible:outline-2 focus-visible:outline-ring active:scale-95",
        active ? "scale-105 border-foreground bg-foreground" : "border-border bg-card hover:bg-secondary",
      )}
    >
      <span
        className={cn("rounded-full", dotClass, active ? "bg-background" : "bg-foreground")}
        aria-hidden="true"
      />
    </button>
  );
}

export function DrawingGame() {
  const [color, setColor] = useState<string>(COLOR_PALETTE[6]);
  const [tool, setTool] = useState<DrawTool>("pencil");
  const [size, setSize] = useState<ToolSize>("medium");
  const [canUndo, setCanUndo] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [editingSaved, setEditingSaved] = useState(false);
  const canvasRef = useRef<TraceCanvasHandle | null>(null);
  // Tracks which gallery entry this canvas is currently drawing into, so
  // repeated Save taps on the same picture update it instead of piling up
  // near-duplicates. Reset to null by "New Canvas" so the next save starts
  // a fresh entry.
  const currentDrawingId = useRef<string | null>(null);
  const savedFlashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveDrawing = useDrawingsStore((state) => state.saveDrawing);

  useEffect(() => {
    return () => {
      if (savedFlashTimeout.current) clearTimeout(savedFlashTimeout.current);
    };
  }, []);

  // "Edit" from My Drawings links here as `?edit=<id>` — reopen that saved
  // picture onto the canvas so new strokes land on top of it, and keep
  // saving into the same gallery entry rather than creating a new one. The
  // id travels as a query param (not component state) because it has to
  // survive a full page reload: the native Capacitor app turns this link
  // into a hard `window.location` navigation (see `StaticLink`), which
  // clears any in-memory React state from the previous page.
  useEffect(() => {
    const editId = new URLSearchParams(window.location.search).get("edit");
    if (!editId) return;
    const drawing = useDrawingsStore.getState().drawings.find((entry) => entry.id === editId);
    if (!drawing) return;
    currentDrawingId.current = editId;
    // One-time load triggered by a URL param read on mount, same
    // "synchronize with an external system" case use-store-hydrated.ts
    // documents for the same lint rule — not a derived-state anti-pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditingSaved(true);
    void canvasRef.current?.loadImage(drawing.dataUrl);
    // Drop the query param so refreshing this page (or later saving a fresh
    // "New Canvas" and coming back) doesn't try to reload the same edit.
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  function flashSaved() {
    setJustSaved(true);
    if (savedFlashTimeout.current) clearTimeout(savedFlashTimeout.current);
    savedFlashTimeout.current = setTimeout(() => setJustSaved(false), SAVED_FLASH_MS);
  }

  /** Shared by the Save button and by "New Canvas" (which saves before clearing). Returns false if there was nothing to save. */
  function saveCurrentDrawing(): boolean {
    const canvas = canvasRef.current;
    if (!canvas || canvas.isBlank()) return false;
    const dataUrl = canvas.exportImage();
    if (!dataUrl) return false;
    currentDrawingId.current = saveDrawing(currentDrawingId.current, dataUrl);
    return true;
  }

  function handleSave() {
    if (saveCurrentDrawing()) flashSaved();
  }

  function handleNewCanvas() {
    saveCurrentDrawing();
    canvasRef.current?.clear();
    currentDrawingId.current = null;
    setEditingSaved(false);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {editingSaved && (
        <p className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-bold text-muted-foreground">
          Editing your saved drawing
        </p>
      )}

      {/* Shorter than a full square so the toolbar below always fits on
          screen too — kids shouldn't have to scroll to find a color. */}
      <TraceCanvas
        ref={canvasRef}
        guideText=""
        strokeColor={color}
        tool={tool}
        size={size}
        onCanUndoChange={setCanUndo}
        containerClassName="aspect-[4/3] max-w-sm"
      />

      <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2">
        <div
          className="flex gap-1.5 rounded-2xl bg-secondary/60 p-1.5"
          role="radiogroup"
          aria-label="Drawing tool"
        >
          <ToolIconButton
            icon={Pencil}
            label="Pencil"
            role="radio"
            active={tool === "pencil"}
            onClick={() => setTool("pencil")}
          />
          <ToolIconButton
            icon={Eraser}
            label="Eraser"
            role="radio"
            active={tool === "eraser"}
            onClick={() => setTool("eraser")}
          />
        </div>

        <div className="flex gap-1.5 rounded-2xl bg-secondary/60 p-1.5" role="radiogroup" aria-label="Brush size">
          {SIZES.map((option) => (
            <SizeButton
              key={option.value}
              dotClass={option.dotClass}
              label={`${option.label} ${tool}`}
              active={size === option.value}
              onClick={() => setSize(option.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2">
        <div className="flex gap-1.5 rounded-2xl bg-secondary/60 p-1.5">
          <ToolIconButton icon={Undo2} label="Undo" onClick={() => canvasRef.current?.undo()} disabled={!canUndo} />
          <ToolIconButton
            icon={Trash2}
            label="Clear canvas"
            tone="destructive"
            onClick={() => canvasRef.current?.clear()}
          />
        </div>

        <div className="flex gap-1.5 rounded-2xl bg-secondary/60 p-1.5">
          <ToolIconButton
            icon={justSaved ? Check : Save}
            label={justSaved ? "Saved!" : "Save drawing"}
            tone="success"
            active={justSaved}
            onClick={handleSave}
          />
          <ToolIconButton icon={FilePlus2} label="New canvas" onClick={handleNewCanvas} />
        </div>
      </div>

      <div
        className="flex w-full max-w-md flex-wrap justify-center gap-1.5"
        role="radiogroup"
        aria-label="Drawing color"
      >
        {COLOR_PALETTE.map((swatch) => (
          <button
            key={swatch}
            type="button"
            role="radio"
            aria-checked={color === swatch}
            aria-label={`Draw with ${swatch}`}
            disabled={tool === "eraser"}
            onClick={() => setColor(swatch)}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-transform focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40",
              color === swatch ? "scale-110 border-foreground" : "border-border",
            )}
            style={{ backgroundColor: swatch }}
          >
            {color === swatch && (
              <Check
                className={cn("size-4", swatch === "#FFFFFF" ? "text-foreground" : "text-white")}
                aria-hidden="true"
                strokeWidth={3}
              />
            )}
          </button>
        ))}
      </div>

      <Button asChild variant="outline" size="kid" className="w-full max-w-md">
        <StaticLink href="/games/drawing/gallery">
          <Images className="size-5" aria-hidden="true" />
          My Drawings
        </StaticLink>
      </Button>
    </div>
  );
}
