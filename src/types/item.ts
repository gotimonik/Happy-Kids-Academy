/**
 * A single learnable unit inside a category — a letter, number, animal, etc.
 * Ported 1:1 from the Android `Item` model (EnhancedLearningView.java).
 */
export interface LearningItem {
  /** Stable id, e.g. "alphabet-a". Used as a React key and for analytics. */
  readonly id: string;
  /** Glyph/number/shape shown large, e.g. "A", "5", "●". Omit for photo-style items. */
  readonly symbol?: string;
  /** Decorative emoji icon, e.g. "🦁". Always paired with a text alternative. */
  readonly icon?: string;
  /**
   * Path to a small illustration under /public (e.g. "/images/produce/cauliflower.svg"),
   * used instead of `icon` when a plain Unicode emoji doesn't exist for this
   * item or would be a poor/misleading picture of it (e.g. no cauliflower or
   * pomegranate emoji). When set, this takes priority over `icon` for
   * anything that shows the item's picture; `icon` is still kept as the
   * simple text fallback for contexts that only handle plain text.
   */
  readonly image?: string;
  /** Primary label, e.g. "Apple". */
  readonly label: string;
  /** Secondary detail line, e.g. "Pronunciation: A" or "Odd • ●●●". */
  readonly detail: string;
  /** Text sent to the speech synthesizer when "Pronounce" is tapped. */
  readonly speech: string;
  /** Optional sound word for animals/birds, e.g. "Roar". Spoken slower/lower. */
  readonly sound?: string;
  /** Hex color for color-swatch items (Colors category only). */
  readonly visualColor?: string;
}
