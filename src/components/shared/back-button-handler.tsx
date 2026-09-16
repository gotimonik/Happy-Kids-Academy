"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { normalizePathname, toNativeStaticHref } from "./static-link";

/**
 * A category's Lesson/Practice/Quiz screen (`/learn/<slug>/lesson`, etc.)
 * each step through their own items with plain in-memory React state —
 * `LessonCarousel`, `PracticePageClient`, and `CategoryQuizClient` all move
 * between letters/questions via `setIndex`, never a URL or history change.
 * That's exactly why the hardware back button used to feel broken here: with
 * only one real WebView history entry for the whole screen, `history.back()`
 * jumps straight past it to whatever's *behind* it — except Android's
 * predictive-back/bfcache restore can instead hand the WebView back a
 * snapshot of this same document from partway through, which visually reads
 * as "back" landed on an earlier letter instead of leaving the lesson.
 * Either way, stepping through items should never be what the hardware back
 * button does. So any of these three screens is special-cased to jump
 * straight to that category's hub instead of trusting raw browser history —
 * matching the same "Up" semantics as the on-screen Back button in the
 * app header, regardless of how many items were stepped through inside.
 */
function categoryHubHref(pathname: string): string | null {
  // The native WebView serves the static export's literal `.html` files
  // (e.g. `/learn/birds/lesson.html`), so `window.location.pathname` here
  // is that raw on-disk path, not the extensionless route — `normalizePathname`
  // (the same rule `StaticLink` and `DeepLinkHandler` compare against) turns
  // it back into a plain route before matching against it.
  const match = /^\/learn\/([^/]+)\/(lesson|practice|quiz)$/.exec(normalizePathname(pathname));
  return match ? `/learn/${match[1]}` : null;
}

/**
 * Handles the Android hardware back button.
 *
 * Every in-app link goes through a full page navigation on native platforms
 * (see `StaticLink` — needed because this is a static-exported Next.js site
 * with no server to power soft client-side transitions). Because of that,
 * the native WebView's own back/forward list *is* the app's route history,
 * and Capacitor's `backButton` event tells us whether that list has
 * somewhere to go via its `canGoBack` flag.
 *
 * Capacitor is documented to fall back to this same canGoBack-then-goBack
 * check on its own when no listener is registered, but leaving it to the
 * default has been unreliable in practice (notably with Android 13+'s
 * predictive-back gesture, which can bypass the WebView check and just
 * finish the activity). Registering the listener explicitly here makes the
 * behavior consistent and gives us one place to decide what happens once
 * the user is back at the root of the stack.
 */
export function BackButtonHandler() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listenerPromise = App.addListener("backButton", ({ canGoBack }) => {
      const hubHref = categoryHubHref(window.location.pathname);
      if (hubHref) {
        window.location.href = toNativeStaticHref(hubHref);
        return;
      }

      if (canGoBack) {
        window.history.back();
      } else {
        // Nothing to go back to — minimize (send to background) rather
        // than force-quitting, matching standard Android back-button
        // behavior at the root of an app. Swap for App.exitApp() if you'd
        // rather the app close outright here.
        App.minimizeApp();
      }
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
  }, []);

  return null;
}
