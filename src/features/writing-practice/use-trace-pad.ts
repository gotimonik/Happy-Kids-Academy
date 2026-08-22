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

// Fraction of the pad's shorter side the guide glyph starts at before we
// check whether it actually fits. Wide/tall scripts get scaled down from
// here (see `fitGuideFont`) rather than always rendering at this size.
const BASE_FONT_RATIO = 0.65;

// Fraction of the pad's width/height the glyph's *visible ink* is allowed to
// occupy. Kept comfortably under 1 so nothing touches the rounded corners of
// the pad, independent of how tall/wide any given character turns out to be.
const GUIDE_INK_FIT_RATIO = 0.82;

// Alpha thresholds `computeGuideScore` uses to tell guide pixels, drawn
// strokes, and empty background apart in a single flattened pixel buffer.
// The guide glyph is filled at `GUIDE_OPACITY` (~56/255); a pencil stroke is
// drawn with a normal opaque color (~255/255) via source-over, so wherever
// ink lands on top of the guide the resulting alpha jumps well above either
// threshold — the two classes don't overlap, so a pixel can be read as
// "guide" and/or "ink" independently without ambiguity.
const GUIDE_MASK_ALPHA_THRESHOLD = 20;
const INK_ALPHA_THRESHOLD = 120;

/** Turns a computed `rgb(...)`/`rgba(...)` color string into one with a new alpha. */
function withAlpha(color: string, alpha: number): string {
  const channels = color.match(/[\d.]+/g);
  if (!channels || channels.length < 3) return color;
  const [r, g, b] = channels;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Measures `text` at `fontSize` and, if its actual ink extents (not the
 * font's advance-width em-box) would overflow the pad, scales the font down
 * so it fits inside `width`/`height` with `GUIDE_INK_FIT_RATIO` headroom.
 *
 * This matters because guide characters aren't all plain, symmetric Latin
 * letters — Gujarati/Hindi conjuncts and vowel signs (e.g. "ક્ષ", "અં") can be
 * visually much wider or taller than a single em, so a fixed
 * `min(width, height) * ratio` font size that works for "A" can spill past
 * the edges of the pad for those.
 *
 * Returns the (possibly reduced) font size together with the glyph's actual
 * bounding-box metrics at that final size, so the caller can also use them
 * to center the glyph by its ink rather than by font metrics (see below).
 */
function fitGuideFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  guideFont: string,
  baseFontSize: number,
  width: number,
  height: number,
): { fontSize: number; metrics: TextMetrics } {
  ctx.font = `bold ${baseFontSize}px ${guideFont}`;
  let metrics = ctx.measureText(text);
  const actualWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  // Some browsers/fonts can report all-zero actualBoundingBox* metrics (e.g.
  // a font that hasn't finished loading yet). Fall back to the base size
  // rather than dividing by zero or collapsing the glyph to nothing.
  if (!(actualWidth > 0) || !(actualHeight > 0)) {
    return { fontSize: baseFontSize, metrics };
  }

  const scale = Math.min(
    (width * GUIDE_INK_FIT_RATIO) / actualWidth,
    (height * GUIDE_INK_FIT_RATIO) / actualHeight,
    1, // only ever shrink to fit — never blow a normal letter up past its usual size
  );
  if (scale >= 1) {
    return { fontSize: baseFontSize, metrics };
  }

  const fontSize = baseFontSize * scale;
  ctx.font = `bold ${fontSize}px ${guideFont}`;
  metrics = ctx.measureText(text);
  return { fontSize, metrics };
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
  // Alpha-channel-only snapshot of the guide glyph, captured the instant
  // it's painted — before any stroke can land on top of it — so
  // `computeGuideScore` always has an unpolluted reference for "which
  // pixels are the letter" to compare the live canvas against. `null` for
  // the free-draw canvas (`guideText=""`), which has nothing to score.
  const guideMaskRef = useRef<Uint8ClampedArray | null>(null);
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

    if (guideText && width > 0 && height > 0) {
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
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const baseFontSize = Math.min(width, height) * BASE_FONT_RATIO;
      const { metrics } = fitGuideFont(ctx, guideText, guideFont, baseFontSize, width, height);

      // `textAlign: center` / `textBaseline: middle` center the glyph's *em
      // box* on the draw point, not its visible ink — fine for a plain
      // Latin letter, but scripts whose glyphs sit off-center within their
      // em box (Gujarati/Hindi conjuncts and vowel signs especially) end up
      // visibly shifted toward one edge of the pad. Re-derive the draw point
      // from the glyph's actual ink bounds instead, so every character —
      // however asymmetric — lands centered in the box.
      const actualWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
      const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      let drawX = width / 2;
      let drawY = height / 2;
      if (actualWidth > 0 && actualHeight > 0) {
        drawX += (metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2;
        drawY += (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      }

      ctx.fillText(guideText, drawX, drawY);

      // Snapshot just the alpha channel of what's on the canvas right now —
      // purely the guide glyph, since nothing else has been drawn yet this
      // paint. Pulling only every 4th byte (alpha) rather than keeping the
      // full RGBA buffer quarters the memory this holds onto for as long as
      // this guide is showing.
      const guideImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const mask = new Uint8ClampedArray(canvas.width * canvas.height);
      for (let pixel = 0; pixel < mask.length; pixel++) {
        mask[pixel] = guideImage.data[pixel * 4 + 3] ?? 0;
      }
      guideMaskRef.current = mask;
    } else {
      guideMaskRef.current = null;
    }

    // Resizing the canvas resets every context property (stroke color, line
    // width, composite mode) to its default, so restore the current pen here.
    ctx.strokeStyle = strokeColorRef.current;
    applyToolStyle(ctx, toolRef.current, sizeRef.current);
    // Deliberately NOT depending on `resolvedTheme` here: the color above
    // comes from `getComputedStyle`, which already reflects whatever theme
    // next-themes' blocking init script applied to <html> before this ever
    // ran — see the dedicated theme-change effect below for why redrawing
    // again specifically when `resolvedTheme` *resolves* (rather than
    // genuinely changes) would be both redundant and actively harmful.
  }, [guideText, applyToolStyle]);

  // Mount / resize / guide-text-or-theme-change: a genuine repaint whose
  // pixel dimensions may differ from before, so any earlier undo snapshots
  // are no longer valid — drop them rather than risk `undo` misdrawing a
  // mismatched size.
  const drawGuide = useCallback(() => {
    paintGuide();
    historyRef.current = [];
    notifyCanUndo(false);
  }, [paintGuide, notifyCanUndo]);

  // Always call the *latest* `drawGuide` from the theme-change effect below
  // without needing it in that effect's own dependency array — depending on
  // it directly would also fire this effect on every ordinary guide-text
  // change (any letter-to-letter navigation), which is exactly the
  // already-handled-elsewhere, don't-repaint-a-second-time case this whole
  // ref/effect pair exists to avoid.
  const drawGuideRef = useRef(drawGuide);
  useEffect(() => {
    drawGuideRef.current = drawGuide;
  }, [drawGuide]);

  // `next-themes` resolves `resolvedTheme` asynchronously on mount (reading
  // localStorage/system preference takes an effect, so it's `undefined` for
  // the first render or two of a fresh page load) — but the DOM's `class`
  // attribute is already set correctly *before* hydration, via next-themes'
  // own blocking init script (`suppressHydrationWarning` on `<html>` in
  // `layout.tsx` is the tell). So `getComputedStyle` above already reads the
  // right color from the very first paint, and repainting again purely
  // because `resolvedTheme` *became known* (`undefined` → a value) is both
  // redundant and, worse, can land after and silently wipe anything that ran
  // right after mount — e.g. Writing Practice restoring an in-progress
  // drawing. Only a real *known-theme → different-known-theme* toggle later
  // (the user actually flipping light/dark) needs to trigger a repaint here.
  const previousResolvedThemeRef = useRef(resolvedTheme);
  useEffect(() => {
    const previous = previousResolvedThemeRef.current;
    previousResolvedThemeRef.current = resolvedTheme;
    if (previous === undefined || previous === resolvedTheme) return;
    drawGuideRef.current();
  }, [resolvedTheme]);

  useEffect(() => {
    drawGuide();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") {
      // Fallback for older engines/webviews without ResizeObserver support —
      // still better than nothing, just misses non-viewport-driven resizes.
      window.addEventListener("resize", drawGuide);
      return () => window.removeEventListener("resize", drawGuide);
    }
    // A `window` resize listener alone misses container-size changes that
    // come from layout reflow rather than the viewport itself changing (web
    // fonts finishing load, sibling content wrapping to another line,
    // orientation changes on phones/tablets). Watching the container itself
    // is what actually keeps the guide letter sized and centered correctly
    // "for all screens and devices" rather than only on an explicit resize.
    // `ResizeObserver` always delivers one "initial" callback right after
    // `.observe()` starts, even though nothing has actually resized yet —
    // without skipping it, every mount repaints the guide *twice* (once
    // synchronously above, once again a moment later via this observer),
    // and that second, asynchronous repaint can land after — and silently
    // wipe — anything else that ran right after mount (e.g. Writing
    // Practice restoring an in-progress drawing once the pad is ready).
    let isInitialObservation = true;
    const observer = new ResizeObserver(() => {
      if (isInitialObservation) {
        isInitialObservation = false;
        return;
      }
      drawGuide();
    });
    observer.observe(container);
    return () => observer.disconnect();
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

  // Draws a previously-exported PNG (e.g. a saved drawing reopened for
  // editing) onto the canvas as its new starting content, stretched to fill
  // the current backing size — the source image's own pixel dimensions may
  // not match this device's if it was saved on a different screen. Doesn't
  // touch the undo stack: the first stroke drawn afterward snapshots this
  // loaded picture (via `pushHistorySnapshot` in `handlePointerDown`), so
  // `undo` naturally reverts *to* it rather than past it to a blank canvas.
  const loadImage = useCallback((dataUrl: string): Promise<void> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) {
        resolve();
        return;
      }
      const image = new Image();
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        historyRef.current = [];
        notifyCanUndo(false);
        resolve();
      };
      // A picture that fails to load (corrupt data URL) just leaves a blank
      // canvas rather than blocking the caller — same "fail soft" spirit as
      // the rest of this pad's error handling.
      image.onerror = () => resolve();
      image.src = dataUrl;
    });
  }, [notifyCanUndo]);

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

  // Scores how well the current drawing traces the guide glyph, as a 0–100
  // accuracy percentage — or `null` when there's nothing to score (no guide
  // to trace, or the pad is still completely untouched). Combines two
  // measures so both "missing the letter" and "scribbling everywhere" pull
  // the score down: `coverage` (how much of the guide got traced over) and
  // `precision` (how much of what was drawn actually landed on the guide,
  // rather than off to the side). Weighted toward coverage since finishing
  // the letter matters more than perfect neatness for a kid just learning
  // to trace it.
  const computeGuideScore = useCallback((): number | null => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const guideMask = guideMaskRef.current;
    if (!canvas || !ctx || !guideMask || guideMask.length === 0) return null;

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let guideCount = 0;
    let inkCount = 0;
    let coveredCount = 0;
    for (let pixel = 0; pixel < guideMask.length; pixel++) {
      const isGuide = (guideMask[pixel] ?? 0) > GUIDE_MASK_ALPHA_THRESHOLD;
      const isInk = (data[pixel * 4 + 3] ?? 0) > INK_ALPHA_THRESHOLD;
      if (isGuide) guideCount++;
      if (isInk) inkCount++;
      if (isGuide && isInk) coveredCount++;
    }

    if (guideCount === 0 || inkCount === 0) return null;

    const coverage = coveredCount / guideCount;
    const precision = coveredCount / inkCount;
    const accuracy = Math.max(0, Math.min(1, coverage * 0.65 + precision * 0.35));
    return Math.round(accuracy * 100);
  }, []);

  // Raw-pixel snapshot/restore pair, for a caller that wants to bring back
  // an *in-progress* drawing on a canvas that gets fully repainted (guide
  // and all) in between — e.g. Writing Practice remounts a fresh pad per
  // letter, so revisiting an earlier one needs its exact prior pixels back.
  // This deliberately doesn't reuse `exportPng`/`loadImage`: those flatten
  // onto an opaque white background for sharing/saving a picture, which
  // would erase the transparency `computeGuideScore` depends on to tell
  // "guide", "ink", and "untouched background" apart. `getImageData`/
  // `putImageData` round-trip the alpha channel exactly instead, so a
  // restored letter can still be scored correctly afterward.
  const exportSnapshot = useCallback((): ImageData | null => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return null;
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, []);

  const restoreSnapshot = useCallback((snapshot: ImageData) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    // A snapshot taken at a different canvas size (e.g. the pad was resized
    // in between) can't be dropped back in without distorting or misaligning
    // it — skip rather than risk a corrupted-looking restore.
    if (canvas.width !== snapshot.width || canvas.height !== snapshot.height) return;
    ctx.putImageData(snapshot, 0, 0);
    // Restoring replaces the picture wholesale, same as `loadImage` — the
    // next stroke drawn afterward snapshots this restored picture via
    // `pushHistorySnapshot` in `handlePointerDown`, so `undo` naturally
    // reverts *to* it rather than past it to a blank canvas.
    historyRef.current = [];
    notifyCanUndo(false);
  }, [notifyCanUndo]);

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
    loadImage,
    isBlank,
    computeGuideScore,
    exportSnapshot,
    restoreSnapshot,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
