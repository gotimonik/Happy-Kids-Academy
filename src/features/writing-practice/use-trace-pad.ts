"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseTracePadOptions {
  readonly guideText: string;
  readonly strokeColor: string;
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

    ctx.fillStyle = "#00000014";
    ctx.font = `bold ${Math.min(width, height) * 0.65}px var(--font-baloo), sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(guideText, width / 2, height / 2);

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [guideText, strokeColor]);

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
