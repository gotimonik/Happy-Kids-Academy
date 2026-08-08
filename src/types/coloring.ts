/** One picture saved from the Coloring game — a rasterized PNG snapshot, not the region-fill data, so it displays fine even after the scene list changes. */
export interface SavedColoring {
  readonly id: string;
  readonly dataUrl: string;
  /** The picture's display name at save time (e.g. "Temple", "Star") — scenes can't be looked up later if their id ever changes. */
  readonly sceneLabel: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface ColoringGalleryState {
  readonly colorings: readonly SavedColoring[];
}

export const INITIAL_COLORING_GALLERY: ColoringGalleryState = {
  colorings: [],
};
