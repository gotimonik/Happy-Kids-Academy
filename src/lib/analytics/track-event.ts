"use client";

import { Capacitor } from "@capacitor/core";

/**
 * Fires a GA4 custom event. Safely no-ops if analytics hasn't loaded yet
 * (e.g. blocked by an ad blocker, or fired before the gtag script finishes
 * loading) — engagement analytics should never be able to break the app.
 */
export function trackEvent(name: string, params?: Record<string, string | number | boolean>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  // Never in the iOS app: Kids Category apps may not use third-party analytics (see GoogleAnalytics).
  if (Capacitor.getPlatform() === "ios") return;
  window.gtag("event", name, params);
}
