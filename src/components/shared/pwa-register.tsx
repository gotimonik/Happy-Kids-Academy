"use client";

import { useEffect } from "react";

/** Registers the offline-caching service worker. Renders nothing. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failures (e.g. unsupported browser) are non-fatal.
    });
  }, []);

  return null;
}
