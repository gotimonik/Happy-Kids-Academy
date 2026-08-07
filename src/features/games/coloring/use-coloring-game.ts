"use client";

import { useCallback, useState } from "react";

export const COLOR_PALETTE = [
  "#EE6352", "#FFD166", "#45AAF2", "#37C183", "#A45EEA", "#FF9F43", "#2D3447", "#FFFFFF",
] as const;

/** The original house/tree/sun picture's regions. */
export const HOUSE_REGIONS = ["sun", "roof", "house", "door", "window", "tree-top", "tree-trunk"] as const;
export const TEMPLE_REGIONS = ["flag", "spire", "body", "pillar-left", "pillar-right", "door", "steps"] as const;
export const CAR_REGIONS = ["body", "roof", "window", "wheel-front", "wheel-back", "headlight"] as const;
export const BIKE_REGIONS = ["frame", "seat", "handlebar", "wheel-back", "wheel-front"] as const;
export const SCHOOL_REGIONS = ["roof", "building", "door", "window-left", "window-right", "flag"] as const;
export const BUILDING_REGIONS = ["roof", "building", "door", "window-1", "window-2", "window-3"] as const;

/**
 * Multi-region pictures — more interesting/detailed than the plain shapes
 * below (several fillable parts each, like the original house).
 */
export const STRUCTURE_SCENES = [
  { id: "house", label: "House", symbol: "🏠" },
  { id: "temple", label: "Temple", symbol: "🛕" },
  { id: "car", label: "Car", symbol: "🚗" },
  { id: "bike", label: "Bike", symbol: "🚲" },
  { id: "school", label: "School", symbol: "🏫" },
  { id: "building", label: "Building", symbol: "🏢" },
] as const;

export type StructureSceneId = (typeof STRUCTURE_SCENES)[number]["id"];

const STRUCTURE_REGIONS: Record<StructureSceneId, readonly string[]> = {
  house: HOUSE_REGIONS,
  temple: TEMPLE_REGIONS,
  car: CAR_REGIONS,
  bike: BIKE_REGIONS,
  school: SCHOOL_REGIONS,
  building: BUILDING_REGIONS,
};

/**
 * Ten simple, single-region shapes to color — quicker and easier than the
 * structures above. Same ten shapes as the Shapes learning category, but
 * kept as its own small list here rather than imported: this is free play
 * (no labels, speech, or "detail" text needed), not a lesson.
 */
export const SHAPE_SCENES = [
  { id: "circle", label: "Circle", symbol: "●" },
  { id: "square", label: "Square", symbol: "■" },
  { id: "triangle", label: "Triangle", symbol: "▲" },
  { id: "rectangle", label: "Rectangle", symbol: "▭" },
  { id: "star", label: "Star", symbol: "★" },
  { id: "oval", label: "Oval", symbol: "⬭" },
  { id: "diamond", label: "Diamond", symbol: "◆" },
  { id: "heart", label: "Heart", symbol: "♥" },
  { id: "pentagon", label: "Pentagon", symbol: "⬟" },
  { id: "hexagon", label: "Hexagon", symbol: "⬢" },
] as const;

export type ShapeSceneId = (typeof SHAPE_SCENES)[number]["id"];
export type SceneId = StructureSceneId | ShapeSceneId;

export const SCENES: ReadonlyArray<{ readonly id: SceneId; readonly label: string; readonly symbol: string }> = [
  ...STRUCTURE_SCENES,
  ...SHAPE_SCENES,
];

const STRUCTURE_IDS: ReadonlySet<string> = new Set(STRUCTURE_SCENES.map((scene) => scene.id));

/** True for the multi-part pictures (house, temple, car, ...); false for the plain single-region shapes. */
export function isStructureScene(sceneId: SceneId): sceneId is StructureSceneId {
  return STRUCTURE_IDS.has(sceneId);
}

/** A colorable sub-area within a scene — several named areas for structures, just "shape" for plain shapes. */
export type ColoringRegion = string;

export const UNCOLORED_FILL = "#F1F2F6";

function regionsForScene(sceneId: SceneId): readonly string[] {
  return isStructureScene(sceneId) ? STRUCTURE_REGIONS[sceneId] : ["shape"];
}

function defaultFillsForScene(sceneId: SceneId): Record<string, string> {
  return Object.fromEntries(regionsForScene(sceneId).map((region) => [region, UNCOLORED_FILL]));
}

function initialFillsByScene(): Record<SceneId, Record<string, string>> {
  return Object.fromEntries(
    SCENES.map((scene) => [scene.id, defaultFillsForScene(scene.id)] as const),
  ) as Record<SceneId, Record<string, string>>;
}

export function useColoringGame() {
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_PALETTE[0]);
  const [sceneId, setSceneId] = useState<SceneId>("house");
  // Each scene keeps its own fills, so switching pictures and back doesn't
  // lose progress on either one — every picture stays colored in for the
  // rest of the session.
  const [fillsByScene, setFillsByScene] = useState<Record<SceneId, Record<string, string>>>(initialFillsByScene);

  const fillRegion = useCallback(
    (region: ColoringRegion) => {
      setFillsByScene((prev) => ({
        ...prev,
        [sceneId]: { ...prev[sceneId], [region]: selectedColor },
      }));
    },
    [sceneId, selectedColor],
  );

  const reset = useCallback(() => {
    setFillsByScene((prev) => ({ ...prev, [sceneId]: defaultFillsForScene(sceneId) }));
  }, [sceneId]);

  return {
    selectedColor,
    setSelectedColor,
    sceneId,
    setSceneId,
    scenes: SCENES,
    fills: fillsByScene[sceneId],
    fillRegion,
    reset,
  };
}
