/**
 * Inclusive range of table numbers a child can actually select (via the
 * ‹ › stepper or the jump-to-number field) and practice (`?table=<n>` in
 * `TimesTablesPageContent`). Kept generous — the jump field is specifically
 * there so someone can type a number far outside the browsable strip below
 * and go straight to it.
 */
export const MIN_TABLE = 1;
export const MAX_TABLE = 1000;

/**
 * How far the horizontally-scrolling chip strip in `TimesTablesHub` actually
 * renders, deliberately much smaller than `MAX_TABLE` — scrolling through
 * hundreds of chips isn't a practical way to browse. Anything beyond this
 * is reached via the jump field instead, not by scrolling the strip.
 */
export const STRIP_MAX_TABLE = 100;

export function clampTable(value: number): number {
  return Math.min(MAX_TABLE, Math.max(MIN_TABLE, Math.round(value)));
}
