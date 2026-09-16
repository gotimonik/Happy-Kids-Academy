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

/**
 * A soft, semi-transparent glow blob behind a hero icon, fading a single
 * accent color into transparency. Used by `StreakWelcomeModal` so the glow
 * behind its hero icon matches whichever category is picked for the day
 * instead of a fixed two-color blend that ignores what's actually shown.
 */
export function glowGradient(color: string): CSSProperties {
  return {
    backgroundImage: `radial-gradient(circle at 30% 30%, color-mix(in srgb, ${color} 55%, transparent) 0%, color-mix(in srgb, ${color} 15%, transparent) 70%, transparent 100%)`,
  };
}

/**
 * The same "tactile" 3D-edge shadow language `Button` uses (see
 * button.tsx) — a hard-edged "lip" in a darker shade of the color plus a
 * soft ambient glow beneath it, so a badge/card reads as a raised, tactile
 * object instead of a flat shape. Button builds this from a CSS custom
 * property (`--btn-accent`) since its color can come from a theme variant;
 * this version takes a plain color directly for one-off elements (a hero
 * icon badge, a spotlight card) that aren't built from that component.
 */
export function tactileShadow(color: string, lift = 4): CSSProperties {
  return {
    boxShadow: `0 ${lift}px 0 0 color-mix(in srgb, ${color} 100%, black 22%), 0 ${lift * 2.5}px ${lift * 4}px -${lift * 2}px color-mix(in srgb, ${color} 60%, transparent)`,
  };
}
