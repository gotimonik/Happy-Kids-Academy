"use client";

import { useRef, useState } from "react";
import { Eraser, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COLOR_PALETTE } from "@/features/games/coloring/use-coloring-game";
import { TraceCanvas, type TraceCanvasHandle } from "@/features/writing-practice/trace-canvas";
import type { DrawTool, ToolSize } from "@/features/writing-practice/use-trace-pad";
import { cn } from "@/lib/utils";

const SIZES: { value: ToolSize; label: string; dotClass: string }[] = [
  { value: "small", label: "Small", dotClass: "size-2.5" },
  { value: "medium", label: "Medium", dotClass: "size-4" },
  { value: "large", label: "Large", dotClass: "size-6" },
];

export function DrawingGame() {
  const [color, setColor] = useState<string>(COLOR_PALETTE[6]);
  const [tool, setTool] = useState<DrawTool>("pencil");
  const [size, setSize] = useState<ToolSize>("medium");
  const canvasRef = useRef<TraceCanvasHandle | null>(null);

  return (
    <div className="flex flex-col items-center gap-5">
      <TraceCanvas ref={canvasRef} guideText="" strokeColor={color} tool={tool} size={size} />

      <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Drawing tool">
        <button
          type="button"
          role="radio"
          aria-checked={tool === "pencil"}
          aria-label="Pencil"
          onClick={() => setTool("pencil")}
          className={cn(
            "flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold shadow-sm transition-transform focus-visible:outline-2 focus-visible:outline-ring",
            tool === "pencil"
              ? "scale-105 border-foreground bg-foreground text-background"
              : "border-border bg-card text-foreground",
          )}
        >
          <Pencil className="size-4" aria-hidden="true" />
          Pencil
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={tool === "eraser"}
          aria-label="Eraser"
          onClick={() => setTool("eraser")}
          className={cn(
            "flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold shadow-sm transition-transform focus-visible:outline-2 focus-visible:outline-ring",
            tool === "eraser"
              ? "scale-105 border-foreground bg-foreground text-background"
              : "border-border bg-card text-foreground",
          )}
        >
          <Eraser className="size-4" aria-hidden="true" />
          Eraser
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Brush size">
        {SIZES.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={size === option.value}
            aria-label={`${option.label} ${tool}`}
            onClick={() => setSize(option.value)}
            className={cn(
              "flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold shadow-sm transition-transform focus-visible:outline-2 focus-visible:outline-ring",
              size === option.value
                ? "scale-105 border-foreground bg-foreground text-background"
                : "border-border bg-card text-foreground",
            )}
          >
            <span
              className={cn(
                "rounded-full",
                option.dotClass,
                size === option.value ? "bg-background" : "bg-foreground",
              )}
              aria-hidden="true"
            />
            {option.label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "flex flex-wrap justify-center gap-2",
          tool === "eraser" && "pointer-events-none opacity-40",
        )}
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
              "size-10 rounded-full border-2 shadow-sm transition-transform focus-visible:outline-2 focus-visible:outline-ring",
              color === swatch ? "scale-110 border-foreground" : "border-border",
            )}
            style={{ backgroundColor: swatch }}
          />
        ))}
      </div>

      <Button type="button" variant="outline" onClick={() => canvasRef.current?.clear()}>
        Clear canvas
      </Button>
    </div>
  );
}
