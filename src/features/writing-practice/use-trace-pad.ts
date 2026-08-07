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
}

const GUIDE_OPACITY = 0.22;

// Eraser strokes are kept wider than the matching pencil size at every step —
// a kid's fingertip is imprecise, and a thin eraser is frustrating to
// actually catch a mistake with.
const PENCIL_WIDTHS: Record<ToolSize, number> = { small: 5, medium: 10, large: 18 };
const ERASER_WIDTHS: Record<ToolSize, number> = { small: 16, medium: 28, large: 42 };

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
 * `drawGuide`, which also runs on mount and on a guide-text/theme change)
 * implicitly wipes its contents *and* resets every other context property
 * per the HTML canvas spec, so that path is kept strictly separate from
 * color/tool/size changes — those only ever touch `ctx.strokeStyle` /
 * `ctx.globalCompositeOperation` / `ctx.lineWidth` on the existing canvas,
 * via refs that `drawGuide` also uses to restore the current pen after a
 * real resize.
 */
export function useTracePad({
  guideText,
  strokeColor,
  tool = "pencil",
  size = "medium",
}: UseTracePadOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const strokeColorRef = useRef(strokeColor);
  const toolRef = useRef(tool);
  const sizeRef = useRef(size);
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

  const drawGuide = useCallback(() => {
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

  const getContext = () => canvasRef.current?.getContext("2d") ?? null;

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    canvas.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
  }, []);

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
    clear: drawGuide,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
