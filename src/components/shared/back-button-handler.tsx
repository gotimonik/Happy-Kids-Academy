"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

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
