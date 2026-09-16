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
  /**
   * A short, kid-friendly fun fact about this specific item — e.g. "Lions
   * live together in a family group called a pride." Shown alongside the
   * item (Learn flash cards, Writing Practice) so kids pick up a little
   * real-world knowledge about what they're looking at/tracing, not just
   * its name. Optional: categories like Numbers and Math facts don't have
   * a "thing" to describe, so they simply omit it.
   */
  readonly fact?: string;
  /** Text sent to the speech synthesizer when "Pronounce" is tapped. */
  readonly speech: string;
  /** Optional sound word for animals/birds, e.g. "Roar". Spoken slower/lower. */
  readonly sound?: string;
  /** Hex color for color-swatch items (Colors category only). */
  readonly visualColor?: string;
  /**
   * A longer (roughly one paragraph, 5-7 sentences) description of this
   * item, shown in its own section below the flash card on the Learn
   * lesson page — unlike `fact` (a single short "did you know" line), this
   * is meant to give each item page substantive, unique reading content.
   * Optional: categories/items without one yet simply render no section.
   */
  readonly longDescription?: string;
}
