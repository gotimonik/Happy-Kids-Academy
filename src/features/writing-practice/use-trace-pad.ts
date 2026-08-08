"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export type DrawTool = "pencil" | "eraser";
export type ToolSize = "small" | "medium" | "large";

interface UseTracePadOptions {
  readonly guideText: string;
  readonly strokeColor: string;
  /** "pencil" (default) draws in `strokeColor`; "eraser" removes whatever's underneath instead. */
  readonly tool?: DrawTool;
  /** Brush thickness preset — "medium" (default) matches the original fixed width. */
  readonly size?: ToolSize;
  /** Fires whenever undo becomes available/unavailable, so a parent button can enable/disable itself. */
  readonly onCanUndoChange?: (canUndo: boolean) => void;
}

const GUIDE_OPACITY = 0.22;

// Eraser strokes are kept wider than the matching pencil size at every step —
// a kid's fingertip is imprecise, and a thin eraser is frustrating to
// actually catch a mistake with.
const PENCIL_WIDTHS: Record<ToolSize, number> = { small: 5, medium: 10, large: 18 };
const ERASER_WIDTHS: Record<ToolSize, number> = { small: 16, medium: 28, large: 42 };

// How many strokes (or clears) back "Undo" can step through. Each entry is a
// full pixel snapshot of the canvas, so this is capped fairly low to bound
// memory on lower-end devices/webviews rather than for any UX reason.
const MAX_UNDO_STEPS = 15;

/** Turns a computed `rgb(...)`/`rgba(...)` color string into one with a new alpha. */
function withAlpha(color: string, alpha: number): string {
  const channels = color.match(/[\d.]+/g);
  if (!channels || channels.length < 3) return color;
  const [r, g, b] = channels;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Canvas-based freehand writing pad: draws a faint guide glyph, then lets the
 * child trace over it with mouse/touch/pen input. Replaces the Android app's
 * manual `Path` stroke list drawn inside a custom `View.onDraw`.
 *
 * Also reused (with `guideText=""`) as the free-draw canvas — there, picking
 * a new pen color, switching to the eraser, or changing the brush size must
 * NOT clear what's already drawn. Resizing the `<canvas>` element (via
 * `paintGuide`, which also runs on mount and on a guide-text/theme change)
 * implicitly wipes its contents *and* resets every other context property
 * per the HTML canvas spec, so that path is kept strictly separate from
 * color/tool/size changes — those only ever touch `ctx.strokeStyle` /
 * `ctx.globalCompositeOperation` / `ctx.lineWidth` on the existing canvas,
 * via refs that `paintGuide` also uses to restore the current pen after a
 * real resize.
 */
export function useTracePad({
  guideText,
  strokeColor,
  tool = "pencil",
  size = "medium",
  onCanUndoChange,
}: UseTracePadOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const strokeColorRef = useRef(strokeColor);
  const toolRef = useRef(tool);
  const sizeRef = useRef(size);
  // Undo snapshots live in a ref, not React state — they're raw pixel
  // buffers taken on every stroke, so re-rendering on every push would be
  // both pointless (nothing on screen reads the stack itself) and wasteful.
  const historyRef = useRef<ImageData[]>([]);
  const onCanUndoChangeRef = useRef(onCanUndoChange);
  // Only used to trigger a redraw when the user toggles light/dark mode —
  // the actual color comes from the container's computed style below.
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    strokeColorRef.current = strokeColor;
  }, [strokeColor]);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    onCanUndoChangeRef.current = onCanUndoChange;
  }, [onCanUndoChange]);

  const notifyCanUndo = useCallback((canUndo: boolean) => {
    onCanUndoChangeRef.current?.(canUndo);
  }, []);

  const applyToolStyle = useCallback(
    (ctx: CanvasRenderingContext2D, activeTool: DrawTool, activeSize: ToolSize) => {
      ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
      ctx.lineWidth =
        activeTool === "eraser" ? ERASER_WIDTHS[activeSize] : PENCIL_WIDTHS[activeSize];
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    },
    [],
  );

  // Resizes the backing bitmap to match the container and redraws the guide
  // glyph. Does NOT touch the undo stack — callers decide separately whether
  // this particular repaint should be undoable (a real resize invalidates old
  // snapshots since their pixel dimensions no longer match; a deliberate
  // "Clear" should stay undoable).
  const paintGuide = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Canvas2D's `font` setter parses a plain CSS font string — it does not
    // resolve custom properties the way normal cascaded CSS does, so handing
    // it "var(--font-baloo)" literally fails silently and canvas falls back
    // to its 10px default, rendering the guide glyph almost invisibly small.
    // Read the variable's raw value (next/font's generated font-family list)
    // straight off the body instead, where it's applied via className.
    const guideFont =
      getComputedStyle(document.body).getPropertyValue("--font-baloo").trim() || "sans-serif";

    // A fixed low-opacity black guide disappears entirely against a dark
    // card background. Derive the guide color from the current (inherited)
    // foreground color instead, so it stays visible in both themes.
    const foreground = getComputedStyle(container).color;

    ctx.fillStyle = withAlpha(foreground, GUIDE_OPACITY);
    ctx.font = `bold ${Math.min(width, height) * 0.65}px ${guideFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(guideText, width / 2, height / 2);

    // Resizing the canvas resets every context property (stroke color, line
    // width, composite mode) to its default, so restore the current pen here.
    ctx.strokeStyle = strokeColorRef.current;
    applyToolStyle(ctx, toolRef.current, sizeRef.current);
  }, [guideText, resolvedTheme, applyToolStyle]);

  // Mount / resize / guide-text-or-theme-change: a genuine repaint whose
  // pixel dimensions may differ from before, so any earlier undo snapshots
  // are no longer valid — drop them rather than risk `undo` misdrawing a
  // mismatched size.
  const drawGuide = useCallback(() => {
    paintGuide();
    historyRef.current = [];
    notifyCanUndo(false);
  }, [paintGuide, notifyCanUndo]);

  useEffect(() => {
    drawGuide();
    window.addEventListener("resize", drawGuide);
    return () => window.removeEventListener("resize", drawGuide);
  }, [drawGuide]);

  // Switching pen colors, the pencil/eraser tool, or the brush size updates
  // only these properties on the *existing* canvas content — never clears or
  // resizes it, so a drawing in progress keeps everything drawn so far.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = strokeColor;
  }, [strokeColor]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    applyToolStyle(ctx, tool, size);
  }, [tool, size, applyToolStyle]);

  const pushHistorySnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > MAX_UNDO_STEPS) historyRef.current.shift();
    notifyCanUndo(true);
  }, [notifyCanUndo]);

  // "Clear" wipes the picture but — unlike a resize — keeps it undoable:
  // snapshot first, then repaint.
  const clear = useCallback(() => {
    pushHistorySnapshot();
    paintGuide();
  }, [pushHistorySnapshot, paintGuide]);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const snapshot = historyRef.current.pop();
    if (canvas && ctx && snapshot) {
      ctx.putImageData(snapshot, 0, 0);
    }
    notifyCanUndo(historyRef.current.length > 0);
  }, [notifyCanUndo]);

  // Exports the drawing as a downloadable/storable PNG. The live canvas has
  // a transparent background (only strokes are actual pixels — the white
  // card behind it is CSS, not canvas content), which would make a saved
  // file look broken against most viewers/backgrounds, so this composites
  // onto a plain white background first.
  const exportPng = useCallback((): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const output = document.createElement("canvas");
    output.width = canvas.width;
    output.height = canvas.height;
    const outCtx = output.getContext("2d");
    if (!outCtx) return null;
    outCtx.fillStyle = "#FFFFFF";
    outCtx.fillRect(0, 0, output.width, output.height);
    outCtx.drawImage(canvas, 0, 0);
    return output.toDataURL("image/png");
  }, []);

  // True when nothing has been drawn — every pixel is still fully
  // transparent. Only meaningful with `guideText=""` (the free-draw canvas):
  // a non-empty guide glyph is itself drawn with partial alpha, which would
  // make this report `false` even with no strokes on top of it.
  const isBlank = useCallback((): boolean => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return true;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] !== 0) return false;
    }
    return true;
  }, []);

  const getContext = () => canvasRef.current?.getContext("2d") ?? null;

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const ctx = getContext();
      if (!canvas || !ctx) return;
      // Snapshot before this stroke starts, so `undo` removes exactly the
      // stroke the child is about to draw — not an arbitrary amount of it.
      pushHistorySnapshot();
      canvas.setPointerCapture(event.pointerId);
      isDrawingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    },
    [pushHistorySnapshot],
  );

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
  }, []);

  const handlePointerUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  return {
    canvasRef,
    containerRef,
    clear,
    undo,
    exportPng,
    isBlank,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
