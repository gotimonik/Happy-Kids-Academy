/**
 * Thin wrapper around `navigator.vibrate`, replacing Android `Vibrator`.
 * No-ops silently on browsers/devices without vibration support (e.g. iOS Safari, desktop).
 */
export function vibrate(pattern: number | number[]): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers throw when called outside a user gesture; safe to ignore.
  }
}
