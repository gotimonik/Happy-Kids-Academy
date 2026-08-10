/** One picture saved from the Coloring game — a rasterized PNG snapshot for display, plus (going forward) the region-fill data needed to reopen it for editing. */
export interface SavedColoring {
  readonly id: string;
  readonly dataUrl: string;
  /** The picture's display name at save time (e.g. "Temple", "Star") — scenes can't be looked up later if their id ever changes. */
  readonly sceneLabel: string;
  /**
   * Which scene/shape this was and its per-region colors at save time —
   * together they let "Edit" reopen this exact picture instead of a blank
   * one. Optional because colorings saved before "Edit" existed only ever
   * stored the flattened PNG above, with no region data to resume from.
   */
  readonly sceneId?: string;
  readonly fills?: Readonly<Record<string, string>>;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface ColoringGalleryState {
  readonly colorings: readonly SavedColoring[];
}

export const INITIAL_COLORING_GALLERY: ColoringGalleryState = {
  colorings: [],
};
