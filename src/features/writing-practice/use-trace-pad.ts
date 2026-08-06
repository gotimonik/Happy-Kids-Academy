"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface UseTracePadOptions {
  readonly guideText: string;
  readonly strokeColor: string;
}

const GUIDE_OPACITY = 0.22;

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
 */
export function useTracePad({ guideText, strokeColor }: UseTracePadOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  // Only used to trigger a redraw when the user toggles light/dark mode —
  // the actual color comes from the container's computed style below.
  const { resolvedTheme } = useTheme();

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

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [guideText, strokeColor, resolvedTheme]);

  useEffect(() => {
    drawGuide();
    window.addEventListener("resize", drawGuide);
    return () => window.removeEventListener("resize", drawGuide);
  }, [drawGuide]);

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
