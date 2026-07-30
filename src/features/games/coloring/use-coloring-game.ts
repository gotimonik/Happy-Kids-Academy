"use client";

import { useCallback, useState } from "react";

export const COLOR_PALETTE = [
  "#EE6352", "#FFD166", "#45AAF2", "#37C183", "#A45EEA", "#FF9F43", "#2D3447", "#FFFFFF",
] as const;

export const COLORING_REGIONS = ["sun", "roof", "house", "door", "window", "tree-top", "tree-trunk"] as const;
export type ColoringRegion = (typeof COLORING_REGIONS)[number];

const DEFAULT_FILLS: Record<ColoringRegion, string> = {
  sun: "#F1F2F6",
  roof: "#F1F2F6",
  house: "#F1F2F6",
  door: "#F1F2F6",
  window: "#F1F2F6",
  "tree-top": "#F1F2F6",
  "tree-trunk": "#F1F2F6",
};

export function useColoringGame() {
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_PALETTE[0]);
  const [fills, setFills] = useState<Record<ColoringRegion, string>>(DEFAULT_FILLS);

  const fillRegion = useCallback(
    (region: ColoringRegion) => {
      setFills((prev) => ({ ...prev, [region]: selectedColor }));
    },
    [selectedColor],
  );

  const reset = useCallback(() => setFills(DEFAULT_FILLS), []);

  return { selectedColor, setSelectedColor, fills, fillRegion, reset };
}
