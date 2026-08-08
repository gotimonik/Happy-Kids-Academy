"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FilePlus2, Images, Save, Trash2, Undo2 } from "lucide-react";
import { StaticLink } from "@/components/shared/static-link";
import { ToolIconButton } from "@/components/shared/tool-icon-button";
import { Button } from "@/components/ui/button";
import { svgToPngDataUrl } from "@/lib/svg-to-png";
import { cn } from "@/lib/utils";
import { useColoringSavesStore } from "@/store/coloring-saves-store";
import { ColoringScene } from "./coloring-scene";
import {
  COLOR_PALETTE,
  SHAPE_SCENES,
  STRUCTURE_SCENES,
  UNCOLORED_FILL,
  useColoringGame,
} from "./use-coloring-game";
import type { SceneId } from "./use-coloring-game";

// How long the "Saved!" confirmation stays up after tapping Save.
const SAVED_FLASH_MS = 1500;

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
    <div className="flex w-full max-w-md flex-col gap-1">
      <span className="pl-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      {/* A single scrollable row rather than flex-wrap — with 6-10 scenes
          per picker, wrapping would eat several extra rows of vertical
          space that a horizontal swipe doesn't cost. Scrollbar hidden since
          it's swipeable on touch and the row edges make "more this way"
          obvious enough without one. */}
      <div
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="radiogroup"
        aria-label={label}
      >
        {scenes.map((scene) => (
          <button
            key={scene.id}
            type="button"
            role="radio"
            aria-checked={sceneId === scene.id}
            onClick={() => onSelect(scene.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-ring",
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
  const { selectedColor, setSelectedColor, sceneId, setSceneId, scenes, fills, fillRegion, undo, canUndo, reset } =
    useColoringGame();

  const [justSaved, setJustSaved] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  // Tracks which gallery entry *each picture* is currently saving into, so
  // repeated Save taps on the same one update it instead of piling up
  // near-duplicates — keyed by scene because every picture has its own
  // independent coloring progress already (see useColoringGame).
  const currentIdBySceneRef = useRef<Partial<Record<SceneId, string>>>({});
  const savedFlashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveColoring = useColoringSavesStore((state) => state.saveColoring);

  useEffect(() => {
    return () => {
      if (savedFlashTimeout.current) clearTimeout(savedFlashTimeout.current);
    };
  }, []);

  function flashSaved() {
    setJustSaved(true);
    if (savedFlashTimeout.current) clearTimeout(savedFlashTimeout.current);
    savedFlashTimeout.current = setTimeout(() => setJustSaved(false), SAVED_FLASH_MS);
  }

  /** Shared by the Save button and by "New Design" (which saves before resetting). Returns false if there was nothing to save. */
  async function saveCurrentPicture(): Promise<boolean> {
    const svg = svgRef.current;
    const isBlank = Object.values(fills).every((value) => value === UNCOLORED_FILL);
    if (!svg || isBlank) return false;
    const dataUrl = await svgToPngDataUrl(svg);
    if (!dataUrl) return false;
    const sceneLabel = scenes.find((scene) => scene.id === sceneId)?.label ?? sceneId;
    currentIdBySceneRef.current[sceneId] = saveColoring(
      currentIdBySceneRef.current[sceneId] ?? null,
      dataUrl,
      sceneLabel,
    );
    return true;
  }

  async function handleSave() {
    if (await saveCurrentPicture()) flashSaved();
  }

  async function handleNewDesign() {
    await saveCurrentPicture();
    reset();
    delete currentIdBySceneRef.current[sceneId];
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full max-w-md flex-col items-center gap-1.5">
        <ScenePicker label="Pictures" scenes={STRUCTURE_SCENES} sceneId={sceneId} onSelect={setSceneId} />
        <ScenePicker label="Shapes" scenes={SHAPE_SCENES} sceneId={sceneId} onSelect={setSceneId} />
      </div>

      <ColoringScene ref={svgRef} sceneId={sceneId} fills={fills} onRegionClick={fillRegion} />

      <div
        className="flex w-full max-w-md flex-wrap justify-center gap-1.5"
        role="radiogroup"
        aria-label="Color palette"
      >
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={selectedColor === color}
            aria-label={`Color ${color}`}
            onClick={() => setSelectedColor(color)}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-transform focus-visible:outline-2 focus-visible:outline-ring",
              selectedColor === color ? "scale-110 border-foreground" : "border-border",
            )}
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && (
              <Check
                className={cn("size-4", color === "#FFFFFF" ? "text-foreground" : "text-white")}
                aria-hidden="true"
                strokeWidth={3}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2">
        <div className="flex gap-1.5 rounded-2xl bg-secondary/60 p-1.5">
          <ToolIconButton icon={Undo2} label="Undo" onClick={undo} disabled={!canUndo} />
          <ToolIconButton icon={Trash2} label="Clear colors" tone="destructive" onClick={reset} />
        </div>

        <div className="flex gap-1.5 rounded-2xl bg-secondary/60 p-1.5">
          <ToolIconButton
            icon={justSaved ? Check : Save}
            label={justSaved ? "Saved!" : "Save picture"}
            tone="success"
            active={justSaved}
            onClick={handleSave}
          />
          <ToolIconButton icon={FilePlus2} label="New design" onClick={handleNewDesign} />
        </div>
      </div>

      <Button asChild variant="outline" size="kid" className="w-full max-w-md">
        <StaticLink href="/games/coloring/gallery">
          <Images className="size-5" aria-hidden="true" />
          My Colorings
        </StaticLink>
      </Button>
    </div>
  );
}
