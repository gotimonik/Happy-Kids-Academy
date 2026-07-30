"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { COLOR_PALETTE } from "@/features/games/coloring/use-coloring-game";
import { TraceCanvas, type TraceCanvasHandle } from "@/features/writing-practice/trace-canvas";
import { cn } from "@/lib/utils";

export function DrawingGame() {
  const [color, setColor] = useState<string>(COLOR_PALETTE[6]);
  const canvasRef = useRef<TraceCanvasHandle | null>(null);

  return (
    <div className="flex flex-col items-center gap-5">
      <TraceCanvas ref={canvasRef} guideText="" strokeColor={color} />

      <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Drawing color">
        {COLOR_PALETTE.map((swatch) => (
          <button
            key={swatch}
            type="button"
            role="radio"
            aria-checked={color === swatch}
            aria-label={`Draw with ${swatch}`}
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
