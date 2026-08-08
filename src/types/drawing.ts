/** One picture saved from the free-draw canvas — a full PNG, not a stroke list, since there's no vector history to replay. */
export interface SavedDrawing {
  readonly id: string;
  readonly dataUrl: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface DrawingGalleryState {
  readonly drawings: readonly SavedDrawing[];
}

export const INITIAL_DRAWING_GALLERY: DrawingGalleryState = {
  drawings: [],
};
