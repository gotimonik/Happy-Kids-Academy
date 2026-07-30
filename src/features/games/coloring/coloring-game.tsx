"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColoringScene } from "./coloring-scene";
import { COLOR_PALETTE, useColoringGame } from "./use-coloring-game";

export function ColoringGame() {
  const { selectedColor, setSelectedColor, fills, fillRegion, reset } = useColoringGame();

  return (
    <div className="flex flex-col items-center gap-5">
      <ColoringScene fills={fills} onRegionClick={fillRegion} />

      <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Color palette">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={selectedColor === color}
            aria-label={`Color ${color}`}
            onClick={() => setSelectedColor(color)}
            className={cn(
              "size-10 rounded-full border-2 shadow-sm transition-transform focus-visible:outline-2 focus-visible:outline-ring",
              selectedColor === color ? "scale-110 border-foreground" : "border-border",
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <Button type="button" variant="outline" onClick={reset}>
        Clear colors
      </Button>
    </div>
  );
}
