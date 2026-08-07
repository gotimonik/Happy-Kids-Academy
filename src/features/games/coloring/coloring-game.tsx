"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColoringScene } from "./coloring-scene";
import { COLOR_PALETTE, SHAPE_SCENES, STRUCTURE_SCENES, useColoringGame } from "./use-coloring-game";
import type { SceneId } from "./use-coloring-game";

function ScenePicker({
  label,
  scenes,
  sceneId,
  onSelect,
}: {
  label: string;
  scenes: ReadonlyArray<{ readonly id: SceneId; readonly label: string; readonly symbol: string }>;
  sceneId: SceneId;
  onSelect: (id: SceneId) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label={label}>
        {scenes.map((scene) => (
          <button
            key={scene.id}
            type="button"
            role="radio"
            aria-checked={sceneId === scene.id}
            onClick={() => onSelect(scene.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-ring",
              sceneId === scene.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-secondary",
            )}
          >
            <span aria-hidden="true">{scene.symbol}</span>
            {scene.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ColoringGame() {
  const { selectedColor, setSelectedColor, sceneId, setSceneId, fills, fillRegion, reset } = useColoringGame();

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-3">
        <ScenePicker label="Pictures" scenes={STRUCTURE_SCENES} sceneId={sceneId} onSelect={setSceneId} />
        <ScenePicker label="Shapes" scenes={SHAPE_SCENES} sceneId={sceneId} onSelect={setSceneId} />
      </div>

      <ColoringScene sceneId={sceneId} fills={fills} onRegionClick={fillRegion} />

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
