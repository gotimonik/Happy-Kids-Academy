"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Forces every route change back to the top of the page.
 *
 * Next's App Router normally does this on its own, but here it loses the
 * race against the mobile nav drawer (`MobileNavDrawer`): tapping a link
 * inside it fires the route change immediately, while Radix's scroll-lock
 * cleanup (removing the `position: fixed` it applies to `<body>` while the
 * drawer is open) only runs once the drawer's close animation finishes a
 * beat later — and that cleanup restores the scroll offset the page had
 * *before* the drawer opened. Net effect: navigating to Settings/Rewards/
 * Parents from the drawer while scrolled partway down an earlier page (e.g.
 * the Games grid) briefly resets to the top, then snaps back down, hiding
 * the new page's own top section.
 *
 * Re-applying the reset on the next animation frame and again after a short
 * delay (comfortably longer than the drawer's close transition) wins that
 * race without needing to reach into Radix's internals. Also opts out of
 * the browser's own back/forward scroll restoration so history navigation
 * doesn't reintroduce the same kind of mismatch.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    scrollToTop();
    const raf = requestAnimationFrame(scrollToTop);
    const timeout = setTimeout(scrollToTop, 350);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}
