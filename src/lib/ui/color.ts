/**
 * WCAG relative luminance (0 = black, 1 = white) of a `#rgb`/`#rrggbb`
 * color, or `null` for anything else (a `var(--…)`, `color-mix()`, named
 * color…) whose actual value can't be known in JS.
 */
export function relativeLuminance(color: string): number | null {
  let hex = color.trim();
  if (/^#[0-9a-f]{3}$/i.test(hex)) hex = `#${[...hex.slice(1)].map((c) => c + c).join("")}`;
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return null;
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

/** Near-black colors (e.g. Vehicles' charcoal `#2D3436`) that disappear against the dark-mode card. */
export function isVeryDark(color: string): boolean {
  const l = relativeLuminance(color);
  return l !== null && l < 0.06;
}

/** Light enough (pale yellow, etc.) that white text on it would be hard to read. */
export function isLight(color: string): boolean {
  const l = relativeLuminance(color);
  return l !== null && l > 0.55;
}
