"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App, type URLOpenListenerEvent } from "@capacitor/app";
import { toNativeStaticHref } from "@/components/shared/static-link";

/**
 * Turns an incoming `https://` URL (an Android App Link tap, or the iOS
 * Universal Link equivalent if this app ever ships on iOS) into an in-app
 * navigation, using the exact same extensionless-route → `.html` rule
 * `StaticLink` uses for every other native navigation in this app.
 *
 * A non-`http(s)` scheme is ignored rather than navigated — this app
 * declares no custom URL scheme, so anything else reaching here would be
 * some other plugin's callback, not a link meant for in-app routing.
 */
function navigateToIncomingUrl(rawUrl: string) {
  let incoming: URL;
  try {
    incoming = new URL(rawUrl);
  } catch {
    return;
  }

  if (incoming.protocol !== "http:" && incoming.protocol !== "https:") return;

  const relative = `${incoming.pathname}${incoming.search}${incoming.hash}`;
  window.location.href = toNativeStaticHref(relative);
}

/**
 * Makes the Android App Link declared in `android/app/src/main/AndroidManifest.xml`
 * (verified via `public/.well-known/assetlinks.json`) actually take the child
 * to the right screen when a shared link — e.g. the "Share my progress" link
 * on the Rewards page — is opened and this app is already installed, instead
 * of just bringing the app to the foreground on whatever screen it already
 * had open.
 *
 * Two cases, both routed through the same `navigateToIncomingUrl`:
 *  - The app was already running: Capacitor fires `appUrlOpen`.
 *  - The app was launched fresh by the link (cold start): `appUrlOpen` can
 *    fire before this listener has a chance to attach, so `getLaunchUrl()`
 *    is also checked once on mount, which is Capacitor's documented way to
 *    catch exactly that case.
 *
 * No-ops entirely on the web build (`Capacitor.isNativePlatform()` is only
 * true inside the packaged app) — on the web, App Links/Universal Links are
 * a platform-level (Android/iOS), not a webpage-level, concern.
 */
export function DeepLinkHandler() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listenerPromise = App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      navigateToIncomingUrl(event.url);
    });

    App.getLaunchUrl().then((result) => {
      if (result?.url) navigateToIncomingUrl(result.url);
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
  }, []);

  return null;
}
