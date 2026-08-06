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

/**
 * The app's signature multi-color gradient — used for the sticky top header
 * and the home page's hero banner, the two most prominent "brand moments" a
 * kid sees. Unlike `tileGradient` (which shades a single color light-to-dark),
 * this blends three palette colors already used elsewhere in the app —
 * primary purple, the Colors category's violet, and the Alphabet category's
 * coral-pink — for a livelier, more playful look in these specific spots.
 */
export function heroGradient(): CSSProperties {
  return {
    backgroundColor: "#6C5CE7",
    backgroundImage: "linear-gradient(135deg, #6C5CE7 0%, #A45EEA 50%, #FF707D 100%)",
  };
}
