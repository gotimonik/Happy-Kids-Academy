"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/analytics/config";

/** Reads the browser's Do Not Track / Global Privacy Control signal, if any. */
function hasDoNotTrackSignal(): boolean {
  const nav = navigator as Navigator & { msDoNotTrack?: string; globalPrivacyControl?: boolean };
  const win = window as Window & { doNotTrack?: string };
  return (
    win.doNotTrack === "1" ||
    nav.doNotTrack === "1" ||
    nav.doNotTrack === "yes" ||
    nav.msDoNotTrack === "1" ||
    nav.globalPrivacyControl === true
  );
}

/**
 * Google Analytics 4 (gtag.js), wired for the App Router.
 *
 * The stock gtag.js snippet only fires a `page_view` on the initial document
 * load — it has no idea about client-side route changes, so without extra
 * work every in-app navigation (e.g. Home → Learn → a quiz) would be invisible
 * to GA. The effect below watches the router's pathname/search params and
 * sends an explicit `page_view` on every change after the first.
 *
 * Privacy: Google Signals and ad-personalization signals are explicitly
 * disabled below, since this is a children's app and should never feed
 * advertising/remarketing profiles. GA4 anonymizes IP by default.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Reading navigator/window signals is an environment check, not something
    // derivable during render, so it's resolved post-mount like the rest of
    // this app's browser-feature checks.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShouldLoad(Boolean(GA_MEASUREMENT_ID) && !hasDoNotTrackSignal());
  }, []);

  useEffect(() => {
    if (!shouldLoad || typeof window.gtag !== "function") return;

    // The initial page_view is already sent by the bootstrap `gtag('config', ...)`
    // call below, so skip re-sending it the moment this effect first runs.
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams, shouldLoad]);

  if (!shouldLoad) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('set', 'allow_google_signals', false);
          gtag('set', 'allow_ad_personalization_signals', false);
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            restricted_data_processing: true
          });
        `}
      </Script>
    </>
  );
}
