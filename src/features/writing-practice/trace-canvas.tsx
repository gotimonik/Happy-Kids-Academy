"use client";

import { forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import { useTracePad, type DrawTool, type ToolSize } from "./use-trace-pad";

export interface TraceCanvasHandle {
  clear: () => void;
  undo: () => void;
  /** PNG data URL of the current drawing on a white background, or `null` if the canvas isn't ready. */
  exportImage: () => string | null;
  /** Draws a previously-exported PNG onto the canvas as its starting content — used to reopen a saved drawing for editing. */
  loadImage: (dataUrl: string) => Promise<void>;
  /** True when nothing has been drawn yet (see `useTracePad`'s `isBlank` for the `guideText=""` caveat). */
  isBlank: () => boolean;
  /** 0–100 trace-accuracy score against the guide glyph, or `null` if there's no guide or nothing's been drawn yet. See `useTracePad`'s `computeGuideScore`. */
  score: () => number | null;
  /** Raw-pixel snapshot of exactly what's on the pad right now (guide + ink, alpha-exact) — or `null` if the canvas isn't ready. Pairs with `restoreSnapshot` to bring an in-progress drawing back after the pad's been fully repainted (e.g. remounted for a different guide letter). Not for saving/sharing — see `exportImage` for that. */
  exportSnapshot: () => ImageData | null;
  /** Drops a previously-`exportSnapshot`'d picture back onto the pad exactly as captured. No-ops if the pad's pixel size has changed since the snapshot was taken. */
  restoreSnapshot: (snapshot: ImageData) => void;
}

export const TraceCanvas = forwardRef<
  TraceCanvasHandle,
  {
    guideText: string;
    strokeColor: string;
    tool?: DrawTool;
    size?: ToolSize;
    onCanUndoChange?: (canUndo: boolean) => void;
    /** Overrides the container's default `aspect-square w-full max-w-md` sizing —
     * e.g. a shorter aspect ratio so the whole toolbar fits on screen with it. */
    containerClassName?: string;
  }
>(function TraceCanvas({ guideText, strokeColor, tool, size, onCanUndoChange, containerClassName }, ref) {
  const {
    canvasRef,
    containerRef,
    clear,
    undo,
    exportPng,
    loadImage,
    isBlank,
    computeGuideScore,
    exportSnapshot,
    restoreSnapshot,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useTracePad({ guideText, strokeColor, tool, size, onCanUndoChange });

  useImperativeHandle(
    ref,
    () => ({
      clear,
      undo,
      exportImage: exportPng,
      loadImage,
      isBlank,
      score: computeGuideScore,
      exportSnapshot,
      restoreSnapshot,
    }),
    [clear, undo, exportPng, loadImage, isBlank, computeGuideScore, exportSnapshot, restoreSnapshot],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "aspect-square w-full max-w-md self-center overflow-hidden rounded-3xl border border-border bg-card shadow-lg",
        containerClassName,
      )}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Writing practice pad. Guide letter ${guideText}. Draw with your mouse, finger, or stylus.`}
        className="touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  );
});
