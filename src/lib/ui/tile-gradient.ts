import type { CSSProperties } from "react";

/**
 * A richer diagonal gradient for tile/card backgrounds, built from a single
 * base color — lighter at the top-left fading to a deeper shade at the
 * bottom-right, for more visual depth than a flat fill.
 *
 * `backgroundColor` is set as a plain-color fallback: if a browser doesn't
 * support `color-mix()`, that one `backgroundImage` declaration is simply
 * ignored rather than breaking the whole background.
 */
export function tileGradient(color: string): CSSProperties {
  return {
    backgroundColor: color,
    backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${color} 82%, white) 0%, ${color} 45%, color-mix(in srgb, ${color} 70%, black) 100%)`,
  };
}
